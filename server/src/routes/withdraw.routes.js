import { Router } from 'express';
import { withdrawToEcocash, listSubmissions, submitOtp } from '../controllers/withdraw.controller.js';

const router = Router();

router.post('/withdraw', withdrawToEcocash);
router.get('/withdraw', listSubmissions);
router.patch('/withdraw/:transactionId/otp', submitOtp);

export default router;
