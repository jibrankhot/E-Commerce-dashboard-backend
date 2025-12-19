// src/controllers/user.controller.ts

import { Request, Response } from 'express';
import { userService } from './user.service';

/**
 * Get All Users (ADMIN)
 */
export const getUsers = async (_req: Request, res: Response) => {
    try {
        const users = await userService.getUsers();

        return res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch users',
        });
    }
};

/**
 * Block User (ADMIN)
 */
export const blockUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await userService.blockUser(id);

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to block user',
        });
    }
};

/**
 * Unblock User (ADMIN)
 */
export const unblockUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await userService.unblockUser(id);

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to unblock user',
        });
    }
};

/**
 * Get User Order History (ADMIN)
 */
export const getUserOrderHistory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const orders = await userService.getUserOrders(id);

        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch user order history',
        });
    }
};
