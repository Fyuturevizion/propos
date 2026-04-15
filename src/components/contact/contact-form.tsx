"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle } from "lucide-react";

export function ContactForm({
  propertySlug,
  propertyTitle,
  compact = false,
}: {
  propertySlug?: string;
  propertyTitle?: string;
  compact?: boolean;
}) {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      fullName: (form.fullName as any).value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value,
      propertyTypeInterest: propertyTitle || null,
      notes: propertySlug ? `Enquiry about: ${propertyTitle} (${propertySlug})` : null,
      pdpaConsent: form.pdpa?.checked || false,
      source: "website",
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <CheckCircle className="h-10 w-10 text-emerald-600" />
        <p className="font-medium">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {propertyTitle && compact && (
        <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          Regarding: {propertyTitle}
        </div>
      )}
      <div>
        {compact ? null : <label className="text-sm font-medium">{t("form.name")}</label>}
        <input
          name="fullName"
          type="text"
          placeholder={compact ? "Your name" : undefined}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          required
        />
      </div>
      <div>
        {compact ? null : <label className="text-sm font-medium">{t("form.email")}</label>}
        <input
          name="email"
          type="email"
          placeholder={compact ? "Email" : undefined}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          required
        />
      </div>
      <div>
        {compact ? null : <label className="text-sm font-medium">{t("form.phone")}</label>}
        <input
          name="phone"
          type="tel"
          placeholder={compact ? "Phone (optional)" : undefined}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>
      <div>
        {compact ? null : <label className="text-sm font-medium">{t("form.message")}</label>}
        <textarea
          name="message"
          rows={compact ? 3 : 4}
          placeholder={compact ? "Your message..." : undefined}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          required
        />
      </div>
      <div className="flex items-start gap-2">
        <input type="checkbox" id="pdpa" name="pdpa" className="mt-1" required />
        <label htmlFor="pdpa" className="text-xs text-muted-foreground">
          {t("form.consent")}
        </label>
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : t("form.submit")}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
