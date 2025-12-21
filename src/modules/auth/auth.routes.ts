import { Router } from 'express';
import {
    adminLogin,
    getAdminMe,
} from './auth.controller';
import { requireAdmin } from './auth.middleware';

const router = Router();

/**
 * Admin Authentication Routes
 * Base: /api/auth
 */

/**
 * Admin login (PUBLIC)
 * POST /api/auth/login
 */
router.post('/login', adminLogin);

/**
 * Get logged-in admin profile (ADMIN ONLY)
 * GET /api/auth/me
 */
router.get('/me', requireAdmin, getAdminMe);

export default router;
