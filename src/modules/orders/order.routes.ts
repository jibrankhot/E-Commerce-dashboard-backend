// src/routes/order.routes.ts

import { Router } from 'express';
import {
    createOrder,
    getUserOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
} from './order.controller';
import { requireAdmin } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * Orders Routes
 */

/**
 * Create Order (Authenticated User)
 */
router.post('/', createOrder);

/**
 * Get Logged-in User Orders
 */
router.get('/my-orders', getUserOrders);

/**
 * Get All Orders (ADMIN)
 */
router.get('/', requireAdmin, getAllOrders);

/**
 * Get Order By ID (ADMIN / OWNER)
 */
router.get('/:id', getOrderById);

/**
 * Update Order Status (ADMIN)
 */
router.patch('/:id/status', requireAdmin, updateOrderStatus);

export default router;
