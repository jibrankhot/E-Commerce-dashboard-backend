import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../supabase/supabase.client';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email?: string;
        role?: string;
    };
}

export const requireAdmin = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!supabaseAdmin) {
            return res.status(500).json({
                message: 'Supabase admin client not initialized',
            });
        }

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Missing or invalid Authorization header',
            });
        }

        const token = authHeader.split(' ')[1];

        const { data, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !data?.user) {
            return res.status(401).json({
                message: 'Invalid or expired token',
            });
        }

        const user = data.user;

        // 1️⃣ Prefer role from auth metadata (fast, no DB hit)
        const role =
            user.app_metadata?.role ||
            user.user_metadata?.role;

        // 2️⃣ Fallback to profiles table if needed
        let finalRole = role;

        if (!finalRole) {
            const { data: profile, error: profileError } =
                await supabaseAdmin
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

            if (profileError || !profile?.role) {
                return res.status(403).json({
                    message: 'Admin access required',
                });
            }

            finalRole = profile.role;
        }

        if (finalRole !== 'ADMIN') {
            return res.status(403).json({
                message: 'Admin access required',
            });
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: finalRole,
        };

        next();
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        return res.status(500).json({
            message: 'Authentication middleware failed',
        });
    }
};
