import { Request, Response } from 'express';
import { supabase } from '../supabase/supabase.client';

export const adminLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error || !data.session) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({
        accessToken: data.session.access_token,
        user: {
            id: data.user.id,
            email: data.user.email
        }
    });
};
