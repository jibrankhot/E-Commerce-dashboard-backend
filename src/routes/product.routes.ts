import { Router } from 'express';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller';
import { requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Admin-only routes
router.post('/', requireAdmin, createProduct);
router.get('/', requireAdmin, getProducts);
router.get('/:id', requireAdmin, getProductById);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

export default router;
