import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowRight, MapPin, Shield, Sparkles } from "lucide-react";
import { getPublicSiteConfig } from "@/lib/seo/site-config";
import { wnluxeTheme } from "@/lib/brands/wnluxe-theme";

export default async function HomePage() {
  const t = await getTranslations();
  const site = getPublicSiteConfig();

  return (
    <div className="bg-[var(--wn-cream,#faf8f5)]">
      <section
        className="relative overflow-hidden px-6 py-24 text-white md:py-32"
        style={{ backgroundColor: wnluxeTheme.navy }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,169,98,0.25), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl text-center">
          <p
            className="mb-4 text-xs font-medium uppercase tracking-[0.35em]"
            style={{ color: wnluxeTheme.gold }}
          >
            {site.name}
          </p>
          <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            {t("home.hero.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/75">
            {t("home.hero.subtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold transition hover:opacity-95"
              style={{
                backgroundColor: wnluxeTheme.gold,
                color: wnluxeTheme.navy,
              }}
            >
              {t("home.cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/25 px-8 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              {t("common.contact")}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-heading text-3xl font-semibold text-[var(--wn-navy,#071523)]">
            {t("home.whyUs.title")}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: MapPin,
                title: t("home.whyUs.localTitle"),
                body: t("home.whyUs.local"),
              },
              {
                icon: Sparkles,
                title: t("home.whyUs.bilingualTitle"),
                body: t("home.whyUs.bilingual"),
              },
              {
                icon: Shield,
                title: t("home.whyUs.aiTitle"),
                body: t("home.whyUs.ai"),
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-[var(--wn-navy,#071523)]/10 bg-white p-6 shadow-sm"
              >
                <Icon
                  className="h-9 w-9"
                  style={{ color: wnluxeTheme.gold }}
                />
                <h3 className="mt-4 font-heading text-xl font-semibold text-[var(--wn-navy,#071523)]">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-6 py-20"
        style={{ backgroundColor: wnluxeTheme.navySoft }}
      >
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-heading text-3xl font-semibold text-white">
            {t("home.areas")}
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {(site.primaryAreas.length
              ? site.primaryAreas
              : ["cherngtalay", "laguna", "bangtao", "pasak"]
            ).map((area) => (
              <Link
                key={area}
                href={`/areas/${area}`}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-[var(--wn-gold,#c9a962)] hover:text-white"
              >
                {t(`areas.${area}`)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {[
            { title: t("home.trust.pdpaTitle"), body: t("home.trust.pdpaBody") },
            {
              title: t("home.trust.verifiedTitle"),
              body: t("home.trust.verifiedBody"),
            },
            {
              title: t("home.trust.serviceTitle"),
              body: t("home.trust.serviceBody"),
            },
          ].map(({ title, body }) => (
            <div
              key={title}
              className="rounded-xl border bg-white p-5 text-left shadow-sm"
            >
              <p className="font-heading text-lg font-semibold text-[var(--wn-navy,#071523)]">
                {title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
