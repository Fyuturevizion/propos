"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Globe } from "lucide-react";
import { locales, type Locale } from "@/i18n/config";
import { isWnluxeBrand } from "@/lib/brands/is-wnluxe";
import { wnluxeTheme } from "@/lib/brands/wnluxe-theme";

const LABELS: Record<Locale, string> = {
  en: "EN",
  th: "ไทย",
  ru: "РУ",
};

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const isWnluxe = isWnluxeBrand();

  return (
    <div className="flex items-center gap-1 rounded-md border p-0.5 text-xs font-medium">
      <Globe className="mx-1 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => router.replace(pathname, { locale: code })}
          className={`rounded px-2 py-1 transition ${
            code === locale
              ? isWnluxe
                ? "text-[var(--wn-navy,#071523)]"
                : "bg-emerald-600 text-white"
              : "text-muted-foreground hover:bg-muted"
          }`}
          style={
            code === locale && isWnluxe
              ? { backgroundColor: wnluxeTheme.gold }
              : undefined
          }
          aria-current={code === locale ? "true" : undefined}
          lang={code}
        >
          {LABELS[code]}
        </button>
      ))}
    </div>
  );
}
