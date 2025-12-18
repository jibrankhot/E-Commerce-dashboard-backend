import slugify from 'slugify';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.validation';
import { supabaseAdmin } from '../../supabase/supabase.client';

export const createCategoryService = async (payload: CreateCategoryDto) => {
    const slug = slugify(payload.name, { lower: true, strict: true });

    const { data, error } = await supabaseAdmin
        .from('categories')
        .insert([{ ...payload, slug }])
        .select()
        .single();

    if (error) throw error;

    return data;
};

export const getCategoriesService = async () => {
    const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
};

export const getCategoryByIdService = async (id: string) => {
    const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) throw error;

    if (!data) {
        const err: any = new Error('Category not found');
        err.statusCode = 404;
        throw err;
    }

    return data;
};

export const updateCategoryService = async (
    id: string,
    payload: UpdateCategoryDto
) => {
    const updateData: any = { ...payload };

    if (payload.name) {
        updateData.slug = slugify(payload.name, {
            lower: true,
            strict: true
        });
    }

    const { data, error } = await supabaseAdmin
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    return data;
};

/**
 * Delete category (ADMIN)
 * Block deletion if products exist under this category
 */
export const deleteCategoryService = async (id: string) => {
    // 1. Check if products exist for this category
    const { count, error: productError } = await supabaseAdmin
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', id);

    if (productError) throw productError;

    if (count && count > 0) {
        const err: any = new Error(
            'Cannot delete category. Products are still assigned to this category.'
        );
        err.statusCode = 400;
        throw err;
    }

    // 2. Soft delete category
    const { data, error } = await supabaseAdmin
        .from('categories')
        .update({ status: 'INACTIVE' })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;

    return data;
};
