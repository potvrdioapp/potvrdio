---
name: woocommerce-expert
description: >-
  Advanced WooCommerce 8.x-11.x engineering, HPOS (High-Performance Order Storage),
  Gutenberg Block Checkout (Store API), Classic Hooks, Custom Funnels (CartFlows, FunnelKit),
  Order State Machine Gatekeepers, and Action Scheduler background tasks.
---

# WooCommerce Senior Developer Knowledge Base & Skill

This skill governs enterprise-grade WooCommerce plugin and architecture engineering, specifically tailored for WooCommerce 8.0 through 11.x+.

---

## 1. Core Architecture & High-Performance Order Storage (HPOS)

WooCommerce 8.0+ deprecates `wp_posts` and `wp_postmeta` for orders in favor of dedicated tables (`wp_wc_orders`, `wp_wc_order_addresses`, `wp_wc_order_operational_data`).

### Rules:
1. **Always declare HPOS compatibility** in `before_woocommerce_init`:
   ```php
   add_action('before_woocommerce_init', function() {
       if (class_exists(\Automattic\WooCommerce\Utilities\FeaturesUtil::class)) {
           \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
           \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('cart_checkout_blocks', __FILE__, true);
       }
   });
   ```
2. **NEVER use WordPress postmeta functions on orders**:
   - `get_post_meta($order_id, ...)` -> Use `$order->get_meta(...)`
   - `update_post_meta($order_id, ...)` -> Use `$order->update_meta_data(...)` followed by `$order->save()`
   - Direct SQL on `wp_posts` / `wp_postmeta` -> Use `wc_get_orders()` with `WC_Order_Query`.

---

## 2. The Dual-Checkout Reality: Gutenberg Blocks vs. Classic Shortcode

In modern WooCommerce stores, you will encounter two distinct checkout paradigms:

### A. Modern Gutenberg Block Checkout (`<!-- wp:woocommerce/checkout -->`)
- Operates via WooCommerce **Store API** (`/wp-json/wc/store/v1/checkout`).
- **Classic hooks do NOT fire!** (`woocommerce_checkout_order_processed` is bypassed).
- Must hook into Store API actions:
  - `woocommerce_store_api_checkout_update_order_from_request` ($order, $request): For server-side validation and mutating the order before commit. Throw `\Exception` to block.
  - `woocommerce_store_api_checkout_order_processed` ($order): Fires after the Store API order is saved.

### B. Classic Shortcode Checkout (`[woocommerce_checkout]`)
- Fires standard legacy hooks:
  - `woocommerce_after_checkout_validation` ($data, $errors): Add `$errors->add(...)` to abort.
  - `woocommerce_checkout_create_order` ($order, $data): Throw `\Exception` to rollback transaction.
  - `woocommerce_checkout_order_processed` ($order_id, $posted_data, $order): Post-creation intercept.

### C. Universal Third-Party Funnel Interception (CartFlows, FunnelKit, AeroCheckout, REST API)
- Must hook universal database insertion events:
  - `woocommerce_new_order` ($order_id, $order) at priority `20+`.
  - `woocommerce_rest_pre_insert_shop_order_object` ($order, $request, $creating): For headless API orders.

---

## 3. Order Lifecycle State Machine & Gatekeeper Pattern

To prevent external gateways or funnels from bypassing status controls (e.g. prematurely moving an unverified COD order to `processing`):

```php
add_action('woocommerce_order_status_changed', 'enforce_order_status_gatekeeper', 10, 4);

function enforce_order_status_gatekeeper($order_id, $old_status, $new_status, $order) {
    if (!$order || 'cod' !== $order->get_payment_method()) return;

    if (in_array($new_status, array('processing', 'completed'), true)) {
        $is_verified = (bool)$order->get_meta('_potvrdio_verified');
        if (!$is_verified) {
            $order->update_status('on-hold', 'Potvrdio Gatekeeper: Verification required before processing.');
        }
    }
}
```

---

## 4. Background Queuing with Action Scheduler

Never execute slow external HTTP calls (Viber API, Webhooks, CRM sync) synchronously during checkout:
```php
// Schedule background delivery
as_schedule_single_action(time(), 'potvrdio_dispatch_order_payload', array('order_id' => $order_id));

// Hook the background runner
add_action('potvrdio_dispatch_order_payload', 'potvrdio_execute_webhook_dispatch');
```

---

## 5. Security & Internationalization Checklist
- Always verify HMAC signatures on incoming webhooks with `hash_equals(hash_hmac('sha256', $body, $secret), $header_sig)`.
- Always verify nonces (`check_admin_referer`) and permissions (`current_user_can('manage_woocommerce')`) in WP Admin.
- Never output raw user input without escaping (`esc_html`, `esc_attr`, `wp_kses_post`).
- Always support store locale via `determine_locale()` and fallback gracefully to localized country dictionaries.
