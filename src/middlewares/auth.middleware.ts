import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabase/supabase.client';

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
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Missing Authorization header' });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

        if (profileError || profile?.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        req.user = {
            id: data.user.id,
            email: data.user.email,
            role: profile.role
        };

        next();
    } catch {
        return res.status(500).json({ message: 'Auth middleware failed' });
    }
};
