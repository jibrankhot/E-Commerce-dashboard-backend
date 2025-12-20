// src/routes/user.routes.ts

import { Router } from 'express';
import {
    getUsers,
    blockUser,
    unblockUser,
    getUserOrderHistory,
} from './user.controller';
import { requireAdmin } from '../auth/auth.middleware';

const router = Router();

/**
 * Users Routes (ADMIN ONLY)
 */

/**
 * Get all users
 */
router.get('/', requireAdmin, getUsers);

/**
 * Block user
 */
router.patch('/:id/block', requireAdmin, blockUser);

/**
 * Unblock user
 */
router.patch('/:id/unblock', requireAdmin, unblockUser);

/**
 * Get user order history
 */
router.get('/:id/orders', requireAdmin, getUserOrderHistory);

export default router;
