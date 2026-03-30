import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Building2, Globe, Bot, MapPin } from "lucide-react";

export default function HomePage() {
  const t = useTranslations();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 px-6 py-24 text-white md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {t("home.hero.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            {t("home.hero.subtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/properties"
              className="rounded-lg bg-emerald-600 px-8 py-3 font-medium text-white transition hover:bg-emerald-500"
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

      {/* Why PropOS */}
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
      <section className="bg-muted/50 px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold">{t("home.areas")}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {["bangtao", "surin", "rawai", "kamala", "kata", "cherngtalay", "patong", "naiharn", "laguna"].map(
              (area) => (
                <Link
                  key={area}
                  href={`/areas/${area}`}
                  className="rounded-full border bg-background px-4 py-2 text-sm font-medium transition hover:bg-emerald-50 hover:border-emerald-300"
                >
                  {t(`areas.${area}`)}
                </Link>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
