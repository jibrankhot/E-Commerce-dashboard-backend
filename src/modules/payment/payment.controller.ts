// src/controllers/payment.controller.ts

import { Request, Response } from 'express';
import { paymentService } from './payment.service';

/**
 * Create Payment
 * (Called when user initiates payment)
 */
export const createPayment = async (req: Request, res: Response) => {
    try {
        const { order_id, amount, provider } = req.body;

        if (!order_id || !amount || !provider) {
            return res.status(400).json({
                success: false,
                message: 'order_id, amount and provider are required',
            });
        }

        const payment = await paymentService.createPayment({
            order_id,
            amount: Number(amount),
            provider,
        });

        return res.status(201).json({
            success: true,
            data: payment,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to create payment',
        });
    }
};

/**
 * Update Payment Status
 * (Webhook placeholder – ADMIN / SYSTEM)
 */
export const updatePaymentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'status is required',
            });
        }

        const payment = await paymentService.updatePaymentStatus(id, status);

        return res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to update payment status',
        });
    }
};

/**
 * Get Payments By Order
 */
export const getPaymentsByOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;

        const payments = await paymentService.getPaymentsByOrder(orderId);

        return res.status(200).json({
            success: true,
            data: payments,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch payments',
        });
    }
};
