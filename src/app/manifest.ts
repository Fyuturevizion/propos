import type { MetadataRoute } from "next";
import { getPublicSiteConfig } from "@/lib/seo/site-config";

export default function manifest(): MetadataRoute.Manifest {
  const site = getPublicSiteConfig();
  const shortName =
    site.brandId === "wnluxe" ? "WN Luxe" : "TTT Props";

  return {
    name: site.name,
    short_name: shortName,
    description: site.description,
    start_url: "/en",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#059669",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["business", "lifestyle"],
    lang: "en",
    dir: "ltr",
    prefer_related_applications: false,
  };
}
