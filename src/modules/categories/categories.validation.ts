import { z } from 'zod';

/**
 * Create category validation
 */
export const createCategorySchema = z.object({
    name: z.string().min(2, 'Category name is required'),
    description: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional()
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;

/**
 * Update category validation
 * All fields optional
 */
export const updateCategorySchema = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional()
});

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
