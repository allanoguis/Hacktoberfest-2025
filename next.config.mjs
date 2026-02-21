import path from "path";

let supabaseHost = null;
try {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (url) supabaseHost = new URL(url).hostname;
} catch {
  // Invalid URL format; omit Supabase from image domains
}

let customGuestAvatarPattern = null;
try {
  const customUrl = process.env.NEXT_PUBLIC_GUEST_AVATAR_URL?.trim();
  if (customUrl) {
    const parsed = new URL(customUrl);
    customGuestAvatarPattern = {
      protocol: parsed.protocol.replace(":", ""),
      hostname: parsed.hostname,
      port: parsed.port || "",
      pathname: "/**",
    };
  }
} catch {
  // Invalid URL; guest avatar will use Supabase or DiceBear
}

const imagePatterns = [
  {
    protocol: "https",
    hostname: "avatars.githubusercontent.com",
    port: "",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "api.dicebear.com",
    port: "",
    pathname: "/**",
  },
  ...(supabaseHost
    ? [
        {
          protocol: "https",
          hostname: supabaseHost,
          port: "",
          pathname: "/storage/v1/object/public/**",
        },
      ]
    : []),
  ...(customGuestAvatarPattern ? [customGuestAvatarPattern] : []),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // swcMinify: true, // Enable SWC minification
  images: {
    remotePatterns: imagePatterns,
  },
  webpack: (config) => {
    // Set up the alias correctly in ES module syntax
    config.resolve.alias["@"] = path.resolve(".");
    return config;
  },
};

export default nextConfig;
