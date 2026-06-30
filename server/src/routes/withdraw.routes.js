import { Router } from 'express';
import { withdrawToEcocash } from '../controllers/withdraw.controller.js';

const router = Router();

router.post('/withdraw', withdrawToEcocash);

export default router;
