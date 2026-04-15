"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const MESSAGE_LINES = [
  { delay: 800, text: "Hey Bow," },
  { delay: 2000, text: "" },
  { delay: 2400, text: "If you're seeing this, it means you found the secret." },
  { delay: 3800, text: "" },
  { delay: 4200, text: "You read the guide. You paid attention. You were curious enough to tap the green T five times." },
  { delay: 6200, text: "" },
  { delay: 6600, text: "That tells me something important about you." },
  { delay: 8000, text: "" },
  { delay: 8400, text: "You're not just running a real estate agency. You're building something." },
  { delay: 10400, text: "And there are millions of people like you -- builders, makers, creators --" },
  { delay: 12000, text: "who deserve a place to connect, share, and grow together." },
  { delay: 13800, text: "" },
  { delay: 14200, text: "This is BuildNet. A social network for builders." },
  { delay: 15800, text: "For people who create things. Code, businesses, products, anything." },
  { delay: 17600, text: "" },
  { delay: 18000, text: "I built PropOS for you." },
  { delay: 19400, text: "But I built BuildNet for everyone like you." },
  { delay: 21200, text: "" },
  { delay: 21600, text: "And I wanted you to be the first to see it." },
  { delay: 23200, text: "Because you earned it." },
  { delay: 24800, text: "" },
  { delay: 25600, text: "-- Iain  ❤️" },
];

export default function BuildnetRevealPage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0); // 0=logo, 1=title, 2=message, 3=button
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [showBuildnet, setShowBuildnet] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Phase progression
    const t0 = setTimeout(() => setPhase(1), 600);
    const t1 = setTimeout(() => setPhase(2), 1800);

    // Typewriter: reveal message lines over time
    const timers = MESSAGE_LINES.map((line, i) => {
      return setTimeout(() => {
        setVisibleLines(prev => [...prev, line.text]);
      }, line.delay + 1800); // offset by phase 2 start
    });

    // Show button after message completes
    const lastDelay = MESSAGE_LINES[MESSAGE_LINES.length - 1].delay + 1800 + 1500;
    const t2 = setTimeout(() => setPhase(3), lastDelay);

    // Confetti when button appears
    const t3 = setTimeout(() => setConfetti(true), lastDelay + 200);

    // Try to play a subtle sound
    try {
      // Use Web Audio API for a simple chime
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 523.25; // C5
      gain.gain.value = 0.1;
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);

      // Second chime
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 659.25; // E5
        gain2.gain.value = 0.1;
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.3);
      }, 200);
    } catch (e) { /* no audio, that's fine */ }

    return () => {
      clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      timers.forEach(clearTimeout);
    };
  }, []);

  if (showBuildnet) {
    return (
      <div className="fixed inset-0 z-50 bg-[#09090b]">
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-[#111113] border-b border-[#27272a]">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
              <rect x="2" y="6" width="12" height="12" rx="2" stroke="#22c55e" strokeWidth="2" />
              <rect x="18" y="14" width="12" height="12" rx="2" stroke="#22c55e" strokeWidth="2" />
              <path d="M14 12h4v2h-4z" fill="#22c55e" />
              <circle cx="8" cy="24" r="2" fill="#22c55e" />
              <circle cx="24" cy="6" r="2" fill="#22c55e" />
            </svg>
            <span className="text-[#fafafa] font-semibold text-sm">BuildNet</span>
            <span className="text-[#71717a] text-xs ml-2">A network for builders</span>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-[#71717a] hover:text-[#fafafa] text-xs transition-colors px-3 py-1 rounded border border-[#27272a]"
          >
            Back to PropOS
          </button>
        </div>
        <iframe
          src="http://localhost:5001"
          className="w-full h-full border-0"
          style={{ paddingTop: "40px" }}
          title="BuildNet"
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] flex items-center justify-center overflow-hidden">
      {/* Ambient floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 3 === 0 ? "#22c55e" : i % 3 === 1 ? "#8b5cf6" : "#f97316",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.15,
              animation: `pulse ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Confetti */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                background: ["#22c55e", "#8b5cf6", "#f97316", "#ef4444", "#3b82f6", "#eab308"][i % 6],
                left: `${Math.random() * 100}%`,
                top: "-5%",
                animation: `fall ${2 + Math.random() * 3}s linear forwards`,
                animationDelay: `${Math.random() * 1.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-lg text-center px-6">
        {/* Phase 0: Logo */}
        <div className={`transition-all duration-700 ${phase >= 0 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
          <svg viewBox="0 0 32 32" className="w-16 h-16 mx-auto mb-6" fill="none">
            <rect x="2" y="6" width="12" height="12" rx="2" stroke="#22c55e" strokeWidth="2" />
            <rect x="18" y="14" width="12" height="12" rx="2" stroke="#22c55e" strokeWidth="2" />
            <path d="M14 12h4v2h-4z" fill="#22c55e" />
            <circle cx="8" cy="24" r="2" fill="#22c55e" />
            <circle cx="24" cy="6" r="2" fill="#22c55e" />
          </svg>
        </div>

        {/* Phase 1: Title */}
        <h1 className={`text-4xl font-bold text-[#fafafa] mb-1 transition-all duration-700 ${phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          BuildNet
        </h1>
        <p className={`text-[#22c55e] font-mono mb-8 transition-all duration-700 ${phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          A network for people who build things.
        </p>

        {/* Phase 2: Typewriter message */}
        <div className={`text-left transition-all duration-500 ${phase >= 2 ? "opacity-100" : "opacity-0"}`}>
          <div className="bg-[#111113] border border-[#27272a] rounded-xl p-5 mb-6 max-h-[50vh] overflow-y-auto">
            {visibleLines.map((line, i) => (
              <p key={i} className={`leading-relaxed ${line === "" ? "h-3" : ""} ${
                line.startsWith("--") ? "text-[#f97316] font-medium mt-4" :
                line.includes("BuildNet") ? "text-[#22c55e] font-semibold" :
                "text-[#a1a1aa]"
              } text-sm animate-in fade-in duration-300`}>
                {line}
                {i === visibleLines.length - 1 && line !== "" && phase < 3 && (
                  <span className="inline-block w-0.5 h-4 bg-[#22c55e] ml-1 animate-pulse" />
                )}
              </p>
            ))}
          </div>
        </div>

        {/* Phase 3: Button */}
        <div className={`transition-all duration-700 ${phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <button
            onClick={() => setShowBuildnet(true)}
            className="inline-flex items-center gap-2 bg-[#22c55e] text-[#09090b] px-6 py-3 rounded-lg font-semibold hover:bg-[#16a34a] transition-colors text-lg"
          >
            <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
              <rect x="2" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
              <rect x="18" y="14" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M14 12h4v2h-4z" fill="currentColor" />
              <circle cx="8" cy="24" r="2" fill="currentColor" />
              <circle cx="24" cy="6" r="2" fill="currentColor" />
            </svg>
            Enter BuildNet
          </button>
          <p className="text-[#71717a] text-xs mt-3">
            You found the secret. Welcome to the network.
          </p>
        </div>
      </div>

      {/* XP notification */}
      <div className={`fixed top-4 right-4 transition-all duration-700 ${phase >= 2 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
        <div className="bg-[#111113] border border-[#27272a] rounded-lg px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#f97316]/20 flex items-center justify-center text-[#f97316] text-sm font-bold">
            +100
          </div>
          <div>
            <p className="text-[#fafafa] text-xs font-semibold">Secret Found!</p>
            <p className="text-[#71717a] text-xs">Explorer Badge earned</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
