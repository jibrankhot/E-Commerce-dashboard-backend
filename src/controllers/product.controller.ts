import { Request, Response } from 'express';
import { supabase } from '../supabase/supabase.client';
import { Product } from '../types/product.type';

// CREATE PRODUCT
export const createProduct = async (req: Request, res: Response) => {
    const product: Omit<Product, 'id' | 'created_at'> = req.body;

    const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

    if (error) {
        return res.status(400).json({ message: error.message });
    }

    return res.status(201).json(data);
};

// GET ALL PRODUCTS
export const getProducts = async (_req: Request, res: Response) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return res.status(400).json({ message: error.message });
    }

    return res.json(data);
};

// GET PRODUCT BY ID
export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(data);
};

// UPDATE PRODUCT
export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates: Partial<Product> = req.body;

    const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error || !data) {
        return res.status(400).json({ message: error?.message || 'Update failed' });
    }

    return res.json(data);
};

// DELETE PRODUCT
export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        return res.status(400).json({ message: error.message });
    }

    return res.status(204).send();
};
