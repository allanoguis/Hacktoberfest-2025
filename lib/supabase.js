import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Prefer publishable (anon) key when set; otherwise use service_role key. With anon key, RLS policies apply.
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseKey) {
    console.error('Missing Supabase key: set NEXT_PUBLIC_SUPABASE_ANON_KEY (publishable) or SUPABASE_SERVICE_ROLE_KEY');
}

let supabase;
try {
    supabase = createClient(supabaseUrl, supabaseKey);
} catch (err) {
    console.error('Failed to create Supabase client:', err);
}

export default supabase;
