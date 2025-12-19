// src/services/product.service.ts

import { supabaseAdmin } from '../supabase/supabase.client';

export interface CreateProductPayload {
    name: string;
    description?: string;
    price: number;
    stock?: number;
    status?: string;
    images: string[];
    categoryId: string;
}

interface GetProductsOptions {
    categoryId?: string;
    status?: string;
    search?: string;
    page: number;
    limit: number;
}

export const productService = {
    async createProduct(payload: CreateProductPayload) {
        const { data: category } = await supabaseAdmin
            .from('categories')
            .select('id')
            .eq('id', payload.categoryId)
            .single();

        if (!category) throw new Error('Invalid categoryId');

        const stock = payload.stock ?? 0;
        const status = stock === 0 ? 'OUT_OF_STOCK' : 'ACTIVE';

        const { data, error } = await supabaseAdmin
            .from('products')
            .insert([{
                name: payload.name,
                description: payload.description,
                price: payload.price,
                stock,
                status,
                images: payload.images,
                category_id: payload.categoryId,
            }])
            .select(`
                *,
                category:categories ( id, name, status )
            `)
            .single();

        if (error) throw error;

        return data;
    },

    async getProducts(options: GetProductsOptions) {
        const { categoryId, status, search, page, limit } = options;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabaseAdmin
            .from('products')
            .select(`
                *,
                category:categories ( id, name, status )
            `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (categoryId) query = query.eq('category_id', categoryId);
        if (status) query = query.eq('status', status);
        if (search) query = query.ilike('name', `%${search}%`);

        const { data, count, error } = await query;

        if (error) throw error;

        return {
            data,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: count ? Math.ceil(count / limit) : 0,
            },
        };
    },

    async getProductById(id: string) {
        const { data, error } = await supabaseAdmin
            .from('products')
            .select(`
                *,
                category:categories ( id, name, status )
            `)
            .eq('id', id)
            .single();

        if (error || !data) throw new Error('Product not found');

        return data;
    },

    async updateProduct(id: string, payload: Partial<CreateProductPayload>) {
        if (payload.categoryId) {
            const { data: category } = await supabaseAdmin
                .from('categories')
                .select('id')
                .eq('id', payload.categoryId)
                .single();

            if (!category) throw new Error('Invalid categoryId');
        }

        const updateData: any = {
            ...payload,
            updated_at: new Date(),
        };

        if (payload.stock !== undefined) {
            updateData.status =
                payload.stock === 0 ? 'OUT_OF_STOCK' : 'ACTIVE';
        }

        if (payload.categoryId) {
            updateData.category_id = payload.categoryId;
            delete updateData.categoryId;
        }

        const { data, error } = await supabaseAdmin
            .from('products')
            .update(updateData)
            .eq('id', id)
            .select(`
                *,
                category:categories ( id, name, status )
            `)
            .single();

        if (error) throw error;

        return data;
    },

    async deleteProduct(id: string) {
        const { error } = await supabaseAdmin
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
