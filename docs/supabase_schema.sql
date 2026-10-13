-- ==============================================================================
-- POTVRDIO.ONLINE - SUPABASE DATABASE SCHEMA (PRODUCTION V1.0)
-- Multi-Tenant WooCommerce COD Verification Engine
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Merchants Table (Stores, Accounts & Credit Quotas)
CREATE TABLE IF NOT EXISTS public.merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name TEXT NOT NULL,
    store_domain TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    phone TEXT,
    api_key TEXT NOT NULL UNIQUE,
    api_secret TEXT NOT NULL,
    plan_type TEXT NOT NULL DEFAULT 'PILOT',
    trial_verifications_remaining INTEGER NOT NULL DEFAULT 25,
    message_credits_remaining INTEGER NOT NULL DEFAULT 0,
    is_connected BOOLEAN NOT NULL DEFAULT false,
    last_ping_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for instant lookup on high-frequency API calls
CREATE INDEX IF NOT EXISTS idx_merchants_api_key ON public.merchants(api_key);
CREATE INDEX IF NOT EXISTS idx_merchants_store_domain ON public.merchants(store_domain);
CREATE INDEX IF NOT EXISTS idx_merchants_email ON public.merchants(email);

-- 3. Orders Table (Intercepted COD Orders & Real-time Verification Lifecycle)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
    merchant_api_key TEXT NOT NULL,
    order_id TEXT NOT NULL,
    customer_name TEXT,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    city TEXT DEFAULT 'Beograd',
    address TEXT,
    shipping_address JSONB DEFAULT '{}'::jsonb,
    billing_address JSONB DEFAULT '{}'::jsonb,
    total_amount NUMERIC(12, 2) DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'RSD',
    status TEXT NOT NULL DEFAULT 'SMS_FALLBACK',
    channel TEXT NOT NULL DEFAULT 'SMS',
    response_time TEXT DEFAULT 'Čeka se potvrda kupca...',
    warehouse_action TEXT DEFAULT 'Na čekanju (On-Hold) · Poslat verifikacioni link',
    cost_saved TEXT DEFAULT '€3.50',
    history JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_merchant_order UNIQUE (merchant_api_key, order_id)
);

-- Indexes for instant merchant dashboard querying
CREATE INDEX IF NOT EXISTS idx_orders_merchant_api_key ON public.orders(merchant_api_key);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON public.orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 4. Store Pings Audit Table (Bi-directional Signal Log)
CREATE TABLE IF NOT EXISTS public.store_pings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key TEXT NOT NULL,
    store_domain TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_store_pings_api_key ON public.store_pings(api_key);

-- 5. Atomic Credit Decrement & Quota Safety Function (Prevents Race Conditions)
CREATE OR REPLACE FUNCTION public.decrement_merchant_quota(p_api_key TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_merchant RECORD;
    v_has_quota BOOLEAN := false;
BEGIN
    SELECT * INTO v_merchant 
    FROM public.merchants 
    WHERE api_key = p_api_key 
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'MERCHANT_NOT_FOUND',
            'can_verify', false
        );
    END IF;

    -- Case 1: Active Pilot Period (Deduct from free 25 verifications)
    IF v_merchant.trial_verifications_remaining > 0 THEN
        UPDATE public.merchants 
        SET trial_verifications_remaining = trial_verifications_remaining - 1,
            updated_at = NOW()
        WHERE id = v_merchant.id;

        RETURN jsonb_build_object(
            'success', true,
            'is_trial', true,
            'can_verify', true,
            'trial_remaining', v_merchant.trial_verifications_remaining - 1,
            'credits_remaining', v_merchant.message_credits_remaining
        );
    END IF;

    -- Case 2: Paid Message Credits Available
    IF v_merchant.message_credits_remaining > 0 THEN
        UPDATE public.merchants 
        SET message_credits_remaining = message_credits_remaining - 1,
            updated_at = NOW()
        WHERE id = v_merchant.id;

        RETURN jsonb_build_object(
            'success', true,
            'is_trial', false,
            'can_verify', true,
            'trial_remaining', 0,
            'credits_remaining', v_merchant.message_credits_remaining - 1
        );
    END IF;

    -- Case 3: Out of quota / credits exhausted
    RETURN jsonb_build_object(
        'success', false,
        'error', 'INSUFFICIENT_CREDITS',
        'can_verify', false,
        'trial_remaining', 0,
        'credits_remaining', 0
    );
END;
$$;

-- 6. Updated Timestamp Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_merchants_updated_at
BEFORE UPDATE ON public.merchants
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 7. Payment Requests & Proforma Tracking (B2B Wire / NBS IPS QR Top-Ups)
CREATE TABLE IF NOT EXISTS public.payment_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_api_key TEXT NOT NULL,
    store_domain TEXT NOT NULL,
    merchant_email TEXT NOT NULL,
    proforma_number TEXT NOT NULL UNIQUE,
    plan_id TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    credits INTEGER NOT NULL,
    amount_eur NUMERIC(10, 2) NOT NULL,
    amount_rsd NUMERIC(12, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payment_requests_proforma ON public.payment_requests(proforma_number);
CREATE INDEX IF NOT EXISTS idx_payment_requests_api_key ON public.payment_requests(merchant_api_key);

-- 8. Atomic Payment Approval Function (Admin Credit Top-Up)
CREATE OR REPLACE FUNCTION public.approve_merchant_payment(p_proforma TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_req RECORD;
BEGIN
    SELECT * INTO v_req FROM public.payment_requests WHERE proforma_number = p_proforma FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'PROFORMA_NOT_FOUND');
    END IF;
    IF v_req.status = 'APPROVED' THEN
        RETURN jsonb_build_object('success', true, 'already_approved', true, 'credits', v_req.credits);
    END IF;

    UPDATE public.merchants 
    SET message_credits_remaining = message_credits_remaining + v_req.credits,
        plan_type = 'PAID',
        updated_at = NOW()
    WHERE api_key = v_req.merchant_api_key;

    UPDATE public.payment_requests
    SET status = 'APPROVED',
        approved_at = NOW()
    WHERE id = v_req.id;

    RETURN jsonb_build_object(
        'success', true, 
        'credits_added', v_req.credits, 
        'merchant_api_key', v_req.merchant_api_key,
        'store_domain', v_req.store_domain,
        'merchant_email', v_req.merchant_email
    );
END;
$$;
