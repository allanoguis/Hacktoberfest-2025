export function getSupabaseUrl() {
  return (
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    ''
  );
}

export function getSupabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.SUPABASE_ANON_KEY?.trim() ||
    ''
  );
}

export function getSupabaseServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';
  return key;
}

export function getPostgresUrl() {
  return (
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.POSTGRES_URL_NON_POOLING?.trim() ||
    ''
  );
}

export function getResolvedEnvSummary() {
  const supabaseUrl = getSupabaseUrl();

  return {
    supabaseUrl: supabaseUrl || null,
    supabaseHost: supabaseUrl ? safeHostname(supabaseUrl) : null,
    hasAnonKey: Boolean(getSupabaseAnonKey()),
    hasServiceRoleKey: Boolean(getSupabaseServiceRoleKey()),
    hasPostgresUrl: Boolean(getPostgresUrl())
  };
}

function safeHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}
