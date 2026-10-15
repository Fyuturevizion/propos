import { getPublicSiteConfig } from "@/lib/seo/site-config";

const RETRIEVAL_BOTS = [
  "Googlebot",
  "Google-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ClaudeBot",
  "PerplexityBot",
  "Applebot-Extended",
  "Bingbot",
];

export function GET() {
  const site = getPublicSiteConfig();
  const lines = [
    "# Allow search and answer engines to cite public pages",
    "User-agent: *",
    "Allow: /",
    "Disallow: /dashboard/",
    "Disallow: /api/",
    "Content-Signal: search=yes, ai-input=yes, ai-train=no",
    "",
    `Sitemap: ${site.url}/sitemap.xml`,
    `Host: ${site.url.replace(/^https?:\/\//, "")}`,
    "",
  ];

  for (const bot of RETRIEVAL_BOTS) {
    lines.push(`User-agent: ${bot}`, "Allow: /", "");
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
