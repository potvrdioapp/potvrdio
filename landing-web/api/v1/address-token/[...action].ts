import validateHandler from '../../_handlers/addressValidate';
import submitHandler from '../../_handlers/addressSubmit';
import cancelHandler from '../../_handlers/addressCancel';

export default async function handler(req: any, res: any) {
  const rawAction = req.query?.action;
  const action = Array.isArray(rawAction) ? rawAction.join('/') : String(rawAction || '');

  switch (action) {
    case 'validate':
      return validateHandler(req, res);
    case 'submit':
      return submitHandler(req, res);
    case 'cancel':
      return cancelHandler(req, res);
    default:
      return res.status(404).json({ error: `Address token endpoint '/api/v1/address-token/${action}' not found` });
  }
}
