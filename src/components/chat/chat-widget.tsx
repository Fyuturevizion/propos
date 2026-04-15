"use client";

import { useChat } from "@ai-sdk/react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { useState, useEffect, useRef, useCallback, type FormEvent } from "react";

/* ------------------------------------------------------------------ */
/*  Exported hook so parents (e.g. mobile bottom nav) can control it  */
/* ------------------------------------------------------------------ */
let _setOpenExternal: ((v: boolean) => void) | null = null;

/** Call from anywhere to open / close the chat widget. */
export function setChatOpen(v: boolean) {
  _setOpenExternal?.(v);
}

/* ------------------------------------------------------------------ */
/*  ChatWidget                                                        */
/* ------------------------------------------------------------------ */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // expose setter so `setChatOpen` works from outside
  useEffect(() => {
    _setOpenExternal = setOpen;
    return () => {
      _setOpenExternal = null;
    };
  }, []);

  const { messages, sendMessage, status } = useChat({
    id: "propos-chat",
  });

  const isLoading = status === "streaming" || status === "submitted";

  // auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ role: "user", parts: [{ type: "text", text: input }] });
    setInput("");
  };

  return (
    <>
      {/* Floating bubble — hidden on mobile (<lg) since bottom nav has chat tab */}
      <button
        onClick={toggle}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 hidden lg:flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <span className="relative flex h-6 w-6 items-center justify-center">
            {/* pulse ring */}
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-40" />
            <MessageCircle className="relative h-6 w-6" />
          </span>
        )}
      </button>

      {/* ---------- Chat panel ---------- */}
      {open && (
        <>
          {/* Mobile full-screen backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
          />

          <div
            className={
              /* mobile: full-screen overlay  |  desktop: floating panel */
              [
                "fixed z-50 flex flex-col bg-background",
                /* mobile */
                "inset-0 lg:inset-auto",
                /* desktop */
                "lg:bottom-24 lg:right-6 lg:h-[560px] lg:w-[420px] lg:rounded-2xl lg:border lg:shadow-2xl",
              ].join(" ")
            }
          >
            {/* ---- Header ---- */}
            <div className="flex items-center justify-between rounded-t-2xl border-b bg-emerald-600 px-4 py-3 text-white lg:rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold">PropOS Agent</span>
                  <span className="text-[10px] font-normal opacity-70">
                    Powered by Hermes
                  </span>
                </div>
              </div>
              {/* close button always visible on mobile header, optional on desktop */}
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 transition hover:bg-emerald-500"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ---- Messages ---- */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {/* Greeting */}
              {messages.length === 0 && (
                <div className="flex items-start gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm">
                    Hi! I&apos;m your PropOS assistant. Ask me about properties, leads, or anything else. สวัสดี!
                  </div>
                </div>
              )}

              {messages.map((msg) =>
                msg.role === "user" ? (
                  <div
                    key={msg.id}
                    className="ml-auto max-w-[85%] rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white"
                  >
                    {msg.parts
                      .filter((p) => p.type === "text")
                      .map((p, i) => (
                        <span key={i}>{p.text}</span>
                      ))}
                  </div>
                ) : (
                  <div key={msg.id} className="flex items-start gap-2">
                    {/* AI avatar */}
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm">
                      {msg.parts
                        .filter((p) => p.type === "text")
                        .map((p, i) => (
                          <span key={i}>{p.text}</span>
                        ))}
                    </div>
                  </div>
                ),
              )}

              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ---- Input ---- */}
            <form onSubmit={onSubmit} className="flex gap-2 border-t p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about properties, leads, viewings..."
                className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
