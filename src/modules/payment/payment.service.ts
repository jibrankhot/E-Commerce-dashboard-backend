// src/services/payment.service.ts

import { supabaseAdmin } from '../../supabase/supabase.client';

export interface CreatePaymentPayload {
    order_id: string;
    amount: number;
    provider: string;
}

export const paymentService = {
    /**
     * Create Payment Record
     * (Called when payment process is initiated)
     */
    async createPayment(payload: CreatePaymentPayload) {
        const { data, error } = await supabaseAdmin
            .from('payments')
            .insert([{
                order_id: payload.order_id,
                amount: payload.amount,
                provider: payload.provider,
                status: 'INITIATED',
            }])
            .select()
            .single();

        if (error) throw error;

        return data;
    },

    /**
     * Update Payment Status
     * (Used by webhook later)
     */
    async updatePaymentStatus(
        paymentId: string,
        status: 'SUCCESS' | 'FAILED' | 'REFUNDED'
    ) {
        const { data, error } = await supabaseAdmin
            .from('payments')
            .update({
                status,
            })
            .eq('id', paymentId)
            .select()
            .single();

        if (error) throw error;

        return data;
    },

    /**
     * Get Payments for an Order
     */
    async getPaymentsByOrder(orderId: string) {
        const { data, error } = await supabaseAdmin
            .from('payments')
            .select('*')
            .eq('order_id', orderId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data;
    },
};
