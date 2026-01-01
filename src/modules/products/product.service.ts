import { supabaseAdmin as supabaseAdminClient } from '../../supabase/supabase.client';
import { PRODUCT_STATUS } from '../utils/enums';
import { StorageService } from '../utils/storage.service';

const supabaseAdmin = supabaseAdminClient!;

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
        const status =
            stock === 0
                ? PRODUCT_STATUS.OUT_OF_STOCK
                : PRODUCT_STATUS.ACTIVE;

        try {
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
        } catch (err) {
            console.log('🧨 CREATE PRODUCT ROLLBACK TRIGGERED');

            if (payload.images?.length) {
                await StorageService.deleteProductImages(payload.images);
            }

            throw err;
        }
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
        // 1️⃣ Validate category if provided
        if (payload.categoryId) {
            const { data: category } = await supabaseAdmin
                .from('categories')
                .select('id')
                .eq('id', payload.categoryId)
                .single();

            if (!category) throw new Error('Invalid categoryId');
        }

        // 2️⃣ Fetch existing product
        const { data: existingProduct } = await supabaseAdmin
            .from('products')
            .select('images')
            .eq('id', id)
            .single();

        if (!existingProduct) {
            throw new Error('Product not found');
        }

        const oldImages: string[] = existingProduct.images || [];
        const newImages: string[] = payload.images ?? oldImages;

        try {
            const updateData: any = {
                updated_at: new Date(),
            };

            if (payload.name !== undefined) updateData.name = payload.name;
            if (payload.description !== undefined) updateData.description = payload.description;
            if (payload.price !== undefined) updateData.price = payload.price;

            if (payload.stock !== undefined) {
                updateData.stock = payload.stock;
                updateData.status =
                    payload.stock === 0
                        ? PRODUCT_STATUS.OUT_OF_STOCK
                        : PRODUCT_STATUS.ACTIVE;
            }

            if (payload.images !== undefined) {
                updateData.images = newImages;
            }

            if (payload.categoryId) {
                updateData.category_id = payload.categoryId;
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

            // ✅ delete removed images ONLY after DB success
            if (payload.images) {
                const removedImages = oldImages.filter(
                    img => !newImages.includes(img)
                );

                if (removedImages.length > 0) {
                    await StorageService.deleteProductImages(removedImages);
                }
            }

            return data;
        } catch (err) {
            console.log('🧨 UPDATE PRODUCT ROLLBACK TRIGGERED');

            // 🔒 rollback ONLY newly added images
            if (payload.images) {
                const newlyAdded = newImages.filter(
                    img => !oldImages.includes(img)
                );

                if (newlyAdded.length > 0) {
                    await StorageService.deleteProductImages(newlyAdded);
                }
            }

            throw err;
        }
    },

    async deleteProduct(id: string) {
        const { data: product } = await supabaseAdmin
            .from('products')
            .select('id, images')
            .eq('id', id)
            .maybeSingle();

        if (!product) return;

        if (Array.isArray(product.images) && product.images.length > 0) {
            await StorageService.deleteProductImages(product.images);
        }

        const { error } = await supabaseAdmin
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
