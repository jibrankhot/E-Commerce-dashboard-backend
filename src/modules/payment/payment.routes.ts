// src/routes/payment.routes.ts

import { Router } from 'express';
import {
    createPayment,
    updatePaymentStatus,
    getPaymentsByOrder,
} from './payment.controller';
import { requireAdmin } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * Payments Routes
 */

/**
 * Create Payment
 * (User initiates payment)
 */
router.post('/', createPayment);

/**
 * Update Payment Status
 * (Webhook / Admin / System)
 */
router.patch('/:id/status', requireAdmin, updatePaymentStatus);

/**
 * Get Payments by Order ID
 */
router.get('/order/:orderId', requireAdmin, getPaymentsByOrder);

export default router;
