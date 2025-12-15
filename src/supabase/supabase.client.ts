import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Supabase client
 * - Does NOT crash server if env vars are missing
 * - Logs warning instead
 * - Allows non-Supabase features (like image upload) to work
 */
let supabase: SupabaseClient | null = null;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn(
        '⚠️  Supabase env vars missing. Supabase features are disabled.'
    );
} else {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            persistSession: false
        }
    });
}

export { supabase };
