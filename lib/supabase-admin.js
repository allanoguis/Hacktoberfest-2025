import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl) {
    throw new Error('Missing Supabase URL: set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
}

if (!serviceRoleKey) {
    throw new Error('Missing Supabase service role key: set SUPABASE_SERVICE_ROLE_KEY');
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export default supabaseAdmin;
