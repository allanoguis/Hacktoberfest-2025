/**
 * Shared app constants.
 * For guest avatar: set NEXT_PUBLIC_GUEST_AVATAR_URL in .env.local to a
 * Supabase Storage public URL (e.g. after uploading a guest placeholder image)
 * to use your own asset; otherwise the DiceBear placeholder is used.
 */
const GUEST_AVATAR_URL =
  typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GUEST_AVATAR_URL?.trim()
    ? process.env.NEXT_PUBLIC_GUEST_AVATAR_URL
    : "https://api.dicebear.com/7.x/avataaars/png?seed=Guest&size=200";

export { GUEST_AVATAR_URL };
