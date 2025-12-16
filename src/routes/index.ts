import { Router } from 'express';

import productRoutes from './product.routes';
import authRoutes from './auth.routes';

const router = Router();

/**
 * Admin Auth Routes
 * /api/admin/auth/...
 */
router.use('/admin/auth', authRoutes);

/**
 * Product Routes
 * /api/products/...
 */
router.use('/products', productRoutes);

export default router;
