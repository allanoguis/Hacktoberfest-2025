import { createClient } from '@supabase/supabase-js';
import { getSupabaseServiceRoleKey, getSupabaseUrl } from './env';

const supabaseUrl = getSupabaseUrl();

const serviceRoleKey = getSupabaseServiceRoleKey();

if (!supabaseUrl) {
    throw new Error('Missing Supabase URL: set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
}

if (!serviceRoleKey) {
    throw new Error('Missing Supabase service role key: set SUPABASE_SERVICE_ROLE_KEY');
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export default supabaseAdmin;
