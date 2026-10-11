import fs from 'fs';
import path from 'path';

export interface TimelineEvent {
  time: string;
  type: 'order' | 'dispatch' | 'read' | 'action' | 'fallback' | 'cancel' | 'saved';
  badge: string;
  title: string;
  desc: string;
}

export interface StoredOrder {
  id: string; // e.g. '#54'
  customer: string;
  phone: string;
  status: 'PENDING' | 'APPROVED' | 'EDITED_ADDRESS' | 'SMS_FALLBACK' | 'CANCELLED';
  channel: string;
  city: string;
  amount: string;
  time: string;
  responseTime: string;
  warehouseAction: string;
  updatedAddress?: string;
  apiKey?: string;
  storeDomain?: string;
  history: TimelineEvent[];
  updatedAt?: number;
}

const TMP_FILE = '/tmp/potvrdio_orders.json';

function getMemoryStore(): StoredOrder[] {
  if (!(global as any).__potvrdio_orders_store) {
    (global as any).__potvrdio_orders_store = [];
    try {
      if (fs.existsSync(TMP_FILE)) {
        const raw = fs.readFileSync(TMP_FILE, 'utf8');
        (global as any).__potvrdio_orders_store = JSON.parse(raw);
      }
    } catch {}
  }
  return (global as any).__potvrdio_orders_store;
}

function persistStore(orders: StoredOrder[]) {
  (global as any).__potvrdio_orders_store = orders;
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(orders), 'utf8');
  } catch {}
}

export function addOrUpdateOrder(order: StoredOrder): void {
  const orders = getMemoryStore();
  const existingIdx = orders.findIndex((o) => o.id === order.id);

  if (existingIdx !== -1) {
    orders[existingIdx] = {
      ...orders[existingIdx],
      ...order,
      history: [
        ...(orders[existingIdx].history || []),
        ...(order.history || []),
      ],
      updatedAt: Date.now(),
    };
  } else {
    orders.unshift({
      ...order,
      updatedAt: Date.now(),
    });
  }

  // Keep latest 100 orders
  if (orders.length > 100) {
    orders.length = 100;
  }

  persistStore(orders);
}

export function updateOrderStatus(
  orderIdNumOrString: string | number,
  status: 'APPROVED' | 'EDITED_ADDRESS' | 'CANCELLED',
  details?: { updatedAddress?: string; orderNote?: string }
): void {
  const idStr = String(orderIdNumOrString).startsWith('#')
    ? String(orderIdNumOrString)
    : `#${orderIdNumOrString}`;

  const orders = getMemoryStore();
  const order = orders.find((o) => o.id === idStr);

  const nowTime = new Date().toLocaleTimeString('sr-RS', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  if (order) {
    order.status = status;
    order.updatedAt = Date.now();

    if (status === 'APPROVED') {
      order.responseTime = '35 sec';
      order.warehouseAction = 'Spremno za slanje · WooCommerce prebačen u "Processing"';
      order.history.push({
        time: nowTime,
        type: 'action',
        badge: '1-Klik Potvrda',
        title: 'Porudžbina potvrđena od strane kupca',
        desc: 'Kupac je potvrdio adresu putem mobilnog ekrana. WooCommerce status oslobođen.',
      });
    } else if (status === 'EDITED_ADDRESS') {
      order.responseTime = '42 sec';
      order.updatedAddress = details?.updatedAddress;
      order.warehouseAction = 'Adresa ažurirana · Spremno za kurira';
      order.history.push({
        time: nowTime,
        type: 'saved',
        badge: 'Ispravka adrese',
        title: 'Kupac ažurirao adresu isporuke',
        desc: `Nova adresa: ${details?.updatedAddress || 'Izmenjena'}. Ažurirano u WooCommerce-u.`,
      });
    } else if (status === 'CANCELLED') {
      order.responseTime = '20 sec';
      order.warehouseAction = 'Otkazano · Sprečen trošak povrata paketa';
      order.history.push({
        time: nowTime,
        type: 'cancel',
        badge: 'Kupac Otkazao',
        title: 'Porudžbina otkazana od strane kupca',
        desc: 'Kupac je odustao od kupovine pre slanja paketa. Sprečeni poštanski troškovi.',
      });
    }

    persistStore(orders);
  }
}

export function getOrders(apiKey?: string): StoredOrder[] {
  const orders = getMemoryStore();
  if (!apiKey || apiKey === 'demo' || apiKey === 'demo_api_key_123') {
    return orders;
  }
  return orders.filter((o) => !o.apiKey || o.apiKey === apiKey || o.apiKey === 'demo_api_key_123');
}
