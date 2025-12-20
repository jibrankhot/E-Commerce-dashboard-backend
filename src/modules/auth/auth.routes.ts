import { Router } from 'express';
import {
    adminLogin,
    getAdminMe,
} from './auth.controller';
import { requireAdmin } from './auth.middleware';

const router = Router();

/**
 * Admin Authentication Routes
 * Base: /api/admin/auth
 */

/**
 * Admin login (PUBLIC)
 */
router.post('/login', adminLogin);

/**
 * Get logged-in admin profile (ADMIN)
 */
router.get('/me', requireAdmin, getAdminMe);

export default router;
