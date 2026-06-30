import { withdrawSchema } from '../validators/withdraw.validator.js';
import { processWithdraw } from '../services/withdraw.service.js';

export function withdrawToEcocash(req, res, next) {
  try {
    const validated = withdrawSchema.parse(req.body);
    const result = processWithdraw(validated);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}
