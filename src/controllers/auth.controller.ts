import { Request, Response } from 'express';
import { supabaseAdmin } from '../supabase/supabase.client';

/**
 * ADMIN LOGIN
 */
export const adminLogin = async (req: Request, res: Response) => {
    try {
        if (!supabaseAdmin) {
            return res.status(500).json({
                message: 'Supabase admin client not initialized',
            });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
            });
        }

        const { data, error } =
            await supabaseAdmin.auth.signInWithPassword({
                email,
                password,
            });

        if (error || !data?.session || !data?.user) {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }

        const user = data.user;

        const role =
            user.app_metadata?.role ||
            user.user_metadata?.role;

        if (role !== 'ADMIN') {
            return res.status(403).json({
                message: 'Admin access required',
            });
        }

        return res.status(200).json({
            accessToken: data.session.access_token,
            user: {
                id: user.id,
                email: user.email,
                role,
            },
        });
    } catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json({
            message: 'Admin login failed',
        });
    }
};

/**
 * GET LOGGED-IN ADMIN PROFILE
 * GET /api/admin/auth/me
 */
export const getAdminMe = async (req: Request, res: Response) => {
    try {
        // requireAdmin middleware already validated token & role
        const user = (req as any).user;

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Admin me error:', error);
        return res.status(500).json({
            message: 'Failed to fetch admin profile',
        });
    }
};
