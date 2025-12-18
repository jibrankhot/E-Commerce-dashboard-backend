import { Request, Response, NextFunction } from 'express';
import {
    createCategorySchema,
    updateCategorySchema
} from './categories.validation';
import {
    createCategoryService,
    deleteCategoryService,
    getCategoriesService,
    getCategoryByIdService,
    updateCategoryService
} from './categories.service';

/**
 * Create category (ADMIN)
 */
export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validated = createCategorySchema.parse(req.body);

        const category = await createCategoryService(validated);

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all categories (ADMIN)
 */
export const getCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categories = await getCategoriesService();

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get category by ID (ADMIN)
 */
export const getCategoryById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const category = await getCategoryByIdService(id);

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update category (ADMIN)
 */
export const updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const validated = updateCategorySchema.parse(req.body);

        const category = await updateCategoryService(id, validated);

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};
/**
 * Delete category (ADMIN) — soft delete
 */
export const deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const category = await deleteCategoryService(id);

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
            data: category
        });
    } catch (error) {
        next(error);
    }
};
