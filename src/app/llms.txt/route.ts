import { getPublicSiteConfig } from "@/lib/seo/site-config";
import { AREA_GUIDES } from "@/lib/area-guides";

export function GET() {
  const site = getPublicSiteConfig();
  const areas = site.primaryAreas
    .map((slug) => AREA_GUIDES[slug]?.name_en || slug)
    .join(", ");

  const body = `# ${site.name}
> ${site.tagline}

${site.description}

## Canonical site
- ${site.url}

## Primary content (English)
- ${site.url}/en: Home, luxury villas in Phuket, buyer and renter guidance
- ${site.url}/en/properties: Active villa and home listings with photos and prices in THB
- ${site.url}/en/contact: Speak with the team (PDPA consent on enquiries)
- ${site.url}/en/areas: Area guides for Phuket districts including ${areas}

## Languages
- English: ${site.url}/en
- Thai: ${site.url}/th

## What we do
${site.name} is a Phuket real estate brand focused on luxury pool villas near Bang Tao, Laguna, Pasak, and Cherng Talay. We publish listing details, location context, and viewing enquiries. We do not provide legal or tax advice in automated answers.

## Contact
- Email: ${site.contactEmail}

## Crawling notes
- Public marketing pages are intended for search and citation (Content-Signal: search=yes, ai-input=yes, ai-train=no).
- Dashboard and API routes are not for indexing.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
