"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "20px", fontFamily: "system-ui" }}>
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#059669", fontSize: "28px", fontWeight: "bold" }}>
              T
            </div>
            <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>Something went wrong</h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "16px" }}>Please try refreshing the page.</p>
            <button
              onClick={reset}
              style={{ background: "#059669", color: "white", border: "none", borderRadius: "12px", padding: "10px 20px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
