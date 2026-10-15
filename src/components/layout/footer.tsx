import { Link } from "@/i18n/routing";
import { getPublicSiteConfig } from "@/lib/seo/site-config";
import { SiteBrand, SiteBrandFooterBlurb } from "@/components/layout/site-brand";

export function Footer() {
  const site = getPublicSiteConfig();
  return (
    <footer className="border-t bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <SiteBrand compact />
            <SiteBrandFooterBlurb />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/properties" className="text-sm text-muted-foreground hover:text-emerald-600">Properties</Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-emerald-600">Contact Us</Link>
              <a href="https://t.me/TTT_Properties_Bot" className="text-sm text-muted-foreground hover:text-emerald-600">Telegram Bot</a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Phuket Areas</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Bang Tao", "Surin", "Patong", "Kamala", "Kata", "Rawai", "Cherng Talay", "Nai Harn", "Laguna"].map((area) => (
                <Link
                  key={area}
                  href={`/areas/${area.toLowerCase().replace(" ", "")}`}
                  className="text-xs text-muted-foreground hover:text-emerald-600"
                >
                  {area}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {site.legalName}. All rights reserved. PDPA compliant.
        </div>
      </div>
    </footer>
  );
}
