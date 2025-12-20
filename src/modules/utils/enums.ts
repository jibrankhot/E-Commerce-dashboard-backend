// src/constants/enums.ts

/**
 * ORDER
 */
export const ORDER_STATUS = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus =
    typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

/**
 * PAYMENT
 */
export const PAYMENT_STATUS = {
    INITIATED: 'INITIATED',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatus =
    typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

/**
 * PRODUCT
 */
export const PRODUCT_STATUS = {
    ACTIVE: 'ACTIVE',
    OUT_OF_STOCK: 'OUT_OF_STOCK',
} as const;

export type ProductStatus =
    typeof PRODUCT_STATUS[keyof typeof PRODUCT_STATUS];

/**
 * USER
 */
export const USER_ROLE = {
    ADMIN: 'ADMIN',
    USER: 'USER',
} as const;
