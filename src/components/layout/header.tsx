"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Menu, X } from "lucide-react";
import { SiteBrand } from "@/components/layout/site-brand";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { useState } from "react";

export function Header() {
  const t = useTranslations("common");
  const tProps = useTranslations("properties");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/">
          <SiteBrand />
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          <Link
            href="/properties?listingType=sale"
            className="text-sm font-medium hover:text-emerald-600"
          >
            {tProps("listing.sale")}
          </Link>
          <Link
            href="/properties?listingType=rent"
            className="text-sm font-medium hover:text-emerald-600"
          >
            {tProps("listing.rent")}
          </Link>
          <Link href="/properties" className="text-sm font-medium hover:text-emerald-600">
            {tProps("title")}
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-emerald-600">
            {t("contact")}
          </Link>
          <LocaleSwitcher />
        </nav>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/properties?listingType=sale"
              className="text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {tProps("listing.sale")}
            </Link>
            <Link
              href="/properties?listingType=rent"
              className="text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {tProps("listing.rent")}
            </Link>
            <Link
              href="/properties"
              className="text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {tProps("title")}
            </Link>
            <Link href="/contact" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>
              {t("contact")}
            </Link>
            <LocaleSwitcher />
          </nav>
        </div>
      )}
    </header>
  );
}
