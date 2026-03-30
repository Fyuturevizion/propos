"use client";
import { useChat } from "@ai-sdk/react";
import { MessageCircle, X, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

export function ChatWidget() {
  const t = useTranslations("chat");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    id: "propos-chat",
  });

  const isLoading = status === "streaming" || status === "submitted";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ role: "user", parts: [{ type: "text", text: input }] });
    setInput("");
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition hover:bg-emerald-500"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col rounded-2xl border bg-background shadow-2xl">
          <div className="flex items-center gap-2 rounded-t-2xl border-b bg-emerald-600 px-4 py-3 text-white">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold">{t("title")}</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {/* Greeting */}
            {messages.length === 0 && (
              <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm">
                {t("greeting")}
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "ml-auto bg-emerald-600 text-white"
                    : "bg-muted"
                }`}
              >
                {msg.parts
                  .filter((p) => p.type === "text")
                  .map((p, i) => (
                    <span key={i}>{p.text}</span>
                  ))}
              </div>
            ))}
            {isLoading && (
              <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm">
                <span className="animate-pulse">Thinking...</span>
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="flex gap-2 border-t p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
