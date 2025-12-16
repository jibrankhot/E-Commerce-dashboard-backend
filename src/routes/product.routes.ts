import { Router } from 'express';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller';
import { upload } from '../middlewares/upload.middleware';
import { requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

/**
 * Products Routes
 * Public: Read-only
 * Admin: Create / Update / Delete
 */

/**
 * Create product with images (ADMIN)
 */
router.post(
    '/',
    requireAdmin,
    upload.array('images', 5),
    createProduct
);

/**
 * Get all products (PUBLIC)
 */
router.get('/', getProducts);

/**
 * Get product by ID (PUBLIC)
 */
router.get('/:id', getProductById);

/**
 * Update product (ADMIN)
 */
router.put(
    '/:id',
    requireAdmin,
    updateProduct
);

/**
 * Delete product (ADMIN)
 */
router.delete(
    '/:id',
    requireAdmin,
    deleteProduct
);

export default router;
