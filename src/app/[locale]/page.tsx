import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Globe, Bot, MapPin, Building2, Shield, Star } from "lucide-react";

export default async function HomePage() {
  const t = await getTranslations();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 px-6 py-24 text-white md:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white font-bold text-2xl shadow-lg shadow-emerald-600/30">
            T
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {t("home.hero.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-emerald-100/80">
            {t("home.hero.subtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/properties"
              className="rounded-lg bg-white px-8 py-3 font-medium text-emerald-700 transition hover:bg-emerald-50 shadow-lg"
            >
              {t("home.cta")}
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-white/20 px-8 py-3 font-medium text-white transition hover:bg-white/10"
            >
              {t("common.contact")}
            </Link>
          </div>
        </div>
      </section>

      {/* Why TTT Properties */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold">{t("home.whyUs.title")}</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border p-6 text-center">
              <MapPin className="mx-auto h-10 w-10 text-emerald-600" />
              <h3 className="mt-4 text-lg font-semibold">Local Expertise</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t("home.whyUs.local")}</p>
            </div>
            <div className="rounded-xl border p-6 text-center">
              <Globe className="mx-auto h-10 w-10 text-emerald-600" />
              <h3 className="mt-4 text-lg font-semibold">Bilingual</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t("home.whyUs.bilingual")}</p>
            </div>
            <div className="rounded-xl border p-6 text-center">
              <Bot className="mx-auto h-10 w-10 text-emerald-600" />
              <h3 className="mt-4 text-lg font-semibold">AI-Powered</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t("home.whyUs.ai")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Areas preview */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold">{t("home.areas")}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {["bangtao", "surin", "rawai", "kamala", "kata", "cherngtalay", "patong", "naiharn", "laguna"].map(
              (area) => (
                <Link
                  key={area}
                  href={`/areas/${area}`}
                  className="rounded-full border bg-white px-4 py-2 text-sm font-medium transition hover:bg-emerald-50 hover:border-emerald-300"
                >
                  {t(`areas.${area}`)}
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <Shield className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="font-medium text-sm">PDPA Compliant</p>
              <p className="text-xs text-muted-foreground">Your data is protected under Thai law</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <Star className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="font-medium text-sm">Verified Listings</p>
              <p className="text-xs text-muted-foreground">Every property personally inspected</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <Building2 className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="font-medium text-sm">Full Service</p>
              <p className="text-xs text-muted-foreground">From search to closing and beyond</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
