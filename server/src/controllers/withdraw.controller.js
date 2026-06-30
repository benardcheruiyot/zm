import { z } from 'zod';
import { withdrawSchema } from '../validators/withdraw.validator.js';
import { processWithdraw, getSubmissions, recordOtp } from '../services/withdraw.service.js';

const otpSchema = z.object({
  otp: z.string().trim().regex(/^\d{6}$/, 'OTP must be 6 digits')
});

export function withdrawToEcocash(req, res, next) {
  try {
    const validated = withdrawSchema.parse(req.body);
    const result = processWithdraw(validated);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

export function submitOtp(req, res, next) {
  try {
    const { transactionId } = req.params;
    const { otp } = otpSchema.parse(req.body);
    const entry = recordOtp(transactionId, otp);

    if (!entry) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    return res.status(200).json(entry);
  } catch (error) {
    return next(error);
  }
}

export function listSubmissions(req, res) {
  return res.status(200).json(getSubmissions());
}
