import { getPublicSiteConfig } from "@/lib/seo/site-config";
import { wnluxeTheme } from "@/lib/brands/wnluxe-theme";
import { cn } from "@/lib/utils";

export function SiteBrand({ compact }: { compact?: boolean }) {
  const site = getPublicSiteConfig();
  const isWnluxe = site.brandId === "wnluxe";

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold tracking-tight",
          isWnluxe
            ? "border border-[var(--wn-gold,#c9a962)]/40 text-[var(--wn-gold,#c9a962)]"
            : "bg-emerald-600 text-white"
        )}
        style={
          isWnluxe
            ? { backgroundColor: wnluxeTheme.navy }
            : undefined
        }
      >
        {site.logoLetter}
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "text-lg font-semibold leading-tight tracking-tight",
            isWnluxe && "font-heading"
          )}
        >
          {site.name}
        </span>
        {!compact && (
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground leading-none">
            {site.tagline}
          </span>
        )}
      </div>
    </div>
  );
}

export function SiteBrandFooterBlurb() {
  const site = getPublicSiteConfig();
  return (
    <p className="mt-3 max-w-xs text-sm text-muted-foreground">
      {site.description}
    </p>
  );
}
