// src/controllers/order.controller.ts

import { Request, Response } from 'express';
import { orderService } from './order.service';

/**
 * Create Order
 * (Authenticated User)
 */
export const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order items are required',
            });
        }

        const order = await orderService.createOrder({
            user_id: userId,
            items,
        });

        return res.status(201).json({
            success: true,
            data: order,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to create order',
        });
    }
};

/**
 * Get Logged-in User Orders
 */
export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        const orders = await orderService.getUserOrders(userId);

        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch orders',
        });
    }
};

/**
 * Get All Orders (ADMIN)
 */
export const getAllOrders = async (_req: Request, res: Response) => {
    try {
        const orders = await orderService.getAllOrders();

        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch orders',
        });
    }
};

/**
 * Get Order By ID (ADMIN / OWNER)
 */
export const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await orderService.getOrderById(id);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        return res.status(404).json({
            success: false,
            message: error.message || 'Order not found',
        });
    }
};

/**
 * Update Order Status (ADMIN)
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'status is required',
            });
        }

        const updatedOrder = await orderService.updateOrderStatus(id, status);

        return res.status(200).json({
            success: true,
            data: updatedOrder,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to update order status',
        });
    }
};
