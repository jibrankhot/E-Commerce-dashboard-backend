import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Supabase Admin Client
 * - Uses SERVICE ROLE KEY (server-only)
 * - Used for auth verification & admin operations
 * - Does NOT crash server if env vars are missing
 */
let supabaseAdmin: SupabaseClient | null = null;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn(
        '⚠️  Supabase env vars missing. Supabase admin features are disabled.'
    );
} else {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
}

export { supabaseAdmin };
