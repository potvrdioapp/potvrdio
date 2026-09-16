<?php
/**
 * Plugin Name: Potvrdio - WooCommerce Viber COD Verification & Cart Recovery
 * Plugin URI: https://potvrdio.online
 * Description: Intercepts Cash on Delivery (COD) orders, sends Viber verification & address correction requests, and recovers abandoned carts for Balkan e-commerce.
 * Version: 1.0.0
 * Author: Potvrdio SaaS Team
 * Author URI: https://potvrdio.online
 * Text Domain: potvrdio-viber-cod
 * Domain Path: /languages
 * WC requires at least: 5.0
 * WC tests up to: 8.5
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class Potvrdio_Viber_COD {
    private static $instance = null;
    private $api_endpoint;
    private $api_key;
    private $api_secret;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->api_endpoint = get_option('potvrdio_api_endpoint', 'https://api.potvrdio.online/api/v1');
        $this->api_key      = get_option('potvrdio_api_key', '');
        $this->api_secret   = get_option('potvrdio_api_secret', '');

        // Intercept COD orders on checkout
        add_action('woocommerce_checkout_order_processed', array($this, 'intercept_cod_order'), 10, 3);
        
        // Add Balkan privacy consent checkbox on checkout
        add_action('woocommerce_review_order_before_submit', array($this, 'add_privacy_consent_checkbox'));
        add_action('woocommerce_checkout_process', array($this, 'validate_privacy_consent_checkbox'));
        add_action('woocommerce_checkout_update_order_meta', array($this, 'save_privacy_consent_meta'));

        // Register custom REST API webhook endpoint for central backend signals
        add_action('rest_api_init', array($this, 'register_webhook_routes'));

        // Admin Menu Settings
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
    }

    /**
     * Intercept Cash-on-Delivery orders and set status to On-Hold
     */
    public function intercept_cod_order($order_id, $posted_data, $order) {
        if (!$order) {
            return;
        }

        $payment_method = $order->get_payment_method();

        // Only trigger for Cash on Delivery (COD / Plaćanje pouzećem)
        if ('cod' !== $payment_method) {
            return;
        }

        // Set order to On-Hold to halt shipping label generation
        $order->update_status('on-hold', __('Potvrdio: Order paused for Viber verification.', 'potvrdio-viber-cod'));

        // Prepare payload for Potvrdio Central API
        $items = array();
        foreach ($order->get_items() as $item_id => $item) {
            $items[] = array(
                'name'     => $item->get_name(),
                'quantity' => $item->get_quantity(),
                'total'    => $item->get_total(),
            );
        }

        $payload = array(
            'order_id'       => (string)$order->get_id(),
            'store_domain'   => get_site_url(),
            'customer_name'  => $order->get_billing_first_name() . ' ' . $order->get_billing_last_name(),
            'customer_phone' => $order->get_billing_phone(),
            'billing_address' => array(
                'address_1' => $order->get_billing_address_1(),
                'address_2' => $order->get_billing_address_2(),
                'city'      => $order->get_billing_city(),
                'postcode'  => $order->get_billing_postcode(),
                'country'   => $order->get_billing_country(),
            ),
            'shipping_address' => array(
                'address_1' => $order->get_shipping_address_1() ?: $order->get_billing_address_1(),
                'address_2' => $order->get_shipping_address_2() ?: $order->get_billing_address_2(),
                'city'      => $order->get_shipping_city() ?: $order->get_billing_city(),
                'postcode'  => $order->get_shipping_postcode() ?: $order->get_billing_postcode(),
                'country'   => $order->get_shipping_country() ?: $order->get_billing_country(),
            ),
            'currency'       => $order->get_currency(),
            'total_amount'   => (float)$order->get_total(),
            'order_note'     => $order->get_customer_note(),
            'items'          => $items,
            'timestamp'      => time(),
        );

        // Send payload asynchronously to Potvrdio Central API
        $this->send_to_central_backend('/orders/intercept', $payload);
    }

    /**
     * Send HTTP POST to Potvrdio Central Server
     */
    private function send_to_central_backend($endpoint, $payload) {
        if (empty($this->api_key)) {
            return false;
        }

        $url = rtrim($this->api_endpoint, '/') . $endpoint;
        $body = wp_json_encode($payload);

        $signature = hash_hmac('sha256', $body, $this->api_secret);

        wp_remote_post($url, array(
            'method'    => 'POST',
            'timeout'   => 5,
            'blocking'  => false, // Asynchronous non-blocking call
            'headers'   => array(
                'Content-Type'         => 'application/json',
                'X-Potvrdio-Api-Key'   => $this->api_key,
                'X-Potvrdio-Signature' => $signature,
            ),
            'body'      => $body,
        ));
    }

    /**
     * Add Balkan Privacy Consent Checkbox (ZZPL / DPL / GDPR compliant)
     */
    public function add_privacy_consent_checkbox() {
        woocommerce_form_field('potvrdio_privacy_consent', array(
            'type'        => 'checkbox',
            'class'       => array('potvrdio-privacy-checkbox form-row-wide'),
            'label'       => __('Saglasan/na sam da primim poruku putem Viber-a/SMS-a radi verifikacije adrese i statusa pošiljke (Potvrdio.online).', 'potvrdio-viber-cod'),
            'required'    => true,
        ));
    }

    public function validate_privacy_consent_checkbox() {
        if (!isset($_POST['potvrdio_privacy_consent']) && isset($_POST['payment_method']) && $_POST['payment_method'] === 'cod') {
            wc_add_notice(__('Molimo vas da potvrdite saglasnost za verifikaciju pošiljke putem Viber poruke.', 'potvrdio-viber-cod'), 'error');
        }
    }

    public function save_privacy_consent_meta($order_id) {
        if (isset($_POST['potvrdio_privacy_consent'])) {
            update_post_meta($order_id, '_potvrdio_privacy_consent', '1');
        }
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
            // Update shipping address if provided
            if (!empty($params['updated_address'])) {
                $addr = $params['updated_address'];
                if (!empty($addr['address_1'])) $order->set_shipping_address_1(sanitize_text_field($addr['address_1']));
                if (!empty($addr['address_2'])) $order->set_shipping_address_2(sanitize_text_field($addr['address_2']));
                if (!empty($addr['city']))      $order->set_shipping_city(sanitize_text_field($addr['city']));
                if (!empty($addr['postcode']))  $order->set_shipping_postcode(sanitize_text_field($addr['postcode']));
                if (!empty($params['order_note'])) $order->add_order_note(__('Potvrdio Customer Note: ', 'potvrdio-viber-cod') . sanitize_text_field($params['order_note']));
            }

            // Transition order status to Processing
            $order->update_status('processing', __('Potvrdio: Verified by customer via Viber/potvrdio.online.', 'potvrdio-viber-cod'));
            $order->save();

            return new WP_REST_Response(array('status' => 'success', 'order_status' => 'processing'), 200);
        }

        return new WP_REST_Response(array('status' => 'ignored', 'message' => 'Action not handled'), 200);
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
    }

    public function render_admin_settings_page() {
        ?>
        <div class="wrap">
            <h1><?php _e('Potvrdio - Viber COD & Cart Recovery Settings', 'potvrdio-viber-cod'); ?></h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('potvrdio_settings_group');
                do_settings_sections('potvrdio_settings_group');
                ?>
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">Central Backend API Endpoint</th>
                        <td><input type="url" name="potvrdio_api_endpoint" value="<?php echo esc_attr(get_option('potvrdio_api_endpoint', 'https://api.potvrdio.online/api/v1')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">API Key</th>
                        <td><input type="text" name="potvrdio_api_key" value="<?php echo esc_attr(get_option('potvrdio_api_key')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">API Secret</th>
                        <td><input type="password" name="potvrdio_api_secret" value="<?php echo esc_attr(get_option('potvrdio_api_secret')); ?>" class="regular-text" /></td>
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
