import { Router } from 'express';

import productRoutes from './product.routes';
import authRoutes from './auth.routes';

const router = Router();

// Auth
router.use('/auth', authRoutes);

// Products (admin)
router.use('/products', productRoutes);

export default router;
