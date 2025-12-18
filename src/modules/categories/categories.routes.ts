import { Router } from 'express';
import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from './categories.controller';
import { requireAdmin } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * Create category (ADMIN)
 */
router.post('/', requireAdmin, createCategory);

/**
 * Get all categories (ADMIN)
 */
router.get('/', requireAdmin, getCategories);

/**
 * Get category by ID (ADMIN)
 */
router.get('/:id', requireAdmin, getCategoryById);

/**
 * Update category (ADMIN)
 */
router.put('/:id', requireAdmin, updateCategory);

/**
 * Delete category (ADMIN) — soft delete
 */
router.delete('/:id', requireAdmin, deleteCategory);

export default router;
