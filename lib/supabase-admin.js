import { createClient } from '@supabase/supabase-js';
import * as envModule from './env.js';

const supabaseUrl = envModule.getSupabaseUrl();
const serviceRoleKey = envModule.getSupabaseServiceRoleKey();

if (!supabaseUrl) {
    throw new Error('Missing Supabase URL: set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
}

if (!serviceRoleKey) {
    throw new Error('Missing Supabase service role key: set SUPABASE_SERVICE_ROLE_KEY');
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export default supabaseAdmin;
