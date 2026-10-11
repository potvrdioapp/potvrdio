import { getOrders } from '../_ordersStore';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Potvrdio-Api-Key'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = req.query?.apiKey || req.headers['x-potvrdio-api-key'] || '';
  const orders = getOrders(typeof apiKey === 'string' ? apiKey : undefined);

  return res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
}
