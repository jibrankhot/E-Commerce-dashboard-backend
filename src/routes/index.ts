import { Router } from 'express';

import productRoutes from './product.routes';
import authRoutes from './auth.routes';
import categoriesRoutes from '../modules/categories/categories.routes';

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

router.use('/categories', categoriesRoutes);

export default router;
