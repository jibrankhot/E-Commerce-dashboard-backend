// src/services/order.service.ts

import { supabaseAdmin } from '../../supabase/supabase.client';
import {
    Order,
    OrderItem,
    CreateOrderInput,
    OrderStatus,
} from './order.model';
import { Logger } from '../utils/logger';
import { ORDER_STATUS } from '../utils/enums';

export const orderService = {
    /**
     * Create Order (TRANSACTIONAL)
     */
    async createOrder(payload: CreateOrderInput) {
        const { user_id, items } = payload;

        const { data, error } = await supabaseAdmin.rpc(
            'create_order_transaction',
            {
                p_user_id: user_id,
                p_items: items,
            }
        );

        if (error) {
            throw new Error(error.message);
        }

        // 🔹 AUDIT LOG
        await Logger.log({
            entity: 'ORDER',
            entity_id: data.id,
            action: 'ORDER_CREATED',
            metadata: {
                total_amount: data.total_amount,
                items,
            },
            performed_by: user_id,
        });

        return data as Order;
    },

    /**
     * Get Orders of a User
     */
    async getUserOrders(userId: string) {
        const { data, error } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data as Order[];
    },

    /**
     * Get All Orders (ADMIN)
     */
    async getAllOrders() {
        const { data, error } = await supabaseAdmin
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data as Order[];
    },

    /**
     * Get Order By ID (with items)
     */
    async getOrderById(orderId: string) {
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            throw new Error('Order not found');
        }

        const { data: items, error: itemsError } = await supabaseAdmin
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);

        if (itemsError) throw itemsError;

        return {
            order: order as Order,
            items: items as OrderItem[],
        };
    },

    /**
     * Update Order Status (ADMIN)
     */
    async updateOrderStatus(
        orderId: string,
        status: OrderStatus,
        performedBy?: string
    ) {
        // 🔴 CANCEL = TRANSACTIONAL
        if (status === ORDER_STATUS.CANCELLED) {
            const { data, error } = await supabaseAdmin.rpc(
                'cancel_order_transaction',
                {
                    p_order_id: orderId,
                }
            );

            if (error) {
                throw new Error(error.message);
            }

            // 🔹 AUDIT LOG
            await Logger.log({
                entity: 'ORDER',
                entity_id: orderId,
                action: 'ORDER_CANCELLED',
                metadata: {
                    previous_status: data.status,
                },
                performed_by: performedBy,
            });

            return data as Order;
        }

        // 🔹 NORMAL STATUS UPDATE
        const { data, error } = await supabaseAdmin
            .from('orders')
            .update({
                status,
                updated_at: new Date(),
            })
            .eq('id', orderId)
            .select()
            .single();

        if (error) throw error;

        // 🔹 AUDIT LOG
        await Logger.log({
            entity: 'ORDER',
            entity_id: orderId,
            action: 'ORDER_STATUS_CHANGED',
            metadata: {
                new_status: status,
            },
            performed_by: performedBy,
        });

        return data as Order;
    },
};
