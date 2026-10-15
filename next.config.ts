import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false,
  async headers() {
    const agenticCache =
      "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";
    return [
      {
        source: "/robots.txt",
        headers: [{ key: "Cache-Control", value: agenticCache }],
      },
      {
        source: "/llms.txt",
        headers: [{ key: "Cache-Control", value: agenticCache }],
      },
      {
        source: "/sitemap.xml",
        headers: [{ key: "Cache-Control", value: agenticCache }],
      },
    ];
  },
  // Allow images from Supabase Storage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Allow Cloudflare tunnel access in dev
  allowedDevOrigins: [
    "emerging-excluding-noon-its.trycloudflare.com",
  ],
};

export default withNextIntl(nextConfig);
