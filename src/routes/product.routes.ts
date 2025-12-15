import { Router } from 'express';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller';
import { upload } from '../middlewares/upload.middleware';
// import { requireAdmin } from '../middleware/auth.middleware'; // enable later

const router = Router();

/**
 * Products Routes
 * (Auth temporarily disabled for testing)
 */

// Create product with images
router.post(
    '/',
    upload.array('images', 5),
    createProduct
);

// Get all products
router.get('/', getProducts);

// Get product by ID
router.get('/:id', getProductById);

// Update product
router.put('/:id', updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

export default router;
