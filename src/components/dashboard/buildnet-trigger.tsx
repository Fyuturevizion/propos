"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const REQUIRED_TAPS = 5;
const TAP_WINDOW_MS = 2000; // must tap 5x within 2 seconds

export function BuildnetTrigger() {
  const [revealed, setRevealed] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const [cracking, setCracking] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const discovered = localStorage.getItem("buildnet_discovered");
    if (discovered === "true") {
      setRevealed(true);
    }
  }, []);

  const handleLogoTap = () => {
    const now = Date.now();

    // Reset if too slow
    if (now - lastTap > TAP_WINDOW_MS) {
      setTapCount(1);
    } else {
      const next = tapCount + 1;
      setTapCount(next);

      if (next >= REQUIRED_TAPS) {
        // TRIGGERED!
        setCracking(true);
        localStorage.setItem("buildnet_discovered", "true");

        // After crack animation, reveal
        setTimeout(() => {
          setRevealed(true);
          setCracking(false);
        }, 800);
        return;
      }
    }

    setLastTap(now);
  };

  // Already discovered -- show the permanent entry point
  if (revealed) {
    return (
      <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
              <rect x="2" y="6" width="12" height="12" rx="2" stroke="white" strokeWidth="2" />
              <rect x="18" y="14" width="12" height="12" rx="2" stroke="white" strokeWidth="2" />
              <path d="M14 12h4v2h-4z" fill="white" />
              <circle cx="8" cy="24" r="2" fill="white" />
              <circle cx="24" cy="6" r="2" fill="white" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-emerald-800">BuildNet</h2>
            <p className="text-xs text-emerald-600">A network for builders</p>
          </div>
        </div>
        <p className="text-sm text-emerald-700 mb-4">
          You found the secret! Welcome to the network.
        </p>
        <button
          onClick={() => router.push("/dashboard/buildnet")}
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          Open BuildNet
          <span className="text-emerald-200">{"->"}</span>
        </button>
      </div>
    );
  }

  // Cracking animation state
  if (cracking) {
    return (
      <div className="rounded-xl border bg-white p-6 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center animate-pulse">
            <span className="text-white text-sm font-bold">T</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-700">Something is happening...</p>
            <p className="text-xs text-emerald-500 animate-pulse">Unlocking secret...</p>
          </div>
        </div>
        {/* Green particles flying out */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-emerald-400"
              style={{
                left: "40%",
                top: "40%",
                animation: `ping 0.8s ease-out forwards`,
                transform: `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px)`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default: show the About section (looks innocent)
  // Tap progress shown subtly after 2+ taps
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={handleLogoTap}
          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white text-sm font-bold transition-all cursor-default select-none ${
            tapCount > 0 ? "scale-105" : ""
          }`}
          title="TTT Properties"
        >
          T
        </button>
        <div>
          <h2 className="font-semibold">About</h2>
        </div>
      </div>
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">PropOS Version</span>
          <span className="font-medium text-muted-foreground">0.1.0-beta</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Framework</span>
          <span className="font-medium text-muted-foreground">Next.js + Supabase</span>
        </div>
      </div>

      {/* Subtle tap progress -- only shows after they start tapping */}
      {tapCount > 0 && tapCount < REQUIRED_TAPS && (
        <div className="mt-3 pt-3 border-t">
          <div className="flex gap-1">
            {Array.from({ length: REQUIRED_TAPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-200 ${
                  i < tapCount ? "bg-emerald-400" : "bg-slate-100"
                }`}
              />
            ))}
          </div>
          <p className="text-[10px] text-emerald-500 mt-1">
            {tapCount}/{REQUIRED_TAPS}
          </p>
        </div>
      )}
    </div>
  );
}
