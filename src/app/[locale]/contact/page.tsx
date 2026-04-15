import { getTranslations } from "next-intl/server";
import { Mail, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export default async function ContactPage() {
  const t = await getTranslations("contact");

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
          <div className="mt-6 space-y-4">
            <a
              href="https://wa.me/66XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-lg border p-4 transition hover:bg-muted/50"
            >
              <MessageCircle className="h-8 w-8 text-green-500" />
              <div>
                <div className="font-medium">{t("channels.whatsapp")}</div>
                <div className="text-sm text-muted-foreground">Quick response</div>
              </div>
            </a>
            <a
              href="https://line.me/ti/p/@ttt-properties"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-lg border p-4 transition hover:bg-muted/50"
            >
              <MessageCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="font-medium">{t("channels.line")}</div>
                <div className="text-sm text-muted-foreground">@ttt-properties</div>
              </div>
            </a>
            <a
              href="https://t.me/TTT_Properties_Bot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-lg border p-4 transition hover:bg-muted/50"
            >
              <MessageCircle className="h-8 w-8 text-blue-500" />
              <div>
                <div className="font-medium">{t("channels.telegram")}</div>
                <div className="text-sm text-muted-foreground">@TTT_Properties_Bot</div>
              </div>
            </a>
            <a
              href="mailto:hello@tttproperties.com"
              className="flex items-center gap-4 rounded-lg border p-4 transition hover:bg-muted/50"
            >
              <Mail className="h-8 w-8 text-slate-600" />
              <div>
                <div className="font-medium">{t("channels.email")}</div>
                <div className="text-sm text-muted-foreground">hello@tttproperties.com</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
