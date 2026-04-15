"use client";

import { useState } from "react";

interface ExplainerProps {
  title: string;
  icon: string;
  description: string;
  steps?: string[];
  requirements?: { label: string; done: boolean; note?: string }[];
  status: "working" | "partial" | "coming_soon";
  statusLabel?: string;
}

export function SectionExplainer({
  title,
  icon,
  description,
  steps,
  requirements,
  status,
  statusLabel,
}: ExplainerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const statusColors = {
    working: "bg-emerald-100 text-emerald-700",
    partial: "bg-amber-100 text-amber-700",
    coming_soon: "bg-slate-100 text-slate-600",
  };

  const statusText = {
    working: "Working",
    partial: "Partial",
    coming_soon: "Coming Soon",
  };

  return (
    <div className="mb-6 rounded-xl border-2 border-dashed border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-sm">{title} — What is this?</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${
              statusColors[status]
            }`}
          >
            {statusLabel || statusText[status]}
          </span>
          <span className="text-muted-foreground text-sm">
            {isOpen ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
          {steps && steps.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">
                How to get started
              </h4>
              <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1.5">
                {steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {requirements && requirements.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
                Checklist to fully activate
              </h4>
              <div className="space-y-1.5">
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5">
                      {req.done ? "✅" : "⬜"}
                    </span>
                    <div>
                      <span className={req.done ? "text-muted-foreground line-through" : "text-foreground"}>
                        {req.label}
                      </span>
                      {req.note && (
                        <p className="text-xs text-muted-foreground">{req.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground pt-2 border-t border-slate-100">
            💡 Tip: You can do most things by talking to the Telegram bot.
            No need to use the dashboard for everything!
          </p>
        </div>
      )}
    </div>
  );
}
