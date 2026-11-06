import { getTranslations } from "next-intl/server";
import { Mail, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getPublicSiteConfig,
  getResolvedContactChannels,
} from "@/lib/seo/site-config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return buildPageMetadata({
    locale,
    path: "/contact",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const site = getPublicSiteConfig();
  const ch = getResolvedContactChannels(site);

  const hasDirectChannel = Boolean(
    ch.whatsappHref ||
      ch.lineHref ||
      ch.telegramHref ||
      ch.emailAddress
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <ContactForm />

        <div>
          <h2 className="text-xl font-semibold">{t("channels.title")}</h2>
          {!hasDirectChannel ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {t("channels.formOnlyHint")}
            </p>
          ) : null}
          <div className="mt-6 space-y-4">
            {ch.whatsappHref ? (
              <a
                href={ch.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-lg border p-4 transition hover:bg-muted/50"
              >
                <MessageCircle className="h-8 w-8 text-green-500" />
                <div>
                  <div className="font-medium">{t("channels.whatsapp")}</div>
                  <div className="text-sm text-muted-foreground">
                    {t("channels.quickResponse")}
                  </div>
                </div>
              </a>
            ) : null}
            {ch.lineHref ? (
              <a
                href={ch.lineHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-lg border p-4 transition hover:bg-muted/50"
              >
                <MessageCircle className="h-8 w-8 text-green-600" />
                <div>
                  <div className="font-medium">{t("channels.line")}</div>
                  {ch.lineSubtitle ? (
                    <div className="text-sm text-muted-foreground">
                      {ch.lineSubtitle}
                    </div>
                  ) : null}
                </div>
              </a>
            ) : null}
            {ch.telegramHref ? (
              <a
                href={ch.telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-lg border p-4 transition hover:bg-muted/50"
              >
                <MessageCircle className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="font-medium">{t("channels.telegram")}</div>
                  {ch.telegramSubtitle ? (
                    <div className="text-sm text-muted-foreground">
                      {ch.telegramSubtitle}
                    </div>
                  ) : null}
                </div>
              </a>
            ) : null}
            {ch.emailAddress ? (
              <a
                href={`mailto:${ch.emailAddress}`}
                className="flex items-center gap-4 rounded-lg border p-4 transition hover:bg-muted/50"
              >
                <Mail className="h-8 w-8 text-slate-600" />
                <div>
                  <div className="font-medium">{t("channels.email")}</div>
                  <div className="text-sm text-muted-foreground">
                    {ch.emailAddress}
                  </div>
                </div>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
