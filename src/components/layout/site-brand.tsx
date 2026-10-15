import { getPublicSiteConfig } from "@/lib/seo/site-config";

export function SiteBrand({ compact }: { compact?: boolean }) {
  const site = getPublicSiteConfig();
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm">
        {site.logoLetter}
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold leading-tight tracking-tight">
          {site.name}
        </span>
        {!compact && (
          <span className="text-[10px] text-muted-foreground leading-none">
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
