import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseKey) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

let supabase;
try {
    supabase = createClient(supabaseUrl, supabaseKey);
} catch (err) {
    console.error('Failed to create Supabase client:', err);
}

export default supabase;
