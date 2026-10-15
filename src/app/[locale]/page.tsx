import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Globe, Bot, MapPin, Building2, Shield, Star } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import {
  organizationJsonLd,
  webSiteJsonLd,
  faqPageJsonLd,
} from "@/lib/seo/structured-data";
import { getPublicSiteConfig } from "@/lib/seo/site-config";
import { HomeFaq } from "@/components/marketing/home-faq";
import { buildPageMetadata } from "@/lib/seo/metadata";
import wnluxeFaq from "@/messages/brands/wnluxe.en.json";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const site = getPublicSiteConfig();
  return buildPageMetadata({
    locale,
    path: "/",
    title: site.name,
    description: site.description,
  });
}

export default async function HomePage() {
  const t = await getTranslations();
  const site = getPublicSiteConfig();
  const isWnluxe = site.brandId === "wnluxe";
  const faqJsonLd = isWnluxe
    ? faqPageJsonLd(
        wnluxeFaq.home.faq.items.map((item) => ({
          question: item.q,
          answer: item.a,
        }))
      )
    : null;

  return (
    <div>
      <JsonLd
        data={
          faqJsonLd
            ? [organizationJsonLd(), webSiteJsonLd(), faqJsonLd]
            : [organizationJsonLd(), webSiteJsonLd()]
        }
      />
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 px-6 py-24 text-white md:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white font-bold text-2xl shadow-lg shadow-emerald-600/30">
            {site.logoLetter}
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

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold">{t("home.whyUs.title")}</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border p-6 text-center">
              <MapPin className="mx-auto h-10 w-10 text-emerald-600" />
              <h3 className="mt-4 text-lg font-semibold">{t("home.whyUs.localTitle")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t("home.whyUs.local")}</p>
            </div>
            <div className="rounded-xl border p-6 text-center">
              <Globe className="mx-auto h-10 w-10 text-emerald-600" />
              <h3 className="mt-4 text-lg font-semibold">{t("home.whyUs.bilingualTitle")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t("home.whyUs.bilingual")}</p>
            </div>
            <div className="rounded-xl border p-6 text-center">
              <Bot className="mx-auto h-10 w-10 text-emerald-600" />
              <h3 className="mt-4 text-lg font-semibold">{t("home.whyUs.aiTitle")}</h3>
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
            {(isWnluxe
              ? site.primaryAreas
              : ["bangtao", "surin", "rawai", "kamala", "kata", "cherngtalay", "patong", "naiharn", "laguna"]
            ).map(
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

      {isWnluxe && <HomeFaq />}

      {/* Trust signals */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <Shield className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="font-medium text-sm">{t("home.trust.pdpaTitle")}</p>
              <p className="text-xs text-muted-foreground">{t("home.trust.pdpaBody")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <Star className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="font-medium text-sm">{t("home.trust.verifiedTitle")}</p>
              <p className="text-xs text-muted-foreground">{t("home.trust.verifiedBody")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <Building2 className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="font-medium text-sm">{t("home.trust.serviceTitle")}</p>
              <p className="text-xs text-muted-foreground">{t("home.trust.serviceBody")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
