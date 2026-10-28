import { Link } from "@/i18n/routing";
import { getPublicSiteConfig } from "@/lib/seo/site-config";
import { SiteBrand, SiteBrandFooterBlurb } from "@/components/layout/site-brand";
import { cn } from "@/lib/utils";

export function Footer() {
  const site = getPublicSiteConfig();
  const isWnluxe = site.brandId === "wnluxe";
  const linkClass = cn(
    "text-sm text-muted-foreground transition",
    isWnluxe ? "hover:text-[var(--wn-gold,#c9a962)]" : "hover:text-emerald-600"
  );

  return (
    <footer
      className={cn(
        "border-t px-6 py-12",
        isWnluxe
          ? "border-[var(--wn-navy,#071523)]/10 bg-[var(--wn-cream,#faf8f5)]"
          : "bg-slate-50"
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <SiteBrand compact />
            <SiteBrandFooterBlurb />
          </div>
          <div>
            <h3 className="text-sm font-semibold font-heading">Quick Links</h3>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/properties" className={linkClass}>
                Properties
              </Link>
              <Link href="/contact" className={linkClass}>
                Contact Us
              </Link>
              {!isWnluxe && (
                <a href="https://t.me/TTT_Properties_Bot" className={linkClass}>
                  Telegram Bot
                </a>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold font-heading">Phuket Areas</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(isWnluxe
                ? ["Cherng Talay", "Laguna", "Bang Tao", "Pasak"]
                : ["Bang Tao", "Surin", "Patong", "Kamala", "Kata", "Rawai", "Cherng Talay", "Nai Harn", "Laguna"]
              ).map((area) => (
                <Link
                  key={area}
                  href={`/areas/${area.toLowerCase().replace(/\s+/g, "")}`}
                  className={cn(linkClass, "text-xs")}
                >
                  {area}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {site.legalName}. All rights reserved. PDPA compliant.
        </div>
      </div>
    </footer>
  );
}
