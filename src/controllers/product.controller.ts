import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { StorageService } from '../services/storage.service';

/**
 * Create Product (Supabase DB + Supabase Storage + Category)
 */
export const createProduct = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[] | undefined;

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one product image is required'
            });
        }

        const { categoryId } = req.body;

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: 'categoryId is required'
            });
        }

        const imageUrls = await StorageService.uploadProductImages(files);

        const product = await productService.createProduct({
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            stock: Number(req.body.stock),
            status: req.body.status,
            categoryId,
            images: imageUrls
        });

        return res.status(201).json({
            success: true,
            data: product
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to create product'
        });
    }
};

/**
 * Get All Products
 * Filters:
 *  - categoryId
 *  - status
 *  - search
 * Pagination:
 *  - page
 *  - limit
 */
export const getProducts = async (req: Request, res: Response) => {
    try {
        const {
            categoryId,
            status,
            search,
            page = '1',
            limit = '10'
        } = req.query;

        const result = await productService.getProducts({
            categoryId: categoryId ? String(categoryId) : undefined,
            status: status ? String(status) : undefined,
            search: search ? String(search) : undefined,
            page: Number(page),
            limit: Number(limit)
        });

        return res.status(200).json({
            success: true,
            ...result
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch products'
        });
    }
};

/**
 * Get Product By ID
 */
export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const product = await productService.getProductById(id);

        return res.status(200).json({
            success: true,
            data: product
        });
    } catch {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }
};

/**
 * Update Product
 */
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const updatedProduct = await productService.updateProduct(id, {
            ...req.body,
            price: req.body.price ? Number(req.body.price) : undefined,
            stock: req.body.stock ? Number(req.body.stock) : undefined
        });

        return res.status(200).json({
            success: true,
            data: updatedProduct
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to update product'
        });
    }
};

/**
 * Delete Product
 */
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await productService.deleteProduct(id);

        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete product'
        });
    }
};
