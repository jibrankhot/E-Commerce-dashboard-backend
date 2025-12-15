import { supabase } from '../supabase/supabase.client';

export interface CreateProductPayload {
    name: string;
    description?: string;
    price: number;
    stock?: number;
    status?: string;
    images: string[];
}

export const productService = {
    /**
     * Create product in Supabase
     */
    async createProduct(payload: CreateProductPayload) {
        if (!supabase) {
            throw new Error('Supabase is not initialized');
        }

        const { data, error } = await supabase
            .from('products')
            .insert([
                {
                    name: payload.name,
                    description: payload.description,
                    price: payload.price,
                    stock: payload.stock ?? 0,
                    status: payload.status ?? 'ACTIVE',
                    images: payload.images
                }
            ])
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to create product: ${error.message}`);
        }

        return data;
    },

    /**
     * Get all products
     */
    async getProducts() {
        if (!supabase) {
            throw new Error('Supabase is not initialized');
        }

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Failed to fetch products: ${error.message}`);
        }

        return data;
    },

    /**
     * Get product by ID
     */
    async getProductById(id: string) {
        if (!supabase) {
            throw new Error('Supabase is not initialized');
        }

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw new Error(`Product not found`);
        }

        return data;
    },

    /**
     * Update product
     */
    async updateProduct(id: string, payload: Partial<CreateProductPayload>) {
        if (!supabase) {
            throw new Error('Supabase is not initialized');
        }

        const { data, error } = await supabase
            .from('products')
            .update({
                ...payload,
                updated_at: new Date()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to update product: ${error.message}`);
        }

        return data;
    },

    /**
     * Delete product
     */
    async deleteProduct(id: string) {
        if (!supabase) {
            throw new Error('Supabase is not initialized');
        }

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Failed to delete product: ${error.message}`);
        }
    }
};
