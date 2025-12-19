// src/models/order.model.ts

export type OrderStatus =
    | 'PENDING'
    | 'PAID'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED';

export type PaymentStatus =
    | 'INITIATED'
    | 'SUCCESS'
    | 'FAILED'
    | 'REFUNDED';

export interface Order {
    id: string;
    user_id: string;
    total_amount: number;
    status: OrderStatus;
    payment_status: PaymentStatus;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    price: number;
    quantity: number;
}

/**
 * Input payload for creating an order
 * (service-layer usage)
 */
export interface CreateOrderItemInput {
    product_id: string;
    quantity: number;
}

export interface CreateOrderInput {
    user_id: string;
    items: CreateOrderItemInput[];
}
