<?php
/**
 * Plugin Name: Potvrdio - WooCommerce Viber COD Verification & Cart Recovery
 * Plugin URI: https://potvrdio.online
 * Description: Intercepts Cash on Delivery (COD) orders at the state machine level, holds shipping labels, normalizes Balkan phone formats, and releases orders via 2-way Viber verification.
 * Version: 1.1.0
 * Author: Potvrdio SaaS Team
 * Author URI: https://potvrdio.online
 * Text Domain: potvrdio-viber-cod
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
        $this->api_endpoint = !empty($endpoint) ? $endpoint : 'http://localhost:4001/api/v1';

        $key = get_option('potvrdio_api_key');
        $this->api_key      = !empty($key) ? $key : 'demo_api_key_123';

        $secret = get_option('potvrdio_api_secret');
        $this->api_secret   = !empty($secret) ? $secret : 'demo_secret_456';

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

        // Admin Menu Settings
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
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

            if (!$is_verified) {
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
                $order->update_status('on-hold', __('Potvrdio Gatekeeper: Redirection to On-Hold. Shipping paused pending Viber address verification.', 'potvrdio-viber-cod'));
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
                $order->update_status('on-hold', __('Potvrdio: Order paused for Viber verification.', 'potvrdio-viber-cod'));
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
            $order->update_status('on-hold', __('Potvrdio: Order paused for Viber verification.', 'potvrdio-viber-cod'));
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
            'customer_name'   => $customer_name,
            'customer_phone'  => $normalized_phone,
            'billing_address' => array(
                'address_1' => $order->get_billing_address_1() ?: 'Knez Mihailova 42',
                'address_2' => $order->get_billing_address_2() ?: '',
                'city'      => $order->get_billing_city() ?: 'Beograd',
                'postcode'  => $order->get_billing_postcode() ?: '11000',
                'country'   => $country,
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

        // Edge Case 11: Asynchronous Dispatch via Action Scheduler (zero latency checkout)
        if (function_exists('as_schedule_single_action')) {
            as_schedule_single_action(time(), 'potvrdio_async_dispatch_intercept', array('payload' => $payload), 'potvrdio');
        } else {
            $this->send_to_central_backend('/orders/intercept', $payload);
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
                'sr' => __('Broj telefona je obavezan za plaćanje pouzećem (radi Viber verifikacije adrese pre slanja pošiljke). Molimo unesite vaš broj telefona.', 'potvrdio-viber-cod'),
                'mk' => __('Телефонскиот број е задолжителен за плаќање при испорака (поради Viber верификација на адресата пред испраќање). Ве молиме внесете го вашиот телефонски број.', 'potvrdio-viber-cod'),
                'en' => __('Phone number is required for Cash on Delivery (for Viber delivery address verification). Please enter your phone number.', 'potvrdio-viber-cod'),
            ),
            'phone_label' => array(
                'sr' => __('Broj telefona (za Viber potvrdu pošiljke)', 'potvrdio-viber-cod'),
                'mk' => __('Телефонски број (за Viber потврда на пратката)', 'potvrdio-viber-cod'),
                'en' => __('Phone number (for Viber delivery verification)', 'potvrdio-viber-cod'),
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
                'sr' => __('Vaša pošiljka je privremeno zadržana kako bi se potvrdila tačnost adrese i sprečili pogrešni troškovi dostave.<br><strong>Poslat vam je Viber zahtev za verifikaciju.</strong> Čim potvrdite adresu u Viber poruci, porudžbina se automatski šalje u pripremu za kurira.', 'potvrdio-viber-cod'),
                'mk' => __('Вашата пратка е привремено задржана за потврда на точноста на адресата и спречување грешки при испорака.<br><strong>Испратено ви е Viber барање за верификација.</strong> Штом ја потврдите адресата преку Viber порака, нарачката автоматски се испраќа во подготовка за курир.', 'potvrdio-viber-cod'),
                'en' => __('Your shipment is temporarily on hold to verify address accuracy and prevent return fees.<br><strong>A Viber verification request has been sent to your phone.</strong> As soon as you confirm your address on Viber, your order will be dispatched.', 'potvrdio-viber-cod'),
            ),
            'thankyou_verified_title' => array(
                'sr' => __('Potvrdio: Porudžbina #{order_id} je uspešno verifikovana! (Viber)', 'potvrdio-viber-cod'),
                'mk' => __('Potvrdio: Нарачката #{order_id} е успешно верификувана! (Viber)', 'potvrdio-viber-cod'),
                'en' => __('Potvrdio: Order #{order_id} is successfully verified! (Viber)', 'potvrdio-viber-cod'),
            ),
            'thankyou_verified_body' => array(
                'sr' => __('Vaša adresa i porudžbina su potvrđeni putem Viber poruke. Porudžbina je prosleđena u magacin i priprema se za slanje kurirskom službom.', 'potvrdio-viber-cod'),
                'mk' => __('Вашата адреса и нарачка се потврдени преку Viber порака. Нарачката е препратена во магацин и се подготвува за испраќање со курир.', 'potvrdio-viber-cod'),
                'en' => __('Your delivery address and order have been verified via Viber. Your order has been released and is being prepared for courier dispatch.', 'potvrdio-viber-cod'),
            ),
            'privacy_consent' => array(
                'sr' => __('Saglasan/na sam da primim poruku putem Viber-a/SMS-a radi verifikacije adrese i statusa pošiljke (Potvrdio.online).', 'potvrdio-viber-cod'),
                'mk' => __('Се согласувам да примам порака преку Viber/SMS за верификација на адресата и статусот на пратката (Potvrdio.online).', 'potvrdio-viber-cod'),
                'en' => __('I agree to receive a Viber/SMS message for address and shipment verification (Potvrdio.online).', 'potvrdio-viber-cod'),
            ),
            'privacy_consent_required' => array(
                'sr' => __('Molimo vas da potvrdite saglasnost za verifikaciju pošiljke putem Viber poruke.', 'potvrdio-viber-cod'),
                'mk' => __('Ве молиме потврдете ја согласноста за верификација на пратката преку Viber порака.', 'potvrdio-viber-cod'),
                'en' => __('Please confirm consent for shipment verification via Viber message.', 'potvrdio-viber-cod'),
            ),
            'admin_missing_phone' => array(
                'sr' => __('Potvrdio Upozorenje: Porudžbina je kreirana bez broja telefona (moguće kroz custom checkout / funnel)! Viber verifikacija se NE MOŽE poslati. Porudžbina ostaje blokirana na čekanju (On-Hold).', 'potvrdio-viber-cod'),
                'mk' => __('Potvrdio Предупредување: Нарачката е креирана без телефонски број (можно преку custom checkout / funnel)! Viber верификацијата НЕ МОЖЕ да се испрати. Нарачката останува блокирана во мирување (On-Hold).', 'potvrdio-viber-cod'),
                'en' => __('Potvrdio Warning: Order was placed without a phone number! Viber verification cannot be sent. Order remains locked On-Hold.', 'potvrdio-viber-cod'),
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

            echo '<div style="background:#ECFDF5; border:2px solid #10B981; border-radius:12px; padding:18px 22px; margin:24px 0; color:#065F46; font-family:inherit;">';
            echo '<div style="font-weight:800; font-size:17px; margin-bottom:6px; display:flex; align-items:center; gap:8px;">';
            echo '<span style="color:#059669; font-size:20px;">✓</span> <span>' . esc_html($title) . '</span>';
            echo '</div>';
            echo '<p style="margin:0; font-size:14px; line-height:1.5; color:#047857;">';
            echo wp_kses_post($body);
            echo '</p>';
            echo '</div>';
        } else {
            $title = $this->get_message('thankyou_title', $order, array('order_id' => $order_id));
            $body  = $this->get_message('thankyou_body', $order);

            echo '<div style="background:#FFFBEB; border:2px solid #F59E0B; border-radius:12px; padding:18px 22px; margin:24px 0; color:#92400E; font-family:inherit;">';
            echo '<div style="font-weight:800; font-size:17px; margin-bottom:6px; display:flex; align-items:center; gap:8px;">';
            echo '<span>' . esc_html($title) . '</span>';
            echo '</div>';
            echo '<p style="margin:0; font-size:14px; line-height:1.5; color:#78350F;">';
            echo wp_kses_post($body);
            echo '</p>';
            echo '</div>';
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
                    if (isCod && (!input.placeholder || input.placeholder.indexOf('Viber') !== -1)) {
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
        $url = rtrim($this->api_endpoint, '/') . $endpoint;
        $body = wp_json_encode($payload);

        $signature = hash_hmac('sha256', $body, $this->api_secret);

        $response = wp_remote_post($url, array(
            'method'    => 'POST',
            'timeout'   => 4,
            'blocking'  => true, // Reliable synchronous delivery
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

        return true;
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
     */
    public function register_webhook_routes() {
        register_rest_route('potvrdio/v1', '/webhook', array(
            'methods'             => 'POST',
            'callback'            => array($this, 'handle_incoming_webhook'),
            'permission_callback' => array($this, 'verify_webhook_signature'),
        ));
    }

    public function verify_webhook_signature(WP_REST_Request $request) {
        $signature = $request->get_header('X-Potvrdio-Signature');
        $body      = $request->get_body();
        $expected  = hash_hmac('sha256', $body, $this->api_secret);

        return hash_equals($expected, (string)$signature);
    }

    public function handle_incoming_webhook(WP_REST_Request $request) {
        $params   = $request->get_json_params();
        $order_id = isset($params['order_id']) ? intval($params['order_id']) : 0;
        $action   = isset($params['action']) ? sanitize_text_field($params['action']) : '';

        $order = wc_get_order($order_id);
        if (!$order) {
            return new WP_REST_Response(array('status' => 'error', 'message' => 'Order not found'), 404);
        }

        if ('APPROVED' === $action || 'UPDATED_ADDRESS' === $action) {
            // 1. Mark order officially verified by Potvrdio
            $order->update_meta_data('_potvrdio_verified', '1');
            $order->update_meta_data('_potvrdio_verified_at', current_time('mysql'));

            // 2. Update shipping address if modified
            if (!empty($params['updated_address'])) {
                $addr = $params['updated_address'];
                if (!empty($addr['address_1'])) $order->set_shipping_address_1(sanitize_text_field($addr['address_1']));
                if (!empty($addr['address_2'])) $order->set_shipping_address_2(sanitize_text_field($addr['address_2']));
                if (!empty($addr['city']))      $order->set_shipping_city(sanitize_text_field($addr['city']));
                if (!empty($addr['postcode']))  $order->set_shipping_postcode(sanitize_text_field($addr['postcode']));
                if (!empty($params['order_note'])) $order->add_order_note(__('Potvrdio Customer Note: ', 'potvrdio-viber-cod') . sanitize_text_field($params['order_note']));
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
            $order->update_status('processing', __('Potvrdio: Address verified by customer via Viber/potvrdio.online. Order released for courier label generation.', 'potvrdio-viber-cod'));
            $order->save();

            // Unschedule timeout check if action scheduler is available
            if (function_exists('as_unschedule_action')) {
                as_unschedule_action('potvrdio_order_timeout_check', array('order_id' => $order_id));
            }

            return new WP_REST_Response(array('status' => 'success', 'order_status' => 'processing'), 200);
        }

        if ('CANCELLED' === $action || 'REJECTED' === $action) {
            $order->update_meta_data('_potvrdio_cancelled', '1');
            $order->update_meta_data('_potvrdio_cancelled_at', current_time('mysql'));
            $order->update_status('cancelled', __('Potvrdio: Kupac je otkazao porudžbinu putem Viber-a / potvrdio.online linka. Slanje paketa je obustavljeno, artikli su vraćeni na stanje.', 'potvrdio-viber-cod'));
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
            'Potvrdio Viber COD Doğrulama Durumu',
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
            echo '<p style="color:#64748B;">Bu sipariş Kapıda Ödeme (COD) ile verilmediği için Potvrdio filtresi uygulanmadı.</p>';
            echo '</div>';
            return;
        }

        if ($verified) {
            echo '<div style="background:#ECFDF5; border:1px solid #10B981; border-radius:8px; padding:10px; margin-bottom:10px; color:#065F46;">';
            echo '<strong>✓ ADRES DOĞRULANDI</strong><br>';
            echo '<small>Onay Zamanı: ' . esc_html($verified_at) . '</small><br>';
            if ($order->get_meta('_potvrdio_smart_bypass')) {
                echo '<small style="color:#047857; font-weight:600;">(Smart Bypass: Eşleşen Adres)</small><br>';
            } elseif ($order->get_meta('_potvrdio_admin_override')) {
                echo '<small style="color:#047857; font-weight:600;">(Yönetici Manuel Onayı)</small><br>';
            }
            echo '<small>Kargo etiketi basılabilir.</small>';
            echo '</div>';
        } else {
            echo '<div style="background:#FFFBEB; border:1px solid #F59E0B; border-radius:8px; padding:10px; margin-bottom:10px; color:#92400E;">';
            echo '<strong>⏳ DOĞRULAMA BEKLENİYOR</strong><br>';
            echo '<small>Sipariş On-Hold durumunda bekletiliyor.</small><br>';
            echo '<small>Kargo etiketi basılmamalıdır.</small>';
            echo '</div>';

            // Edge Case 9: Manual Verify Button for Store Manager
            $verify_url = wp_nonce_url(admin_url('admin-post.php?action=potvrdio_manual_verify&order_id=' . $order->get_id()), 'potvrdio_manual_verify_action');
            echo '<p style="margin-top:10px;"><a href="' . esc_url($verify_url) . '" class="button button-secondary" style="width:100%; text-align:center;">✓ Ručno odobri (Bypass)</a></p>';
        }

        echo '<p style="margin:6px 0;"><strong>Normal Telefon:</strong> ' . esc_html($phone) . '</p>';
        echo '</div>';
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

    public function render_admin_settings_page() {
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('Potvrdio - Viber COD & Cart Recovery Settings', 'potvrdio-viber-cod'); ?></h1>
            <p>WooCommerce Balkan kapıda ödeme iade önleme ve adres doğrulama motoru.</p>
            <form method="post" action="options.php">
                <?php
                settings_fields('potvrdio_settings_group');
                do_settings_sections('potvrdio_settings_group');
                ?>
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">Central Backend API Endpoint</th>
                        <td><input type="url" name="potvrdio_api_endpoint" value="<?php echo esc_attr(get_option('potvrdio_api_endpoint', 'http://localhost:4001/api/v1')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">API Key</th>
                        <td><input type="text" name="potvrdio_api_key" value="<?php echo esc_attr(get_option('potvrdio_api_key', 'demo_api_key_123')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">API Secret</th>
                        <td><input type="password" name="potvrdio_api_secret" value="<?php echo esc_attr(get_option('potvrdio_api_secret', 'demo_secret_456')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Akıllı Otomatik Onay (Smart Bypass)</th>
                        <td>
                            <label>
                                <input type="checkbox" name="potvrdio_auto_approve_returning" value="1" <?php checked(1, get_option('potvrdio_auto_approve_returning', '0')); ?> />
                                Daha önce doğrulanmış müşterileri <strong>aynı teslimat adresine</strong> sipariş verdiklerinde tekrar bekletmeden otomatik onayla
                            </label>
                            <p class="description">Güvenlik Kuralı: Telefon aynı olsa bile teslimat adresi farklıysa sistem güvenlik gereği tekrar Viber doğrulaması ister.</p>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }
}

// Initialize Plugin
add_action('plugins_loaded', array('Potvrdio_Viber_COD', 'get_instance'));
