// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   images: {
//     remotePatterns: [
//       { protocol: "https", hostname: "res.cloudinary.com" },
//       { protocol: "https", hostname: "**.amazonaws.com" },
//       { protocol: "https", hostname: "lh3.googleusercontent.com" },
//       { protocol: "https", hostname: "avatars.githubusercontent.com" },
//       { protocol: "https", hostname: "images.igdb.com" },
//     ],
//     formats: ["image/avif", "image/webp"],
//     minimumCacheTTL: 60,
//   },
//   experimental: {
//     serverComponentsExternalPackages: ["mongoose", "sharp"],
//     optimizeCss: true,
//   },
//   headers: async () => [
//     {
//       source: "/(.*)",
//       headers: [
//         { key: "X-DNS-Prefetch-Control", value: "on" },
//         { key: "X-XSS-Protection", value: "1; mode=block" },
//         { key: "X-Frame-Options", value: "SAMEORIGIN" },
//         { key: "X-Content-Type-Options", value: "nosniff" },
//         { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
//         { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
//       ],
//     },
//     {
//       source: "/api/(.*)",
//       headers: [
//         { key: "Cache-Control", value: "no-store, must-revalidate" },
//       ],
//     },
//   ],
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       config.resolve.fallback = { fs: false, net: false, tls: false };
//     }
//     config.module.rules.push({
//       test: /\.svg$/,
//       use: ["@svgr/webpack"],
//     });
//     return config;
//   },
//   env: {
//     CUSTOM_KEY: process.env.CUSTOM_KEY,
//   },
// };

// module.exports = nextConfig;











/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ❌ removed swcMinify (no longer valid)

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.igdb.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  // ✅ moved बाहर (ONLY this change)
  serverExternalPackages: ["mongoose", "sharp"],

  experimental: {
    optimizeCss: true, // untouched
  },

  // ✅ added (fix turbopack error)
  turbopack: {},

  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-DNS-Prefetch-Control", value: "on" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
    {
      source: "/api/(.*)",
      headers: [
        { key: "Cache-Control", value: "no-store, must-revalidate" },
      ],
    },
  ],

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, net: false, tls: false };
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;