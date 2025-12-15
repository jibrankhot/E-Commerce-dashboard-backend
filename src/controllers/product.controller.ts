import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { StorageService } from '../services/storage.service';

/**
 * Create Product (Supabase DB + Supabase Storage)
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

        // 1. Upload images to Supabase Storage
        const imageUrls = await StorageService.uploadProductImages(files);

        // 2. Create product in Supabase DB
        const product = await productService.createProduct({
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            stock: Number(req.body.stock),
            status: req.body.status,
            images: imageUrls
        });

        return res.status(201).json({
            success: true,
            data: product
        });
    } catch (error: any) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to create product'
        });
    }
};

/**
 * Get All Products
 */
export const getProducts = async (_req: Request, res: Response) => {
    try {
        const products = await productService.getProducts();

        return res.status(200).json({
            success: true,
            data: products
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
    } catch (error: any) {
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

        const product = await productService.updateProduct(id, req.body);

        return res.status(200).json({
            success: true,
            data: product
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
