import { useTranslations } from "next-intl";
import { Mail, Phone, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        {/* Contact form */}
        <form className="space-y-5">
          <div>
            <label className="text-sm font-medium">{t("form.name")}</label>
            <input type="text" className="mt-1 w-full rounded-md border px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="text-sm font-medium">{t("form.email")}</label>
            <input type="email" className="mt-1 w-full rounded-md border px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="text-sm font-medium">{t("form.phone")}</label>
            <input type="tel" className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">{t("form.message")}</label>
            <textarea rows={4} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" required />
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" id="pdpa" className="mt-1" required />
            <label htmlFor="pdpa" className="text-xs text-muted-foreground">
              {t("form.consent")}
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-medium text-white hover:bg-emerald-500"
          >
            {t("form.submit")}
          </button>
        </form>

        {/* Contact channels */}
        <div>
          <h2 className="text-xl font-semibold">{t("channels.title")}</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <MessageCircle className="h-8 w-8 text-green-500" />
              <div>
                <div className="font-medium">{t("channels.whatsapp")}</div>
                <div className="text-sm text-muted-foreground">+66 XX XXX XXXX</div>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <MessageCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="font-medium">{t("channels.line")}</div>
                <div className="text-sm text-muted-foreground">@propos</div>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <MessageCircle className="h-8 w-8 text-blue-500" />
              <div>
                <div className="font-medium">{t("channels.telegram")}</div>
                <div className="text-sm text-muted-foreground">@propos_phuket</div>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <Mail className="h-8 w-8 text-slate-600" />
              <div>
                <div className="font-medium">{t("channels.email")}</div>
                <div className="text-sm text-muted-foreground">hello@propos.co</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
