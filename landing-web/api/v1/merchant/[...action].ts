import registerHandler from '../../_handlers/merchantRegister';
import loginHandler from '../../_handlers/merchantLogin';
import magicLinkRequestHandler from '../../_handlers/merchantMagicLinkRequest';
import magicLoginHandler from '../../_handlers/merchantMagicLogin';
import pingHandler from '../../_handlers/merchantStorePing';
import statusHandler from '../../_handlers/merchantStoreStatus';
import testConnectionHandler from '../../_handlers/merchantStoreTestConnection';
import addStoreHandler from '../../_handlers/merchantStoresAdd';
import paymentNoticeHandler from '../../_handlers/merchantPaymentNotice';

export default async function handler(req: any, res: any) {
  const rawAction = req.query?.action;
  const action = Array.isArray(rawAction) ? rawAction.join('/') : String(rawAction || '');

  switch (action) {
    case 'register':
      return registerHandler(req, res);
    case 'login':
      return loginHandler(req, res);
    case 'magic-link/request':
      return magicLinkRequestHandler(req, res);
    case 'magic-login':
      return magicLoginHandler(req, res);
    case 'store/ping':
      return pingHandler(req, res);
    case 'store/status':
      return statusHandler(req, res);
    case 'store/test-connection':
      return testConnectionHandler(req, res);
    case 'stores/add':
      return addStoreHandler(req, res);
    case 'payments/notice':
      return paymentNoticeHandler(req, res);
    default:
      return res.status(404).json({ error: `Merchant endpoint '/api/v1/merchant/${action}' not found` });
  }
}
