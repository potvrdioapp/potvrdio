<?php
/**
 * Plugin Name: Potvrdio Online - WooCommerce COD Verification & Address Protection
 * Plugin URI: https://potvrdio.online
 * Description: Automatska verifikacija adresa i telefona kupaca za porudžbine pouzećem (COD). Sprečava skupe povrate paketa i lažne porudžbine pre slanja kurirskoj službi.
 * Version: 1.1.2
 * Author: Potvrdio.online
 * Author URI: https://potvrdio.online
 * Text Domain: potvrdio-online
 * Domain Path: /languages
 * WC requires at least: 5.0
 * WC tests up to: 11.5
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// 1. High-Performance Order Storage (HPOS) Official Compatibility Declaration
add_action('before_woocommerce_init', function() {
    if (class_exists('\Automattic\WooCommerce\Utilities\FeaturesUtil')) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
    }
});

class Potvrdio_Viber_COD {
    private static $instance = null;
    private $api_endpoint;
    private $api_key;
    private $api_secret;
    private $is_reverting_status = false;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $endpoint = get_option('potvrdio_api_endpoint');
        $this->api_endpoint = !empty($endpoint) ? $endpoint : 'https://potvrdio.online/api/v1';

        $key = get_option('potvrdio_api_key');
        $this->api_key      = !empty($key) ? trim($key) : '';

        $secret = get_option('potvrdio_api_secret');
        $this->api_secret   = !empty($secret) ? trim($secret) : '';

        if (is_admin()) {
            add_action('admin_notices', array($this, 'render_missing_api_key_notice'));
        }

        // =========================================================================
        // A. IRONCLAD ORDER INTERCEPTION (Multiple redundant hooks to prevent bypass)
        // =========================================================================

        // 1. Gateway Level: Force WooCommerce COD default order status from 'processing' to 'on-hold'
        add_filter('woocommerce_cod_process_payment_order_status', array($this, 'force_cod_order_status_on_hold'), 999, 2);

        // 2. Database State Machine Gatekeeper: Prevents ANY plugin/funnel from moving COD to processing/completed without verification
        add_action('woocommerce_order_status_changed', array($this, 'enforce_order_status_gatekeeper'), 10, 4);

        // 3. Modern Gutenberg Block Checkout Hook (WooCommerce 8.0+ / Store API)
        add_action('woocommerce_store_api_checkout_order_processed', array($this, 'intercept_from_store_api'), 10, 1);

        // 4. Classic Shortcode Checkout Hook
        add_action('woocommerce_checkout_order_processed', array($this, 'intercept_from_classic_checkout'), 10, 3);

        // 5. Universal Order Creation Hook (Fires for CartFlows, FunnelKit, REST API, Elementor, One-Click Buy)
        add_action('woocommerce_new_order', array($this, 'intercept_from_universal_new_order'), 20, 2);

        // 6. Thank You / Order Received Page Hook: Display clear On-Hold status banner at the very top of the page
        add_action('woocommerce_before_thankyou', array($this, 'ensure_cod_order_on_hold'), 1, 1);
        add_action('woocommerce_before_thankyou', array($this, 'display_on_hold_viber_notice'), 5, 1);
        // Fallback for themes omitting woocommerce_before_thankyou
        add_action('woocommerce_thankyou', array($this, 'display_on_hold_viber_notice'), 10, 1);

        // =========================================================================
        // B. FIELD REQUIREMENTS & PRIVACY CONSENT
        // =========================================================================

        // System-wide: Force WooCommerce Checkout Phone Field Option to 'required' (removes '(optional)' in core & blocks)
        add_filter('option_woocommerce_checkout_phone_field', array($this, 'force_phone_field_required_option'), 9999);
        add_filter('default_option_woocommerce_checkout_phone_field', array($this, 'force_phone_field_required_option'), 9999);

        // Enforce Billing Phone as strictly required in form definition (Classic, Blocks & Custom Field Editors)
        add_filter('woocommerce_billing_fields', array($this, 'enforce_phone_required_on_checkout'), 99999, 1);
        add_filter('woocommerce_checkout_fields', array($this, 'enforce_all_checkout_fields_phone_required'), 99999, 1);

        // Enforce Phone validation on Classic Checkout
        add_action('woocommerce_after_checkout_validation', array($this, 'validate_phone_on_checkout'), 10, 2);

        // Core Engine Level Hard Block: Aborts database transaction if COD is attempted without phone
        add_action('woocommerce_checkout_create_order', array($this, 'strictly_block_order_creation_without_phone'), 10, 2);

        // Modern Block-Based Checkout Hook (Store API): Aborts order creation
        add_action('woocommerce_store_api_checkout_update_order_from_request', array($this, 'validate_block_checkout_phone'), 10, 2);

        // Headless & External REST API Hook: Aborts API creation if COD without phone
        add_filter('woocommerce_rest_pre_insert_shop_order_object', array($this, 'strictly_block_rest_api_without_phone'), 10, 3);

        // Client-side real-time phone validation for customized funnels, Elementor & CartFlows
        add_action('wp_footer', array($this, 'inject_checkout_phone_enforcement_script'), 99);

        // Classic Shortcode Privacy Consent Checkbox
        add_action('woocommerce_review_order_before_submit', array($this, 'add_privacy_consent_checkbox'));
        add_action('woocommerce_checkout_process', array($this, 'validate_privacy_consent_checkbox'));
        add_action('woocommerce_checkout_update_order_meta', array($this, 'save_privacy_consent_meta'));

        // =========================================================================
        // C. WEBHOOKS & ADMIN UI
        // =========================================================================

        // Register custom REST API webhook endpoint for central backend signals
        add_action('rest_api_init', array($this, 'register_webhook_routes'));

        // Admin Order Detail Meta Box (Shows Verification Status Badge)
        add_action('add_meta_boxes', array($this, 'register_order_meta_box'));

        // 24-Hour Timeout Cron & Action Scheduler Handler for Unconfirmed Orders
        add_action('potvrdio_order_timeout_check', array($this, 'handle_order_timeout'), 10, 1);

        // Edge Case 11: Asynchronous Dispatch Queue via Action Scheduler
        add_action('potvrdio_async_dispatch_intercept', array($this, 'handle_async_dispatch_intercept'), 10, 1);

        // Edge Case 9: Admin Manual Order Verification Action
        add_action('admin_post_potvrdio_manual_verify', array($this, 'handle_admin_manual_verify'));
        add_action('admin_post_potvrdio_cloud_sync', array($this, 'handle_admin_cloud_sync'));

        // Live polling endpoints for Thank You screen (ultra-lightweight status check)
        add_action('wc_ajax_potvrdio_check_order_status', array($this, 'ajax_check_order_status'));
        add_action('wp_ajax_potvrdio_check_order_status', array($this, 'ajax_check_order_status'));
        add_action('wp_ajax_nopriv_potvrdio_check_order_status', array($this, 'ajax_check_order_status'));

        // Local development test helper for .local / localhost test stores
        add_action('wc_ajax_potvrdio_dev_simulate_verify', array($this, 'ajax_dev_simulate_verify'));
        add_action('wp_ajax_potvrdio_dev_simulate_verify', array($this, 'ajax_dev_simulate_verify'));
        add_action('wp_ajax_nopriv_potvrdio_dev_simulate_verify', array($this, 'ajax_dev_simulate_verify'));

        // Admin Menu Settings
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_init', array($this, 'check_and_sync_admin_orders'));
        add_action('update_option_potvrdio_api_key', array($this, 'ping_central_backend'));
        add_action('update_option_potvrdio_api_endpoint', array($this, 'ping_central_backend'));

        // Background Cloud Periodic Sync for pending orders
        add_action('potvrdio_cron_sync_pending_orders', array($this, 'sync_recent_pending_orders'));
        add_action('potvrdio_wp_cron_sync_orders', array($this, 'sync_recent_pending_orders'));
        if (function_exists('as_has_scheduled_action') && !as_has_scheduled_action('potvrdio_cron_sync_pending_orders')) {
            as_schedule_recurring_action(time() + 60, 60, 'potvrdio_cron_sync_pending_orders');
        } elseif (!wp_next_scheduled('potvrdio_wp_cron_sync_orders')) {
            wp_schedule_event(time() + 300, 'hourly', 'potvrdio_wp_cron_sync_orders');
        }
    }

    /**
     * 1. Force COD Gateway to return 'on-hold' instead of 'processing'
     */
    public function force_cod_order_status_on_hold($status, $order) {
        return 'on-hold';
    }

    /**
     * 2. Database State Machine Gatekeeper:
     * If ANY external plugin, funnel (CartFlows), or payment gateway attempts to change a COD order
     * to 'processing' or 'completed' before Potvrdio verification is complete, REVERT immediately to 'on-hold'.
     */
    public function enforce_order_status_gatekeeper($order_id, $old_status, $new_status, $order) {
        if ($this->is_reverting_status) {
            return;
        }

        if (!$order || 'cod' !== $order->get_payment_method()) {
            return;
        }

        // Target unverified orders trying to jump into processing/completed
        if (in_array($new_status, array('processing', 'completed'), true)) {
            $is_verified = (bool)$order->get_meta('_potvrdio_verified');
            $is_bypassed = (bool)$order->get_meta('_potvrdio_quota_bypassed');

            if (!$is_verified && !$is_bypassed) {
                // Edge Case 9: Allow manual store manager / administrator override in WP-Admin
                if (is_admin() && current_user_can('manage_woocommerce')) {
                    $order->update_meta_data('_potvrdio_verified', '1');
                    $order->update_meta_data('_potvrdio_admin_override', '1');
                    $order->update_meta_data('_potvrdio_verified_at', current_time('mysql'));
                    $order->add_order_note(__('Potvrdio: Upravnik prodavnice je ručno odobrio porudžbinu (Admin Override).', 'potvrdio-viber-cod'));
                    $order->save();
                    return;
                }

                $this->is_reverting_status = true;
                $order->update_status('on-hold', __('Potvrdio Gatekeeper: Redirection to On-Hold. Shipping paused pending address verification.', 'potvrdio-viber-cod'));
                $this->is_reverting_status = false;

                // Make sure central server has the intercept payload
                $this->process_order_intercept($order);
            }
        }
    }

    /**
     * Hook Handlers for Order Interception
     */
    public function intercept_from_store_api($order) {
        $this->process_order_intercept($order);
    }

    public function intercept_from_classic_checkout($order_id, $posted_data, $order) {
        $this->process_order_intercept($order);
    }

    public function intercept_from_universal_new_order($order_id, $order = null) {
        if (!$order) {
            $order = wc_get_order($order_id);
        }
        if ($order) {
            $this->process_order_intercept($order);
        }
    }

    public function ensure_cod_order_on_hold($order_id) {
        if (!$order_id) return;
        $order = wc_get_order($order_id);
        if (!$order || 'cod' !== $order->get_payment_method()) return;

        if (!$order->get_meta('_potvrdio_verified')) {
            if ('on-hold' !== $order->get_status()) {
                $order->update_status('on-hold', __('Potvrdio: Order paused for address verification.', 'potvrdio-viber-cod'));
            }
            $this->process_order_intercept($order);
        }
    }

    /**
     * Core Intercept Processor: Deduplicates, normalizes phone, locks on-hold, and sends payload to Central Backend
     */
    public function process_order_intercept($order) {
        if (!$order || 'cod' !== $order->get_payment_method()) {
            return;
        }

        // Avoid duplicate webhook dispatch for the same order
        if ($order->get_meta('_potvrdio_intercepted')) {
            return;
        }

        // 3. Universal Phone Extraction & Balkan E.164 Normalization
        $country = $order->get_shipping_country() ?: ($order->get_billing_country() ?: 'RS');
        $raw_phone = $this->extract_order_phone($order);
        $normalized_phone = $this->normalize_balkan_phone($raw_phone, $country);

        // Phone is strictly required for COD verification. Never send fake fallbacks.
        if (empty($normalized_phone)) {
            $note = $this->get_message('admin_missing_phone', $order);
            $order->add_order_note($note);
            $order->save();
            return;
        }

        // Compute deterministic hash of Phone + Exact Delivery Address
        $address_hash = $this->compute_address_phone_hash($normalized_phone, $order);
        if (!empty($address_hash)) {
            $order->update_meta_data('_potvrdio_address_phone_hash', $address_hash);
        }

        // TODO-5: Smart Bypass for Verified Returning Customer ONLY IF DELIVERY ADDRESS MATCHES EXACTLY
        $auto_approve_enabled = (get_option('potvrdio_auto_approve_returning', '0') === '1');
        if ($auto_approve_enabled && !empty($address_hash)) {
            $prev_orders = wc_get_orders(array(
                'limit'        => 1,
                'status'       => array('completed', 'processing'),
                'meta_key'     => '_potvrdio_address_phone_hash',
                'meta_value'   => $address_hash,
                'exclude'      => array($order->get_id()),
            ));

            if (!empty($prev_orders)) {
                $prev_order = $prev_orders[0];
                $prev_id    = $prev_order->get_id();

                $order->update_meta_data('_potvrdio_intercepted', '1');
                $order->update_meta_data('_potvrdio_verified', '1');
                $order->update_meta_data('_potvrdio_smart_bypass', '1');
                $order->update_meta_data('_potvrdio_verified_at', current_time('mysql'));
                $order->update_meta_data('_potvrdio_normalized_phone', $normalized_phone);
                $order->update_status('processing', sprintf(__('Potvrdio Smart Bypass: Kupac i tačna adresa isporuke su već verifikovani u prethodnoj porudžbini #%d. Automatski pušteno u pripremu za kurira.', 'potvrdio-viber-cod'), $prev_id));
                $order->save();
                return;
            }
        }

        // Set on-hold status and mark intercepted
        $order->update_meta_data('_potvrdio_intercepted', '1');
        if ('on-hold' !== $order->get_status()) {
            $order->update_status('on-hold', __('Potvrdio: Order paused for address verification.', 'potvrdio-viber-cod'));
        }
        $order->save();

        $customer_name = trim($order->get_billing_first_name() . ' ' . $order->get_billing_last_name());
        if (empty($customer_name)) {
            $customer_name = 'Kupac';
        }

        $items = array();
        foreach ($order->get_items() as $item_id => $item) {
            $items[] = array(
                'name'     => $item->get_name(),
                'quantity' => $item->get_quantity(),
                'total'    => $item->get_total(),
            );
        }

        $payload = array(
            'order_id'        => (string)$order->get_id(),
            'store_domain'    => get_site_url(),
            'store_name'      => get_bloginfo('name'),
            'customer_name'   => $customer_name,
            'customer_phone'  => $normalized_phone,
            'customer_email'  => $order->get_billing_email(),
            'billing_address' => array(
                'address_1' => $order->get_billing_address_1() ?: 'Knez Mihailova 42',
                'address_2' => $order->get_billing_address_2() ?: '',
                'city'      => $order->get_billing_city() ?: 'Beograd',
                'postcode'  => $order->get_billing_postcode() ?: '11000',
                'country'   => $country,
                'email'     => $order->get_billing_email(),
            ),
            'shipping_address' => array(
                'address_1' => $order->get_shipping_address_1() ?: ($order->get_billing_address_1() ?: 'Knez Mihailova 42'),
                'address_2' => $order->get_shipping_address_2() ?: $order->get_billing_address_2(),
                'city'      => $order->get_shipping_city() ?: ($order->get_billing_city() ?: 'Beograd'),
                'postcode'  => $order->get_shipping_postcode() ?: ($order->get_billing_postcode() ?: '11000'),
                'country'   => $country,
            ),
            'currency'       => $order->get_currency() ?: 'RSD',
            'total_amount'   => (float)$order->get_total(),
            'order_note'     => $order->get_customer_note(),
            'items'          => $items,
            'timestamp'      => time(),
        );

        // Store normalized phone in order meta for tracking
        $order->update_meta_data('_potvrdio_normalized_phone', $normalized_phone);
        $order->save();

        // Schedule 24-hour timeout expiration check (Action Scheduler or WP Cron)
        $order_id = $order->get_id();
        if (function_exists('as_schedule_single_action') && function_exists('as_has_scheduled_action')) {
            if (!as_has_scheduled_action('potvrdio_order_timeout_check', array('order_id' => $order_id))) {
                as_schedule_single_action(time() + DAY_IN_SECONDS, 'potvrdio_order_timeout_check', array('order_id' => $order_id));
            }
        } elseif (!wp_next_scheduled('potvrdio_order_timeout_check', array($order_id))) {
            wp_schedule_single_event(time() + DAY_IN_SECONDS, 'potvrdio_order_timeout_check', array($order_id));
        }

        // Immediate real-time dispatch to Potvrdio Cloud backend
        $res = $this->send_to_central_backend('/orders/intercept', $payload);

        if (is_array($res) && !empty($res['bypassed']) && ($res['reason'] ?? '') === 'INSUFFICIENT_CREDITS') {
            // Fail-Safe Quota Bypass: Store has run out of verifications/credits.
            // DO NOT block store orders. Release immediately to processing.
            $order->update_meta_data('_potvrdio_verified', '1');
            $order->update_meta_data('_potvrdio_quota_bypassed', '1');
            $order->update_meta_data('_potvrdio_verified_at', current_time('mysql'));
            $order->add_order_note(__('Potvrdio Fail-Safe: Paket verifikacija za Vaš nalog je potrošen. Porudžbina je automatski propuštena u status "Processing" bez odlaganja. Dopunite kredite na potvrdio.online.', 'potvrdio-viber-cod'));
            $order->update_status('processing');
            $order->save();
            return;
        }

        if (!empty($res)) {
            $order->add_order_note(__('Potvrdio: Signal uspešno poslat serveru. Verifikacioni e-mail poslat kupcu.', 'potvrdio-viber-cod'));
        } elseif (function_exists('as_schedule_single_action')) {
            // Resilient fallback: If immediate HTTP call failed or timed out, schedule retry in Action Scheduler
            as_schedule_single_action(time() + 30, 'potvrdio_async_dispatch_intercept', array('payload' => $payload), 'potvrdio');
        }
    }

    /**
     * Async Action Scheduler Callback for Background Delivery
     */
    public function handle_async_dispatch_intercept($payload) {
        if (!empty($payload) && is_array($payload)) {
            $this->send_to_central_backend('/orders/intercept', $payload);
        }
    }

    /**
     * Compute a deterministic normalized hash of Delivery Phone + Delivery Address
     * Only identical phone AND identical delivery address will produce the same hash.
     */
    public function compute_address_phone_hash($phone, $order) {
        if (empty($phone) || !$order) {
            return '';
        }

        $address_1   = strtolower(trim((string)($order->get_shipping_address_1() ?: $order->get_billing_address_1())));
        $city        = strtolower(trim((string)($order->get_shipping_city() ?: $order->get_billing_city())));
        $postcode    = preg_replace('/[^\d\w]/', '', strtolower(trim((string)($order->get_shipping_postcode() ?: $order->get_billing_postcode()))));
        $clean_phone = preg_replace('/[^\d]/', '', (string)$phone);

        return md5($clean_phone . '|' . $address_1 . '|' . $city . '|' . $postcode);
    }

    /**
     * Smart Balkan E.164 Phone Normalizer
     * Converts local numbers (e.g. 064 123 4567) to international format (+381641234567)
     */
    public function normalize_balkan_phone($phone, $country_code = 'RS') {
        if (empty($phone)) {
            return '';
        }

        // Strip everything except digits and plus
        $cleaned = preg_replace('/[^\d+]/', '', trim($phone));

        // Convert leading 00 to +
        if (substr($cleaned, 0, 2) === '00') {
            $cleaned = '+' . substr($cleaned, 2);
        }

        // If already in international format (+...), return it
        if (substr($cleaned, 0, 1) === '+') {
            return $cleaned;
        }

        $country_code = strtoupper($country_code);

        // Country prefix lookup table
        $prefixes = array(
            'RS' => '381', // Serbia
            'BA' => '387', // Bosnia and Herzegovina
            'MK' => '389', // North Macedonia
            'ME' => '382', // Montenegro
            'HR' => '385', // Croatia
        );

        $default_prefix = isset($prefixes[$country_code]) ? $prefixes[$country_code] : '381';

        // If user typed local number with leading zero (e.g., 0641234567 or 070123456)
        if (substr($cleaned, 0, 1) === '0') {
            return '+' . $default_prefix . substr($cleaned, 1);
        }

        // If user typed without zero and without plus (e.g., 381641234567)
        if (substr($cleaned, 0, strlen($default_prefix)) === $default_prefix) {
            return '+' . $cleaned;
        }

        // Fallback: prepend default country code
        return '+' . $default_prefix . $cleaned;
    }

    /**
     * Smart Language & Locale Detection:
     * Resolves the shop and customer language:
     * - 'mk': North Macedonia (Macedonian)
     * - 'sr': Serbia, Bosnia, Croatia, Montenegro (BCS language group)
     * - 'en': English / International fallback
     */
    public function get_effective_language($order = null) {
        // 1. If order object or country in request exists
        if ($order instanceof \WC_Order) {
            $country = $order->get_shipping_country() ?: $order->get_billing_country();
            if ($country === 'MK') return 'mk';
            if (in_array($country, array('RS', 'BA', 'ME', 'HR'), true)) return 'sr';
        }
        // phpcs:disable WordPress.Security.NonceVerification.Missing -- Public checkout form country parameter
        if (!empty($_POST['billing_country'])) {
            $c = strtoupper(sanitize_text_field(wp_unslash($_POST['billing_country'])));
            if ($c === 'MK') return 'mk';
            if (in_array($c, array('RS', 'BA', 'ME', 'HR'), true)) return 'sr';
        }
        if (!empty($_POST['shipping_country'])) {
            $c = strtoupper(sanitize_text_field(wp_unslash($_POST['shipping_country'])));
            if ($c === 'MK') return 'mk';
            if (in_array($c, array('RS', 'BA', 'ME', 'HR'), true)) return 'sr';
        }
        // phpcs:enable WordPress.Security.NonceVerification.Missing

        // 2. Multilingual plugins (WPML / Polylang)
        if (defined('ICL_LANGUAGE_CODE')) {
            $lang = strtolower(substr(ICL_LANGUAGE_CODE, 0, 2));
            if ($lang === 'mk') return 'mk';
            if (in_array($lang, array('sr', 'bs', 'hr', 'me'), true)) return 'sr';
            if ($lang === 'en') return 'en';
        }
        if (function_exists('pll_current_language')) {
            $lang = strtolower(substr(pll_current_language(), 0, 2));
            if ($lang === 'mk') return 'mk';
            if (in_array($lang, array('sr', 'bs', 'hr', 'me'), true)) return 'sr';
            if ($lang === 'en') return 'en';
        }

        // 3. WordPress Locale (e.g. sr_RS, bs_BA, hr_HR, mk_MK, en_US)
        $locale = function_exists('determine_locale') ? determine_locale() : get_locale();
        $code = strtolower(substr($locale, 0, 2));
        if ($code === 'mk') return 'mk';
        if (in_array($code, array('sr', 'bs', 'hr', 'sh'), true)) return 'sr';
        if ($code === 'en') {
            // If WordPress is installed in English, check WooCommerce store base country
            if (function_exists('WC') && WC()->countries) {
                $base = WC()->countries->get_base_country();
                if ($base === 'MK') return 'mk';
                if (in_array($base, array('RS', 'BA', 'ME', 'HR'), true)) return 'sr';
            }
            return 'en';
        }

        // 4. WooCommerce Store Base Country
        if (function_exists('WC') && WC()->countries) {
            $base = WC()->countries->get_base_country();
            if ($base === 'MK') return 'mk';
            if (in_array($base, array('RS', 'BA', 'ME', 'HR'), true)) return 'sr';
        }

        return 'sr';
    }

    /**
     * Localized Message Dictionary (Native Balkan Translations)
     */
    public function get_message($key, $order = null, $replacements = array()) {
        $lang = $this->get_effective_language($order);

        $dictionary = array(
            'phone_required' => array(
                'sr' => __('Broj telefona je obavezan za plaćanje pouzećem (radi verifikacije adrese pre slanja pošiljke). Molimo unesite vaš broj telefona.', 'potvrdio-viber-cod'),
                'mk' => __('Телефонскиот број е задолжителен за плаќање при испорака (поради верификација на адресата пред испраќање). Ве молиме внесете го вашиот телефонски број.', 'potvrdio-viber-cod'),
                'en' => __('Phone number is required for Cash on Delivery (for delivery address verification). Please enter your phone number.', 'potvrdio-viber-cod'),
            ),
            'phone_label' => array(
                'sr' => __('Broj telefona (za potvrdu pošiljke)', 'potvrdio-viber-cod'),
                'mk' => __('Телефонски број (за потврда на пратката)', 'potvrdio-viber-cod'),
                'en' => __('Phone number (for delivery verification)', 'potvrdio-viber-cod'),
            ),
            'phone_placeholder' => array(
                'sr' => __('npr. 064 123 4567', 'potvrdio-viber-cod'),
                'mk' => __('на пр. 070 123 456', 'potvrdio-viber-cod'),
                'en' => __('e.g. +381 64 123 4567', 'potvrdio-viber-cod'),
            ),
            'thankyou_title' => array(
                'sr' => __('Potvrdio: Porudžbina #{order_id} je na čekanju (On-Hold)', 'potvrdio-viber-cod'),
                'mk' => __('Potvrdio: Нарачката #{order_id} е во мирување (On-Hold)', 'potvrdio-viber-cod'),
                'en' => __('Potvrdio: Order #{order_id} is On-Hold', 'potvrdio-viber-cod'),
            ),
            'thankyou_body' => array(
                'sr' => __('Vaša pošiljka je privremeno zadržana kako bi se potvrdila tačnost adrese i sprečili pogrešni troškovi dostave.<br><strong>Poslat vam je zahtev za verifikaciju.</strong> Čim potvrdite adresu putem primljene poruke, porudžbina se automatski šalje u pripremu za kurira.', 'potvrdio-viber-cod'),
                'mk' => __('Вашата пратка е привремено задржана за потврда на точноста на адресата и спречување грешки при испорака.<br><strong>Испратено ви е барање за верификација.</strong> Штом ја потврдите адресата преку примената порака, нарачката автоматски се испраќа во подготовка за курир.', 'potvrdio-viber-cod'),
                'en' => __('Your shipment is temporarily on hold to verify address accuracy and prevent return fees.<br><strong>A verification request has been sent to your phone.</strong> As soon as you confirm your address via the received message, your order will be dispatched.', 'potvrdio-viber-cod'),
            ),
            'thankyou_verified_title' => array(
                'sr' => __('Potvrdio: Porudžbina #{order_id} je uspešno verifikovana!', 'potvrdio-viber-cod'),
                'mk' => __('Potvrdio: Нарачката #{order_id} е успешно верификувана!', 'potvrdio-viber-cod'),
                'en' => __('Potvrdio: Order #{order_id} is successfully verified!', 'potvrdio-viber-cod'),
            ),
            'thankyou_verified_body' => array(
                'sr' => __('Vaša adresa i porudžbina su potvrđeni putem primljene poruke. Porudžbina je prosleđena u magacin i priprema se za slanje kurirskom službom.', 'potvrdio-viber-cod'),
                'mk' => __('Вашата адреса и нарачка се потврдени преку примената порака. Нарачката е препратена во магацин и се подготвува за испраќање со курир.', 'potvrdio-viber-cod'),
                'en' => __('Your delivery address and order have been verified via the received message. Your order has been released and is being prepared for courier dispatch.', 'potvrdio-viber-cod'),
            ),
            'privacy_consent' => array(
                'sr' => __('Saglasan/na sam da primim poruku radi verifikacije adrese i statusa pošiljke (Potvrdio.online).', 'potvrdio-viber-cod'),
                'mk' => __('Се согласувам да примам порака за верификација на адресата и статусот на пратката (Potvrdio.online).', 'potvrdio-viber-cod'),
                'en' => __('I agree to receive a message for address and shipment verification (Potvrdio.online).', 'potvrdio-viber-cod'),
            ),
            'privacy_consent_required' => array(
                'sr' => __('Molimo vas da potvrdite saglasnost za verifikaciju pošiljke.', 'potvrdio-viber-cod'),
                'mk' => __('Ве молиме потврдете ја согласноста за верификација на пратката.', 'potvrdio-viber-cod'),
                'en' => __('Please confirm consent for shipment verification.', 'potvrdio-viber-cod'),
            ),
            'admin_missing_phone' => array(
                'sr' => __('Potvrdio Upozorenje: Porudžbina je kreirana bez broja telefona (moguće kroz custom checkout / funnel)! Verifikacija se NE MOŽE poslati. Porudžbina ostaje blokirana na čekanju (On-Hold).', 'potvrdio-viber-cod'),
                'mk' => __('Potvrdio Предупредување: Нарачката е креирана без телефонски број (можно преку custom checkout / funnel)! Верификацијата НЕ МОЖЕ да се испрати. Нарачката останува блокирана во мирување (On-Hold).', 'potvrdio-viber-cod'),
                'en' => __('Potvrdio Warning: Order was placed without a phone number! Verification cannot be sent. Order remains locked On-Hold.', 'potvrdio-viber-cod'),
            ),
        );

        $text = isset($dictionary[$key][$lang]) ? $dictionary[$key][$lang] : (isset($dictionary[$key]['sr']) ? $dictionary[$key]['sr'] : '');

        foreach ($replacements as $placeholder => $value) {
            $text = str_replace('{' . $placeholder . '}', $value, $text);
        }

        return $text;
    }

    /**
     * Display a prominent notice on the Thank You page
     */
    public function display_on_hold_viber_notice($order_id) {
        static $displayed_orders = array();
        if (!$order_id || isset($displayed_orders[$order_id])) return;
        $order = wc_get_order($order_id);
        if (!$order || 'cod' !== $order->get_payment_method()) return;

        $displayed_orders[$order_id] = true;

        if ($order->get_meta('_potvrdio_verified')) {
            $title = $this->get_message('thankyou_verified_title', $order, array('order_id' => $order_id));
            $body  = $this->get_message('thankyou_verified_body', $order);

            echo '<div id="potvrdio-thankyou-banner" class="potvrdio-banner-verified" style="background:#ECFDF5; border:2px solid #10B981; border-radius:12px; padding:18px 22px; margin:24px 0; color:#065F46; font-family:inherit; transition: all 0.3s ease;">';
            echo '<div style="font-weight:800; font-size:17px; margin-bottom:6px; display:flex; align-items:center; gap:8px;">';
            echo '<svg style="width:20px; height:20px; stroke:#059669; fill:none; stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round; shrink:0;" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> <span>' . esc_html($title) . '</span>';
            echo '</div>';
            echo '<p style="margin:0; font-size:14px; line-height:1.5; color:#047857;">';
            echo wp_kses_post($body);
            echo '</p>';
            echo '</div>';
        } else {
            $title = $this->get_message('thankyou_title', $order, array('order_id' => $order_id));
            $body  = $this->get_message('thankyou_body', $order);
            $order_key = $order->get_order_key();

            echo '<div id="potvrdio-thankyou-banner" class="potvrdio-banner-pending" data-order-id="' . esc_attr($order_id) . '" data-order-key="' . esc_attr($order_key) . '" style="background:#FFFBEB; border:2px solid #F59E0B; border-radius:12px; padding:18px 22px; margin:24px 0; color:#92400E; font-family:inherit; transition: all 0.3s ease;">';
            echo '<div style="font-weight:800; font-size:17px; margin-bottom:6px; display:flex; align-items:center; gap:8px;">';
            echo '<span class="potvrdio-pulse-dot" style="display:inline-block; width:10px; height:10px; background:#F59E0B; border-radius:50%; margin-right:4px; animation: potvrdioPulse 1.8s infinite;"></span>';
            echo '<span id="potvrdio-banner-title">' . esc_html($title) . '</span>';
            echo '</div>';
            echo '<p id="potvrdio-banner-body" style="margin:0; font-size:14px; line-height:1.5; color:#78350F;">';
            echo wp_kses_post($body);
            echo '</p>';
            echo '</div>';

            $this->render_live_polling_script($order_id, $order_key);
        }
    }

    /**
     * Enforce Billing Phone as strictly required on checkout (Billing Fields)
     * Re-injects the field if any theme or custom funnel accidentally unset/deleted it.
     */
    public function enforce_phone_required_on_checkout($fields) {
        if (!isset($fields['billing_phone']) || !is_array($fields['billing_phone'])) {
            $fields['billing_phone'] = array(
                'type'        => 'tel',
                'label'       => $this->get_message('phone_label'),
                'placeholder' => $this->get_message('phone_placeholder'),
                'required'    => true,
                'class'       => array('form-row-wide'),
                'clear'       => true,
                'priority'    => 100,
            );
        } else {
            $fields['billing_phone']['required'] = true;
            $fields['billing_phone']['label'] = $this->get_message('phone_label');
        }
        return $fields;
    }

    /**
     * Enforce Phone across all checkout fields (ThemeHigh Checkout Field Editor, CartFlows, Flexible Checkout)
     * Re-injects the field if deleted.
     */
    public function enforce_all_checkout_fields_phone_required($fields) {
        if (!isset($fields['billing']['billing_phone']) || !is_array($fields['billing']['billing_phone'])) {
            $fields['billing']['billing_phone'] = array(
                'type'        => 'tel',
                'label'       => $this->get_message('phone_label'),
                'placeholder' => $this->get_message('phone_placeholder'),
                'required'    => true,
                'class'       => array('form-row-wide'),
                'clear'       => true,
                'priority'    => 100,
            );
        } else {
            $fields['billing']['billing_phone']['required'] = true;
            $fields['billing']['billing_phone']['label'] = $this->get_message('phone_label');
        }
        return $fields;
    }

    /**
     * Universal Order Phone Extractor:
     * Searches billing, shipping, common custom post meta keys (CartFlows, Checkout Field Editor, FunnelKit),
     * and fallback request variables.
     */
    public function extract_order_phone($order) {
        if (!$order) return '';

        // 1. Core billing phone
        $phone = trim((string)$order->get_billing_phone());
        if (!empty($phone)) return $phone;

        // 2. Core shipping phone
        if (method_exists($order, 'get_shipping_phone')) {
            $phone = trim((string)$order->get_shipping_phone());
            if (!empty($phone)) return $phone;
        }

        // 3. Common custom meta keys used by page builders / field editors
        $meta_keys = array(
            '_billing_phone', 'billing_phone', 'billing_mobile', '_billing_mobile',
            'phone', '_phone', 'custom_phone', 'contact_phone', 'telephone', 'mobile'
        );
        foreach ($meta_keys as $key) {
            $val = $order->get_meta($key);
            if (!empty($val) && is_string($val) && strlen(trim($val)) >= 5) {
                return trim($val);
            }
        }

        // 4. Request payload fallback during active request
        // phpcs:disable WordPress.Security.NonceVerification.Missing -- Checked during checkout submission
        if (!empty($_POST)) {
            foreach ($meta_keys as $key) {
                if (!empty($_POST[$key]) && is_string($_POST[$key])) {
                    $raw_phone = sanitize_text_field(wp_unslash($_POST[$key]));
                    if (strlen(trim($raw_phone)) >= 5) {
                        return trim($raw_phone);
                    }
                }
            }
        }
        // phpcs:enable WordPress.Security.NonceVerification.Missing

        return '';
    }

    /**
     * Enforce Phone validation on Classic Checkout
     */
    public function validate_phone_on_checkout($data, $errors) {
        // phpcs:disable WordPress.Security.NonceVerification.Missing -- Nonce verified in WC_Checkout::process_checkout()
        if (isset($data['payment_method']) && 'cod' === $data['payment_method']) {
            $phone = isset($data['billing_phone']) ? trim($data['billing_phone']) : '';
            if (empty($phone) && !empty($_POST)) {
                $phone = $this->extract_order_phone(null);
            }
            if (empty($phone)) {
                $errors->add('billing_phone_required', '<strong>' . esc_html($this->get_message('phone_required')) . '</strong>');
            }
        }
        // phpcs:enable WordPress.Security.NonceVerification.Missing
    }

    /**
     * Enforce Phone validation on Modern Block-Based Checkout (Store API)
     */
    public function validate_block_checkout_phone($order, $request) {
        if ('cod' === $order->get_payment_method()) {
            $phone = trim($this->extract_order_phone($order));
            if (empty($phone)) {
                $msg = $this->get_message('phone_required', $order);
                throw new \Exception(esc_html($msg));
            }
        }
    }

    /**
     * Core Checkout Engine Hard Block:
     * Fires right before order is saved into DB during classic or custom checkouts.
     * Throwing an Exception causes a complete transaction rollback (NO order is created).
     */
    public function strictly_block_order_creation_without_phone($order, $data) {
        if ('cod' === $order->get_payment_method()) {
            $phone = $this->extract_order_phone($order);
            if (empty($phone) && isset($data['billing_phone'])) {
                $phone = trim($data['billing_phone']);
            }
            if (empty($phone)) {
                $msg = $this->get_message('phone_required', $order);
                throw new \Exception(esc_html($msg));
            }
        }
    }

    /**
     * REST API / Headless Order Creation Hard Block:
     * Blocks external API/app order creation without phone if payment method is COD.
     */
    public function strictly_block_rest_api_without_phone($order, $request, $creating) {
        if ($creating && 'cod' === $order->get_payment_method()) {
            $phone = $this->extract_order_phone($order);
            if (empty($phone)) {
                return new \WP_Error('potvrdio_phone_required', $this->get_message('phone_required', $order), array('status' => 400));
            }
        }
        return $order;
    }

    /**
     * Force WooCommerce Checkout Phone Field Option to 'required'
     *
     * @param mixed $value Existing option value.
     * @return string
     */
    public function force_phone_field_required_option($value) {
        return 'required';
    }

    /**
     * Client-side Real-Time Phone Validation:
     * Fully compatible with Gutenberg Block Checkout (floating labels) and classic checkout funnels.
     */
    public function inject_checkout_phone_enforcement_script() {
        $placeholder = $this->get_message('phone_placeholder');
        ?>
        <script type="text/javascript">
        (function() {
            var potvrdioPlaceholder = <?php echo wp_json_encode($placeholder); ?>;

            function fixPhoneInput(input, isCod) {
                if (isCod) {
                    input.setAttribute('required', 'required');
                }

                // Check if the input is rendered inside a Gutenberg Block or Floating-Label design
                var isFloating = !!input.closest('.wc-block-components-text-input, .has-floating-label, [class*="floating-label"]');

                if (isFloating) {
                    // CRITICAL: Floating labels sit inside the field when empty and unfocused.
                    // Setting a static placeholder causes the label and placeholder to collide and overlap!
                    if (document.activeElement !== input) {
                        input.removeAttribute('placeholder');
                    }

                    // Dynamically attach focus/blur listeners so placeholder ONLY appears when user focuses
                    if (!input.dataset.potvrdioBound) {
                        input.dataset.potvrdioBound = 'true';
                        input.addEventListener('focus', function() {
                            input.setAttribute('placeholder', potvrdioPlaceholder);
                        });
                        input.addEventListener('blur', function() {
                            if (!input.value) {
                                input.removeAttribute('placeholder');
                            }
                        });
                    }

                    // Clean up any remaining "(optional)" text in the floating label element
                    var container = input.closest('.wc-block-components-text-input');
                    var label = container ? container.querySelector('label') : document.querySelector('label[for="' + input.id + '"]');
                    if (label && label.innerHTML && isCod) {
                        if (/\((optional|opciono|опционално)\)/i.test(label.innerHTML)) {
                            label.innerHTML = label.innerHTML.replace(/\s*\((optional|opciono|опционално)\)/gi, ' <span class="required" style="color:#d63638;">*</span>');
                        }
                    }
                } else {
                    // Classic non-floating checkouts: safe to set placeholder
                    if (isCod && (!input.placeholder || input.placeholder.indexOf('Viber') !== -1 || input.placeholder.indexOf('064') !== -1)) {
                        input.setAttribute('placeholder', potvrdioPlaceholder);
                    }
                }
            }

            function checkCodPhone() {
                var codRadio = document.querySelector('input[name="payment_method"][value="cod"]');
                var isCod = codRadio ? codRadio.checked : true;
                var phoneInputs = document.querySelectorAll('input[type="tel"], input[name*="phone"], input[id*="phone"], input[name*="mobile"]');

                phoneInputs.forEach(function(input) {
                    fixPhoneInput(input, isCod);
                });
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', checkCodPhone);
            } else {
                checkCodPhone();
            }

            document.addEventListener('change', function(e) {
                if (e.target && (e.target.name === 'payment_method' || e.target.type === 'radio')) {
                    checkCodPhone();
                }
            });

            if (window.jQuery) {
                window.jQuery(document.body).on('updated_checkout payment_method_selected', checkCodPhone);
            }

            // MutationObserver to seamlessly handle Gutenberg React component re-renders
            if (window.MutationObserver) {
                var observer = new MutationObserver(function() {
                    checkCodPhone();
                });
                var target = document.querySelector('.wp-block-woocommerce-checkout, form.checkout') || document.body;
                observer.observe(target, { childList: true, subtree: true });
            }
        })();
        </script>
        <?php
    }

    /**
     * Send HTTP POST to Potvrdio Central Server
     */
    private function send_to_central_backend($endpoint, $payload) {
        if (empty($this->api_key) || empty($this->api_secret)) {
            return false;
        }

        $url = rtrim($this->api_endpoint, '/') . $endpoint;
        $body = wp_json_encode($payload);

        $signature = hash_hmac('sha256', $body, $this->api_secret);

        $response = wp_remote_post($url, array(
            'method'    => 'POST',
            'timeout'   => 6,
            'blocking'  => true, // Reliable synchronous delivery
            'sslverify' => false,
            'headers'   => array(
                'Content-Type'          => 'application/json',
                'X-Potvrdio-Api-Key'    => $this->api_key,
                'X-Potvrdio-Api-Secret' => $this->api_secret,
                'X-Potvrdio-Signature'  => $signature,
            ),
            'body'      => $body,
        ));

        if (is_wp_error($response)) {
            error_log('Potvrdio Central Backend error: ' . $response->get_error_message());
            return false;
        }

        $code = wp_remote_retrieve_response_code($response);
        $res_body = wp_remote_retrieve_body($response);
        $data = json_decode($res_body, true);

        return is_array($data) ? $data : ($code >= 200 && $code < 300);
    }

    /**
     * Add Balkan Privacy Consent Checkbox (ZZPL / DPL / GDPR compliant)
     */
    public function add_privacy_consent_checkbox() {
        woocommerce_form_field('potvrdio_privacy_consent', array(
            'type'        => 'checkbox',
            'class'       => array('potvrdio-privacy-checkbox form-row-wide'),
            'label'       => $this->get_message('privacy_consent'),
            'required'    => true,
        ));
    }

    public function validate_privacy_consent_checkbox() {
        // phpcs:disable WordPress.Security.NonceVerification.Missing -- Verified in WooCommerce checkout core
        if (!isset($_POST['potvrdio_privacy_consent']) && isset($_POST['payment_method']) && $_POST['payment_method'] === 'cod') {
            wc_add_notice($this->get_message('privacy_consent_required'), 'error');
        }
        // phpcs:enable WordPress.Security.NonceVerification.Missing
    }

    public function save_privacy_consent_meta($order_id) {
        // phpcs:disable WordPress.Security.NonceVerification.Missing -- Verified in WooCommerce checkout core
        if (isset($_POST['potvrdio_privacy_consent'])) {
            $order = wc_get_order($order_id);
            if ($order) {
                $order->update_meta_data('_potvrdio_privacy_consent', '1');
                $order->save();
            }
        }
        // phpcs:enable WordPress.Security.NonceVerification.Missing
    }

    /**
     * Register REST API Webhook for Central Server updates
     * URL: /wp-json/potvrdio/v1/webhook
     * Aliases: /wp-json/potvrdio/v1/order/confirm, /wp-json/potvrdio/v1/order/cancel
     */
    public function register_webhook_routes() {
        register_rest_route('potvrdio/v1', '/webhook', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'handle_incoming_webhook'),
            'permission_callback' => array($this, 'verify_webhook_signature'),
        ));
        register_rest_route('potvrdio/v1', '/order/confirm', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'handle_incoming_webhook'),
            'permission_callback' => array($this, 'verify_webhook_signature'),
        ));
        register_rest_route('potvrdio/v1', '/order/cancel', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'handle_incoming_webhook'),
            'permission_callback' => array($this, 'verify_webhook_signature'),
        ));
    }

    public function verify_webhook_signature(WP_REST_Request $request) {
        $signature = $request->get_header('X-Potvrdio-Signature');
        $apiKey    = $request->get_header('X-Potvrdio-Api-Key');
        $body      = $request->get_body();

        // 1. If API secret is present and signature is provided, verify HMAC
        if (!empty($signature) && !empty($this->api_secret)) {
            $expected = hash_hmac('sha256', $body, $this->api_secret);
            if (hash_equals($expected, (string)$signature)) {
                return true;
            }
        }

        // 2. Fallback: match API key header if provided
        if (!empty($apiKey) && !empty($this->api_key) && hash_equals($this->api_key, (string)$apiKey)) {
            return true;
        }

        // 3. Fallback: if no secret configured, allow authenticated connection
        if (empty($this->api_secret)) {
            return true;
        }

        return false;
    }

    public function handle_incoming_webhook(WP_REST_Request $request) {
        $params   = $request->get_json_params();
        $order_id = isset($params['order_id']) ? intval($params['order_id']) : 0;
        $action   = isset($params['action']) ? sanitize_text_field($params['action']) : '';
        $status   = isset($params['status']) ? sanitize_text_field($params['status']) : '';

        $order = wc_get_order($order_id);
        if (!$order) {
            return new WP_REST_Response(array('status' => 'error', 'message' => 'Order not found'), 404);
        }

        $is_approve = ('APPROVED' === $action || 'UPDATED_ADDRESS' === $action || 'processing' === $status);
        $is_cancel  = ('CANCELLED' === $action || 'REJECTED' === $action || 'cancelled' === $status);

        if ($is_approve) {
            // 1. Mark order officially verified by Potvrdio
            $order->update_meta_data('_potvrdio_verified', '1');
            $order->update_meta_data('_potvrdio_verified_at', current_time('mysql'));

            // 2. Update shipping address if modified
            $addr = !empty($params['updated_address']) && is_array($params['updated_address']) ? $params['updated_address'] : $params;
            if (!empty($addr['address_1'])) $order->set_shipping_address_1(sanitize_text_field($addr['address_1']));
            if (!empty($addr['address_2'])) $order->set_shipping_address_2(sanitize_text_field($addr['address_2']));
            if (!empty($addr['city']))      $order->set_shipping_city(sanitize_text_field($addr['city']));
            if (!empty($addr['postcode']))  $order->set_shipping_postcode(sanitize_text_field($addr['postcode']));
            
            $note = !empty($params['order_note']) ? $params['order_note'] : (!empty($params['customer_note']) ? $params['customer_note'] : '');
            if (!empty($note)) {
                $order->add_order_note(__('Potvrdio Customer Note: ', 'potvrdio-viber-cod') . sanitize_text_field($note));
            }

            // Save phone + address hash for future smart bypass
            $raw_phone = $this->extract_order_phone($order);
            $country = $order->get_shipping_country() ?: ($order->get_billing_country() ?: 'RS');
            $normalized_phone = $this->normalize_balkan_phone($raw_phone, $country);
            $addr_hash = $this->compute_address_phone_hash($normalized_phone, $order);
            if (!empty($addr_hash)) {
                $order->update_meta_data('_potvrdio_address_phone_hash', $addr_hash);
            }

            // 3. RELEASE TO PROCESSING: Gatekeeper will allow this because _potvrdio_verified = 1
            $order->update_status('processing', __('Potvrdio: Address verified by customer via potvrdio.online. Order released for courier label generation.', 'potvrdio-viber-cod'));
            $order->save();

            // Unschedule timeout check if action scheduler is available
            if (function_exists('as_unschedule_action')) {
                as_unschedule_action('potvrdio_order_timeout_check', array('order_id' => $order_id));
            }

            return new WP_REST_Response(array('status' => 'success', 'order_status' => 'processing'), 200);
        }

        if ($is_cancel) {
            $order->update_meta_data('_potvrdio_cancelled', '1');
            $order->update_meta_data('_potvrdio_cancelled_at', current_time('mysql'));
            $order->update_status('cancelled', __('Potvrdio: Kupac je otkazao porudžbinu putem potvrdio.online verifikacionog linka. Slanje paketa je obustavljeno, artikli su vraćeni na stanje.', 'potvrdio-viber-cod'));
            $order->save();

            if (function_exists('as_unschedule_action')) {
                as_unschedule_action('potvrdio_order_timeout_check', array('order_id' => $order_id));
            }

            return new WP_REST_Response(array('status' => 'success', 'order_status' => 'cancelled'), 200);
        }

        if ('OUT_OF_CREDITS' === $action) {
            update_option('potvrdio_credits_exhausted', '1');
            $order->add_order_note(__('Potvrdio Upozorenje: SMS/Viber krediti na vašem Potvrdio.online nalogu su istekli! Verifikacija nije poslata. Porudžbina ostaje na čekanju. Molimo dopunite kredite na dashboard-u.', 'potvrdio-viber-cod'));
            $order->save();

            return new WP_REST_Response(array('status' => 'warning', 'message' => 'Credit alert registered'), 200);
        }

        return new WP_REST_Response(array('status' => 'ignored', 'message' => 'Action not handled'), 200);
    }

    /**
     * Check verification status directly with Potvrdio Cloud backend
     * Perfect for local dev, intranet stores or when inbound webhooks cannot reach store
     */
    public function check_order_status_with_cloud($order) {
        if (!$order || empty($this->api_key)) {
            return false;
        }

        $order_id = $order->get_id();
        $base_endpoint = preg_replace('#/api/v1/?$#i', '', rtrim($this->api_endpoint, '/'));
        $url = $base_endpoint . '/api/v1/orders/intercept?apiKey=' . rawurlencode($this->api_key) . '&order_id=' . rawurlencode($order_id);

        $response = wp_remote_get($url, array(
            'timeout'   => 8,
            'sslverify' => false,
            'headers'   => array(
                'Accept'             => 'application/json',
                'X-Potvrdio-Api-Key' => $this->api_key,
            ),
        ));

        if (is_wp_error($response)) {
            error_log('Potvrdio check_order_status_with_cloud error: ' . $response->get_error_message());
            return false;
        }

        $code = wp_remote_retrieve_response_code($response);
        if ($code !== 200) {
            return false;
        }

        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if (!is_array($data) || empty($data['success'])) {
            return false;
        }

        $is_verified = !empty($data['verified']) || (isset($data['status']) && in_array($data['status'], array('APPROVED', 'EDITED_ADDRESS'), true));
        $is_cancelled = !empty($data['cancelled']) || (isset($data['status']) && $data['status'] === 'CANCELLED');

        if ($is_verified) {
            // 1. Mark order officially verified by Potvrdio
            $order->update_meta_data('_potvrdio_verified', '1');
            $order->update_meta_data('_potvrdio_verified_at', current_time('mysql'));

            // 2. Update shipping address if modified
            if (!empty($data['shipping_address']) && is_array($data['shipping_address'])) {
                $ship = $data['shipping_address'];
                if (!empty($ship['address_1'])) $order->set_shipping_address_1(sanitize_text_field($ship['address_1']));
                if (!empty($ship['address_2'])) $order->set_shipping_address_2(sanitize_text_field($ship['address_2']));
                if (!empty($ship['city']))      $order->set_shipping_city(sanitize_text_field($ship['city']));
                if (!empty($ship['postcode']))  $order->set_shipping_postcode(sanitize_text_field($ship['postcode']));
                if (!empty($ship['customer_note'])) $order->add_order_note(__('Potvrdio Customer Note: ', 'potvrdio-viber-cod') . sanitize_text_field($ship['customer_note']));
            }

            // Save phone + address hash for future smart bypass
            $raw_phone = $this->extract_order_phone($order);
            $country = $order->get_shipping_country() ?: ($order->get_billing_country() ?: 'RS');
            $normalized_phone = $this->normalize_balkan_phone($raw_phone, $country);
            $addr_hash = $this->compute_address_phone_hash($normalized_phone, $order);
            if (!empty($addr_hash)) {
                $order->update_meta_data('_potvrdio_address_phone_hash', $addr_hash);
            }
            $order->save();

            // 3. RELEASE TO PROCESSING
            $order->update_status('processing', __('Potvrdio: Adresa je uspešno verifikovana od strane kupca (usklađeno sa Potvrdio Cloudom).', 'potvrdio-viber-cod'));
            $order->save();

            if (function_exists('as_unschedule_action')) {
                as_unschedule_action('potvrdio_order_timeout_check', array('order_id' => $order_id));
            }

            return array('verified' => true, 'status' => 'processing');
        }

        if ($is_cancelled) {
            $order->update_meta_data('_potvrdio_cancelled', '1');
            $order->update_meta_data('_potvrdio_cancelled_at', current_time('mysql'));
            $order->save();
            $order->update_status('cancelled', __('Potvrdio: Kupac je otkazao porudžbinu putem linka (usklađeno sa Potvrdio Cloudom).', 'potvrdio-viber-cod'));
            $order->save();

            if (function_exists('as_unschedule_action')) {
                as_unschedule_action('potvrdio_order_timeout_check', array('order_id' => $order_id));
            }

            return array('cancelled' => true, 'status' => 'cancelled');
        }

        return false;
    }

    /**
     * Automatic Pre-Render Cloud Synchronization for WooCommerce Admin
     * Runs in admin_init BEFORE WooCommerce renders the order edit screen or order list
     */
    public function check_and_sync_admin_orders() {
        if (!is_admin() || !current_user_can('manage_woocommerce') || empty($this->api_key)) {
            return;
        }

        // 1. Single Order Edit Screen (both Classic post.php and HPOS admin.php?page=wc-order)
        $order_id = 0;
        if (isset($_GET['post'])) {
            $post_id = absint($_GET['post']);
            if ($post_id && get_post_type($post_id) === 'shop_order') {
                $order_id = $post_id;
            }
        } elseif (isset($_GET['page']) && in_array($_GET['page'], array('wc-order', 'wc-orders'), true) && isset($_GET['id'])) {
            $order_id = absint($_GET['id']);
        }

        if ($order_id > 0) {
            $order = wc_get_order($order_id);
            if ($order && 'cod' === $order->get_payment_method() && $order->get_status() === 'on-hold' && !$order->get_meta('_potvrdio_verified')) {
                $this->check_order_status_with_cloud($order);
            }
            return;
        }

        // 2. Orders List View Screen (both Classic edit.php?post_type=shop_order and HPOS page=wc-orders)
        global $pagenow;
        $is_orders_list = false;
        if ($pagenow === 'edit.php' && isset($_GET['post_type']) && $_GET['post_type'] === 'shop_order') {
            $is_orders_list = true;
        } elseif (isset($_GET['page']) && $_GET['page'] === 'wc-orders' && empty($_GET['id'])) {
            $is_orders_list = true;
        }

        if ($is_orders_list) {
            $transient_key = 'potvrdio_list_sync_' . md5($this->api_key);
            if (!get_transient($transient_key)) {
                set_transient($transient_key, time(), 10); // Throttle to once every 10 seconds per admin
                $this->sync_recent_pending_orders();
            }
        }
    }

    /**
     * Syncs recent pending COD orders from Potvrdio Cloud in one batch
     */
    public function sync_recent_pending_orders() {
        if (empty($this->api_key)) {
            return;
        }

        $base_endpoint = preg_replace('#/api/v1/?$#i', '', rtrim($this->api_endpoint, '/'));
        $url = $base_endpoint . '/api/v1/orders/intercept?apiKey=' . rawurlencode($this->api_key);

        $response = wp_remote_get($url, array(
            'timeout'   => 8,
            'sslverify' => false,
            'headers'   => array(
                'Accept'             => 'application/json',
                'X-Potvrdio-Api-Key' => $this->api_key,
            ),
        ));

        if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
            return;
        }

        $data = json_decode(wp_remote_retrieve_body($response), true);
        if (empty($data['success']) || empty($data['orders']) || !is_array($data['orders'])) {
            return;
        }

        foreach ($data['orders'] as $cloud_order) {
            $status = isset($cloud_order['status']) ? $cloud_order['status'] : '';
            if (!in_array($status, array('APPROVED', 'EDITED_ADDRESS', 'CANCELLED'), true)) {
                continue;
            }

            $order_id = 0;
            if (isset($cloud_order['id'])) {
                $order_id = absint(ltrim($cloud_order['id'], '#'));
            }
            if (!$order_id) continue;

            $order = wc_get_order($order_id);
            if (!$order || 'cod' !== $order->get_payment_method()) {
                continue;
            }

            if ($order->get_meta('_potvrdio_verified') || in_array($order->get_status(), array('processing', 'completed', 'cancelled'), true)) {
                continue;
            }

            $this->check_order_status_with_cloud($order);
        }
    }

    /**
     * Ultra-lightweight Live Polling Script for Thank You Page
     */
    public function render_live_polling_script($order_id, $order_key) {
        $ajax_url = home_url('/?wc-ajax=potvrdio_check_order_status');
        ?>
        <style>
        @keyframes potvrdioPulse {
            0% { transform: scale(0.95); opacity: 0.6; }
            50% { transform: scale(1.3); opacity: 1; }
            100% { transform: scale(0.95); opacity: 0.6; }
        }
        </style>
        <script type="text/javascript">
        (function() {
            var banner = document.getElementById('potvrdio-thankyou-banner');
            if (!banner || !banner.classList.contains('potvrdio-banner-pending')) return;

            var orderId = <?php echo intval($order_id); ?>;
            var orderKey = <?php echo wp_json_encode($order_key); ?>;
            var pollUrl = <?php echo wp_json_encode($ajax_url); ?>;

            var maxPolls = 30; // 30 attempts * 3s = 90 seconds max
            var pollCount = 0;
            var timer = null;

            function setBannerVerified(title, body) {
                if (!banner) return;
                if (timer) clearInterval(timer);

                banner.style.opacity = '0';
                setTimeout(function() {
                    banner.className = 'potvrdio-banner-verified';
                    banner.style.background = '#ECFDF5';
                    banner.style.borderColor = '#10B981';
                    banner.style.color = '#065F46';
                    
                    banner.innerHTML = '<div style="font-weight:800; font-size:17px; margin-bottom:6px; display:flex; align-items:center; gap:8px;">' +
                        '<svg style="width:20px; height:20px; stroke:#059669; fill:none; stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round; shrink:0;" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>' +
                        '<span>' + (title || 'Adresa je uspešno potvrđena!') + '</span>' +
                        '</div>' +
                        '<p style="margin:0; font-size:14px; line-height:1.5; color:#047857;">' +
                        (body || '') +
                        '</p>';
                    
                    banner.style.opacity = '1';
                }, 200);
            }

            function checkStatus() {
                if (document.hidden) return; // Tab in background, pause to save battery/server
                pollCount++;
                if (pollCount > maxPolls) {
                    if (timer) clearInterval(timer);
                    return;
                }

                var xhr = new XMLHttpRequest();
                var sep = pollUrl.indexOf('?') !== -1 ? '&' : '?';
                xhr.open('GET', pollUrl + sep + 'order_id=' + encodeURIComponent(orderId) + '&order_key=' + encodeURIComponent(orderKey), true);
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        try {
                            var res = JSON.parse(xhr.responseText);
                            if (res && res.success && res.data && res.data.verified) {
                                setBannerVerified(res.data.title, res.data.body);
                            }
                        } catch (e) {}
                    }
                };
                xhr.send();
            }

            // Start polling every 3 seconds
            timer = setInterval(checkStatus, 3000);
        })();
        </script>
        <?php
    }

    /**
     * Ultra-lightweight AJAX order status endpoint for Thank You live polling
     */
    public function ajax_check_order_status() {
        $order_id  = isset($_REQUEST['order_id']) ? intval($_REQUEST['order_id']) : 0;
        $order_key = isset($_REQUEST['order_key']) ? sanitize_text_field($_REQUEST['order_key']) : '';

        if (!$order_id || empty($order_key)) {
            wp_send_json_error(array('message' => 'Missing parameters'), 400);
        }

        $order = wc_get_order($order_id);
        if (!$order || $order->get_order_key() !== $order_key) {
            wp_send_json_error(array('message' => 'Unauthorized'), 403);
        }

        $is_verified = (bool) $order->get_meta('_potvrdio_verified');

        // Bi-directional check: If not yet marked verified locally, ask Potvrdio Cloud API!
        // This ensures local test sites, intranet environments or stores behind firewall/NAT
        // instantly transition to processing when customer confirms on mobile!
        if (!$is_verified && $order->get_status() === 'on-hold') {
            $cloud_res = $this->check_order_status_with_cloud($order);
            if ($cloud_res && !empty($cloud_res['verified'])) {
                $is_verified = true;
            }
        }

        if ($is_verified) {
            $title = $this->get_message('thankyou_verified_title', $order, array('order_id' => $order_id));
            $body  = $this->get_message('thankyou_verified_body', $order);
            wp_send_json_success(array(
                'verified' => true,
                'status'   => $order->get_status(),
                'title'    => $title,
                'body'     => $body,
            ));
        } else {
            wp_send_json_success(array(
                'verified' => false,
                'status'   => $order->get_status(),
            ));
        }
    }

    /**
     * Local Dev Simulation Action (Available on .local / localhost / admin)
     */
    public function ajax_dev_simulate_verify() {
        $order_id  = isset($_POST['order_id']) ? intval($_POST['order_id']) : 0;
        $order_key = isset($_POST['order_key']) ? sanitize_text_field($_POST['order_key']) : '';

        if (!$order_id || empty($order_key)) {
            wp_send_json_error(array('message' => 'Missing parameters'), 400);
        }

        $order = wc_get_order($order_id);
        if (!$order || $order->get_order_key() !== $order_key) {
            wp_send_json_error(array('message' => 'Unauthorized'), 403);
        }

        $order->update_meta_data('_potvrdio_verified', '1');
        $order->update_meta_data('_potvrdio_verified_at', current_time('mysql'));
        $order->update_status('processing', __('Potvrdio: Lokalni test potvrde izvršen sa Thank You ekrana.', 'potvrdio-viber-cod'));
        $order->save();

        if (function_exists('as_unschedule_action')) {
            as_unschedule_action('potvrdio_order_timeout_check', array('order_id' => $order_id));
        }

        wp_send_json_success(array('verified' => true));
    }

    /**
     * 24-Hour Timeout Handler: Automatically called by Action Scheduler or WP Cron
     * if customer does not verify the order within 24 hours.
     */
    public function handle_order_timeout($order_id) {
        if (!$order_id) return;
        $order = wc_get_order($order_id);
        if (!$order || 'cod' !== $order->get_payment_method()) return;

        // Skip if already verified or already terminal
        if ($order->get_meta('_potvrdio_verified') || in_array($order->get_status(), array('processing', 'completed', 'cancelled', 'refunded'), true)) {
            return;
        }

        // Auto-cancel to prevent return delivery fees on unconfirmed orders
        $order->update_meta_data('_potvrdio_timeout_reached', '1');
        $order->update_status('cancelled', __('Potvrdio Istek Vremena (24h): Kupac nije potvrdio adresu u roku od 24 časa. Porudžbina je automatski otkazana radi zaštite prodavca od troškova povrata nepreuzetih pošiljki.', 'potvrdio-viber-cod'));
        $order->save();
    }

    /**
     * Admin Order Detail Meta Box: Displays Potvrdio Status in WooCommerce Order view
     */
    public function register_order_meta_box() {
        $screen = class_exists('\Automattic\WooCommerce\Internal\DataStores\Orders\CustomOrdersTableController') 
            && \Automattic\WooCommerce\Utilities\OrderUtil::custom_orders_table_usage_is_enabled()
            ? wc_get_page_screen_id('shop_order')
            : 'shop_order';

        add_meta_box(
            'potvrdio_verification_box',
            __('Potvrdio - Status verifikacije porudžbine', 'potvrdio-viber-cod'),
            array($this, 'render_order_meta_box'),
            $screen,
            'side',
            'high'
        );
    }

    public function render_order_meta_box($post_or_order_object) {
        $order = ($post_or_order_object instanceof \WC_Order) ? $post_or_order_object : wc_get_order($post_or_order_object->ID);
        if (!$order) return;

        $is_cod = ('cod' === $order->get_payment_method());
        $verified = (bool)$order->get_meta('_potvrdio_verified');
        $phone = $order->get_meta('_potvrdio_normalized_phone') ?: $order->get_billing_phone();
        $verified_at = $order->get_meta('_potvrdio_verified_at');

        echo '<div style="font-size:13px; line-height:1.6;">';
        if (!$is_cod) {
            echo '<p style="color:#64748B;">' . esc_html__('Ova porudžbina nije sa plaćanjem pouzećem (COD), pa Potvrdio verifikacija nije primenjena.', 'potvrdio-viber-cod') . '</p>';
            echo '</div>';
            return;
        }

        // Bi-directional sync in admin metabox: auto-check cloud if order is on-hold and unverified
        if (!$verified && $order->get_status() === 'on-hold') {
            $cloud_res = $this->check_order_status_with_cloud($order);
            if ($cloud_res && !empty($cloud_res['verified'])) {
                $verified = true;
                $verified_at = $order->get_meta('_potvrdio_verified_at');
            }
        }

        if ($verified) {
            echo '<script>
            jQuery(function($) {
                if ($("#order_status").length && $("#order_status").val() === "wc-on-hold") {
                    $("#order_status").val("wc-processing").trigger("change");
                }
            });
            </script>';
            echo '<div style="background:#ECFDF5; border:1px solid #10B981; border-radius:8px; padding:10px; margin-bottom:10px; color:#065F46;">';
            echo '<div style="display:flex; align-items:center; gap:6px; font-weight:bold; margin-bottom:4px;"><svg style="width:16px; height:16px; stroke:#059669; fill:none; stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round; shrink:0;" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> ' . esc_html__('ADRESA JE VERIFIKOVANA', 'potvrdio-viber-cod') . '</div>';
            echo '<small>' . esc_html__('Vreme potvrde:', 'potvrdio-viber-cod') . ' ' . esc_html($verified_at) . '</small><br>';
            if ($order->get_meta('_potvrdio_quota_bypassed')) {
                echo '<small style="color:#D97706; font-weight:600;">(' . esc_html__('Fail-Safe: Paket potrošen, automatski propušteno', 'potvrdio-viber-cod') . ')</small><br>';
            } elseif ($order->get_meta('_potvrdio_smart_bypass')) {
                echo '<small style="color:#047857; font-weight:600;">(' . esc_html__('Smart Bypass: Prethodno potvrđena adresa', 'potvrdio-viber-cod') . ')</small><br>';
            } elseif ($order->get_meta('_potvrdio_admin_override')) {
                echo '<small style="color:#047857; font-weight:600;">(' . esc_html__('Ručno odobrenje administratora', 'potvrdio-viber-cod') . ')</small><br>';
            }
            echo '<small>' . esc_html__('Paket je spreman za slanje i štampu adresnice kuriru.', 'potvrdio-viber-cod') . '</small>';
            echo '</div>';
        } else {
            echo '<div style="background:#FFFBEB; border:1px solid #F59E0B; border-radius:8px; padding:10px; margin-bottom:10px; color:#92400E;">';
            echo '<div style="display:flex; align-items:center; gap:6px; font-weight:bold; margin-bottom:4px;"><svg style="width:16px; height:16px; stroke:#D97706; fill:none; stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round; shrink:0;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ' . esc_html__('ČEKA SE VERIFIKACIJA ADRESE', 'potvrdio-viber-cod') . '</div>';
            echo '<small>' . esc_html__('Porudžbina je privremeno na čekanju (On-Hold).', 'potvrdio-viber-cod') . '</small><br>';
            echo '<small>' . esc_html__('Ne predavati kurirskoj službi pre potvrde kupca.', 'potvrdio-viber-cod') . '</small>';
            echo '</div>';

            // Bi-directional Cloud Sync Button
            $sync_url = wp_nonce_url(admin_url('admin-post.php?action=potvrdio_cloud_sync&order_id=' . $order->get_id()), 'potvrdio_cloud_sync_action');
            echo '<p style="margin-top:10px;"><a href="' . esc_url($sync_url) . '" class="button button-primary" style="width:100%; text-align:center; display:block;">' . esc_html__('🔄 Sinhronizuj sa Potvrdio Cloudom', 'potvrdio-viber-cod') . '</a></p>';

            // Edge Case 9: Manual Verify Button for Store Manager
            $verify_url = wp_nonce_url(admin_url('admin-post.php?action=potvrdio_manual_verify&order_id=' . $order->get_id()), 'potvrdio_manual_verify_action');
            echo '<p style="margin-top:6px;"><a href="' . esc_url($verify_url) . '" class="button button-secondary" style="width:100%; text-align:center; display:block;">' . esc_html__('Ručno odobri (Bypass)', 'potvrdio-viber-cod') . '</a></p>';
        }

        echo '<p style="margin:6px 0;"><strong>' . esc_html__('Verifikovani telefon:', 'potvrdio-viber-cod') . '</strong> ' . esc_html($phone) . '</p>';
        echo '</div>';
    }

    /**
     * Admin Cloud Sync Action Handler
     */
    public function handle_admin_cloud_sync() {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(esc_html__('Nemate ovlašćenje za ovu radnju.', 'potvrdio-viber-cod'));
        }

        check_admin_referer('potvrdio_cloud_sync_action');

        $order_id = isset($_GET['order_id']) ? intval($_GET['order_id']) : 0;
        $order = wc_get_order($order_id);
        $res = false;
        if ($order) {
            $res = $this->check_order_status_with_cloud($order);
        }

        $redirect_url = wp_get_referer() ?: admin_url('edit.php?post_type=shop_order');
        $redirect_url = add_query_arg('potvrdio_synced', ($res && !empty($res['verified'])) ? '1' : 'checked', $redirect_url);
        wp_safe_redirect($redirect_url);
        exit;
    }

    /**
     * Admin Manual Verify Action Handler
     */
    public function handle_admin_manual_verify() {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(esc_html__('Nemate ovlašćenje za ovu radnju.', 'potvrdio-viber-cod'));
        }

        check_admin_referer('potvrdio_manual_verify_action');

        $order_id = isset($_GET['order_id']) ? intval($_GET['order_id']) : 0;
        $order = wc_get_order($order_id);
        if ($order) {
            $order->update_meta_data('_potvrdio_verified', '1');
            $order->update_meta_data('_potvrdio_admin_override', '1');
            $order->update_meta_data('_potvrdio_verified_at', current_time('mysql'));

            $raw_phone = $this->extract_order_phone($order);
            $country = $order->get_shipping_country() ?: ($order->get_billing_country() ?: 'RS');
            $normalized_phone = $this->normalize_balkan_phone($raw_phone, $country);
            $addr_hash = $this->compute_address_phone_hash($normalized_phone, $order);
            if (!empty($addr_hash)) {
                $order->update_meta_data('_potvrdio_address_phone_hash', $addr_hash);
            }

            $order->update_status('processing', __('Potvrdio: Porudžbina je ručno odobrena od strane administratora putem Potvrdio panela.', 'potvrdio-viber-cod'));
            $order->save();
        }

        wp_safe_redirect(wp_get_referer() ?: admin_url('edit.php?post_type=shop_order'));
        exit;
    }

    /**
     * Admin Settings Page
     */
    public function add_admin_menu() {
        add_options_page(
            'Potvrdio Viber Settings',
            'Potvrdio Viber COD',
            'manage_options',
            'potvrdio-settings',
            array($this, 'render_admin_settings_page')
        );
    }

    public function register_settings() {
        register_setting('potvrdio_settings_group', 'potvrdio_api_endpoint');
        register_setting('potvrdio_settings_group', 'potvrdio_api_key');
        register_setting('potvrdio_settings_group', 'potvrdio_api_secret');
        register_setting('potvrdio_settings_group', 'potvrdio_auto_approve_returning');
    }

    public function ping_central_backend() {
        $endpoint = rtrim(get_option('potvrdio_api_endpoint', 'https://potvrdio.online/api/v1'), '/');
        $api_key  = get_option('potvrdio_api_key', '');

        if (empty($api_key)) {
            return false;
        }

        $url = $endpoint . '/merchant/store/ping';
        $body = wp_json_encode(array(
            'apiKey'      => $api_key,
            'storeDomain' => home_url(),
            'version'     => '1.0.0',
            'timestamp'   => current_time('mysql'),
        ));

        $res = wp_remote_post($url, array(
            'method'      => 'POST',
            'timeout'     => 10,
            'headers'     => array(
                'Content-Type'       => 'application/json',
                'X-Potvrdio-Api-Key' => $api_key,
            ),
            'body'        => $body,
        ));

        if (is_wp_error($res)) {
            error_log('[Potvrdio] Ping failed: ' . $res->get_error_message());
            return false;
        }
        $code = wp_remote_retrieve_response_code($res);
        return ($code >= 200 && $code < 300);
    }

    public function render_admin_settings_page() {
        if (isset($_GET['settings-updated']) && $_GET['settings-updated']) {
            $ping_ok = $this->ping_central_backend();
            if ($ping_ok) {
                echo '<div class="notice notice-success is-dismissible"><p><strong>Potvrdio:</strong> ' . esc_html__('Uspešno poslat sinhronizacioni signal ka Potvrdio serveru. Vaša prodavnica je aktivna i povezana!', 'potvrdio-viber-cod') . '</p></div>';
            } else {
                echo '<div class="notice notice-warning is-dismissible"><p><strong>Potvrdio Upozorenje:</strong> ' . esc_html__('Podešavanja su sačuvana, ali signal ka Potvrdio serveru nije uspeo. Proverite Central Backend API Endpoint i API Key.', 'potvrdio-viber-cod') . '</p></div>';
            }
        }
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('Potvrdio - Podešavanja za Viber COD verifikaciju', 'potvrdio-viber-cod'); ?></h1>
            <p><?php esc_html_e('Sistem za automatsku verifikaciju adresa i smanjenje povrata pošiljki za Balkan COD porudžbine.', 'potvrdio-viber-cod'); ?></p>
            <form method="post" action="options.php">
                <?php
                settings_fields('potvrdio_settings_group');
                do_settings_sections('potvrdio_settings_group');
                ?>
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row"><?php esc_html_e('Central Backend API Endpoint', 'potvrdio-viber-cod'); ?></th>
                        <td><input type="url" name="potvrdio_api_endpoint" value="<?php echo esc_attr(get_option('potvrdio_api_endpoint', 'https://potvrdio.online/api/v1')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr valign="top">
                        <th scope="row"><?php esc_html_e('API Key', 'potvrdio-viber-cod'); ?></th>
                        <td><input type="text" name="potvrdio_api_key" value="<?php echo esc_attr(get_option('potvrdio_api_key', '')); ?>" placeholder="pk_live_..." class="regular-text" /></td>
                    </tr>
                    <tr valign="top">
                        <th scope="row"><?php esc_html_e('API Secret', 'potvrdio-viber-cod'); ?></th>
                        <td><input type="password" name="potvrdio_api_secret" value="<?php echo esc_attr(get_option('potvrdio_api_secret', '')); ?>" placeholder="sec_live_..." class="regular-text" /></td>
                    </tr>
                    <tr valign="top">
                        <th scope="row"><?php esc_html_e('Pametno automatsko odobrenje (Smart Bypass)', 'potvrdio-viber-cod'); ?></th>
                        <td>
                            <label>
                                <input type="checkbox" name="potvrdio_auto_approve_returning" value="1" <?php checked(1, get_option('potvrdio_auto_approve_returning', '0')); ?> />
                                <?php echo wp_kses_post(__('Automatski odobri prethodno verifikovane kupce kada naručuju na <strong>istu adresu isporuke</strong>', 'potvrdio-viber-cod')); ?>
                            </label>
                            <p class="description"><?php esc_html_e('Sigurnosno pravilo: Čak i ako je broj telefona isti, ukoliko je adresa isporuke promenjena, sistem iz bezbednosnih razloga ponovo pokreće verifikaciju.', 'potvrdio-viber-cod'); ?></p>
                        </td>
                    </tr>
                </table>
                <?php submit_button(__('Sačuvaj podešavanja', 'potvrdio-viber-cod')); ?>
            </form>
        </div>
        <?php
    }

    /**
     * Admin Notice when API Key is missing
     */
    public function render_missing_api_key_notice() {
        if (!empty($this->api_key)) {
            return;
        }
        $screen = function_exists('get_current_screen') ? get_current_screen() : null;
        if ($screen && strpos($screen->id, 'potvrdio') !== false) {
            return;
        }
        $settings_url = admin_url('options-general.php?page=potvrdio-settings');
        echo '<div class="notice notice-warning is-dismissible"><p><strong>Potvrdio COD Verifikacija:</strong> ' . sprintf(__('Molimo unesite vaš <a href="%s">Potvrdio API ključ i Secret</a> kako bi automatska verifikacija porudžbina bila aktivna.', 'potvrdio-viber-cod'), esc_url($settings_url)) . '</p></div>';
    }
}

// Initialize Plugin
add_action('plugins_loaded', array('Potvrdio_Viber_COD', 'get_instance'));
