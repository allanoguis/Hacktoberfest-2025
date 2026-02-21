/**
 * Guest avatar URL. Set NEXT_PUBLIC_GUEST_AVATAR_URL in .env.local to your image URL (e.g. Supabase Storage).
 * If unset, falls back to DiceBear placeholder.
 */
const GUEST_AVATAR_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GUEST_AVATAR_URL?.trim()) ||
  "https://api.dicebear.com/7.x/avataaars/png?seed=Guest&size=200";

export { GUEST_AVATAR_URL };
