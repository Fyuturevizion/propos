"use client";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Building2, Menu, X, Globe } from "lucide-react";
import { useState } from "react";

export function Header() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const switchLocale = () => {
    const next = locale === "en" ? "th" : "en";
    router.replace(pathname, { locale: next });
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-emerald-600" />
          <span className="text-lg font-bold">PropOS</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/properties" className="text-sm font-medium hover:text-emerald-600">
            Properties
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-emerald-600">
            {t("contact")}
          </Link>
          <button
            onClick={switchLocale}
            className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted"
          >
            <Globe className="h-3.5 w-3.5" />
            {locale === "en" ? "ไทย" : "EN"}
          </button>
        </nav>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link href="/properties" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>
              Properties
            </Link>
            <Link href="/contact" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>
              {t("contact")}
            </Link>
            <button onClick={switchLocale} className="flex items-center gap-1 text-sm font-medium">
              <Globe className="h-3.5 w-3.5" />
              {locale === "en" ? "ไทย" : "EN"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
