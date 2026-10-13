/**
 * Serverless Supabase REST Client
 * High-performance, zero-dependency client using standard Fetch API
 */

export interface DbMerchant {
  id: string;
  store_name: string;
  store_domain: string;
  email: string;
  phone?: string | null;
  api_key: string;
  api_secret: string;
  plan_type: string;
  trial_verifications_remaining: number;
  message_credits_remaining: number;
  is_connected: boolean;
  last_ping_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbOrder {
  id: string;
  merchant_id?: string;
  merchant_api_key: string;
  order_id: string;
  customer_name?: string | null;
  customer_phone: string;
  customer_email?: string | null;
  city?: string | null;
  address?: string | null;
  shipping_address?: any;
  billing_address?: any;
  total_amount?: number;
  currency: string;
  status: string;
  channel: string;
  response_time?: string;
  warehouse_action?: string;
  cost_saved?: string;
  history: any[];
  created_at: string;
  updated_at: string;
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  return {
    url: url.replace(/\/+$/, ''),
    key,
    isConfigured: Boolean(url && key),
  };
}

export const supabase = {
  isConfigured(): boolean {
    return getSupabaseConfig().isConfigured;
  },

  async query<T = any>(table: string, options: {
    select?: string;
    filters?: Record<string, string>;
    order?: string;
    limit?: number;
  } = {}): Promise<T[]> {
    const { url, key, isConfigured } = getSupabaseConfig();
    if (!isConfigured) return [];

    let endpoint = `${url}/rest/v1/${table}?select=${encodeURIComponent(options.select || '*')}`;
    if (options.filters) {
      for (const [col, val] of Object.entries(options.filters)) {
        endpoint += `&${col}=eq.${encodeURIComponent(val)}`;
      }
    }
    if (options.order) {
      endpoint += `&order=${encodeURIComponent(options.order)}`;
    }
    if (options.limit) {
      endpoint += `&limit=${options.limit}`;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        console.warn(`[SUPABASE QUERY ERROR] ${table}:`, res.status, await res.text().catch(() => ''));
        return [];
      }
      return await res.json();
    } catch (err: any) {
      console.warn(`[SUPABASE NETWORK ERROR] ${table}:`, err?.message || err);
      return [];
    }
  },

  async insert<T = any>(table: string, records: any | any[]): Promise<T[]> {
    const { url, key, isConfigured } = getSupabaseConfig();
    if (!isConfigured) return [];

    const payload = Array.isArray(records) ? records : [records];
    const endpoint = `${url}/rest/v1/${table}`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.warn(`[SUPABASE INSERT ERROR] ${table}:`, res.status, await res.text().catch(() => ''));
        return [];
      }
      return await res.json();
    } catch (err: any) {
      console.warn(`[SUPABASE INSERT NETWORK ERROR] ${table}:`, err?.message || err);
      return [];
    }
  },

  async upsert<T = any>(table: string, records: any | any[], onConflict?: string): Promise<T[]> {
    const { url, key, isConfigured } = getSupabaseConfig();
    if (!isConfigured) return [];

    const payload = Array.isArray(records) ? records : [records];
    let endpoint = `${url}/rest/v1/${table}`;
    if (onConflict) {
      endpoint += `?on_conflict=${encodeURIComponent(onConflict)}`;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=representation',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.warn(`[SUPABASE UPSERT ERROR] ${table}:`, res.status, await res.text().catch(() => ''));
        return [];
      }
      return await res.json();
    } catch (err: any) {
      console.warn(`[SUPABASE UPSERT NETWORK ERROR] ${table}:`, err?.message || err);
      return [];
    }
  },

  async update<T = any>(table: string, updates: Record<string, any>, filters: Record<string, string>): Promise<T[]> {
    const { url, key, isConfigured } = getSupabaseConfig();
    if (!isConfigured) return [];

    let endpoint = `${url}/rest/v1/${table}`;
    const params = new URLSearchParams();
    for (const [col, val] of Object.entries(filters)) {
      params.append(col, `eq.${val}`);
    }
    endpoint += `?${params.toString()}`;

    try {
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        console.warn(`[SUPABASE UPDATE ERROR] ${table}:`, res.status, await res.text().catch(() => ''));
        return [];
      }
      return await res.json();
    } catch (err: any) {
      console.warn(`[SUPABASE UPDATE NETWORK ERROR] ${table}:`, err?.message || err);
      return [];
    }
  },

  async rpc<T = any>(functionName: string, params: Record<string, any>): Promise<T | null> {
    const { url, key, isConfigured } = getSupabaseConfig();
    if (!isConfigured) return null;

    const endpoint = `${url}/rest/v1/rpc/${functionName}`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        console.warn(`[SUPABASE RPC ERROR] ${functionName}:`, res.status, await res.text().catch(() => ''));
        return null;
      }
      return await res.json();
    } catch (err: any) {
      console.warn(`[SUPABASE RPC NETWORK ERROR] ${functionName}:`, err?.message || err);
      return null;
    }
  },
};
