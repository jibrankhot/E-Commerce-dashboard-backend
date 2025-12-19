// src/services/user.service.ts

import { supabaseAdmin } from '../../supabase/supabase.client';

export const userService = {
    /**
     * Get All Users (ADMIN)
     */
    async getUsers() {
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data;
    },

    /**
     * Block User (ADMIN)
     */
    async blockUser(userId: string) {
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .update({
                is_blocked: true,
                updated_at: new Date(),
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;

        return data;
    },

    /**
     * Unblock User (ADMIN)
     */
    async unblockUser(userId: string) {
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .update({
                is_blocked: false,
                updated_at: new Date(),
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;

        return data;
    },

    /**
     * Get User Order History (ADMIN)
     */
    async getUserOrders(userId: string) {
        const { data, error } = await supabaseAdmin
            .from('orders')
            .select(`
                *,
                items:order_items (
                    id,
                    product_id,
                    price,
                    quantity
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data;
    },
};
