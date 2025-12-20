// src/services/payment.service.ts

import { PAYMENT_STATUS } from '../utils/enums';
import { supabaseAdmin } from '../../supabase/supabase.client';
import { Logger } from '../utils/logger';

export interface CreatePaymentPayload {
    order_id: string;
    amount: number;
    provider: string;
}

export const paymentService = {
    /**
     * Create Payment Record
     */
    async createPayment(payload: CreatePaymentPayload) {
        const { data, error } = await supabaseAdmin
            .from('payments')
            .insert([{
                order_id: payload.order_id,
                amount: payload.amount,
                provider: payload.provider,
                status: PAYMENT_STATUS.INITIATED,
            }])
            .select()
            .single();

        if (error) throw error;

        // 🔹 AUDIT LOG
        await Logger.log({
            entity: 'PAYMENT',
            entity_id: data.id,
            action: 'PAYMENT_INITIATED',
            metadata: {
                order_id: payload.order_id,
                amount: payload.amount,
                provider: payload.provider,
            },
        });

        return data;
    },

    /**
     * Update Payment Status
     * (Webhook / Admin)
     */
    async updatePaymentStatus(
        paymentId: string,
        status: typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS],
        performedBy?: string
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

        // 🔹 AUDIT LOG
        await Logger.log({
            entity: 'PAYMENT',
            entity_id: paymentId,
            action: `PAYMENT_${status}`,
            metadata: {
                status,
                order_id: data.order_id,
            },
            performed_by: performedBy,
        });

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
