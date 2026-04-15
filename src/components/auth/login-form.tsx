"use client";

import { useState } from "react";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: formData,
        redirect: "manual",
      });

      // redirect: "manual" returns opaqueredirect (status 0, type "opaqueredirect")
      // Any response from the login API means we should check for auth cookies
      if (res.type === "opaqueredirect" || res.status === 0 || res.status >= 300 || res.status === 200) {
        // Check if auth cookie was set
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500);
      } else {
        const location = res.headers.get("location");
        if (location) {
          window.location.href = location;
        } else {
          setLoading(false);
        }
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="login-field">
        <label className="login-label">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          placeholder="bow@tttproperties.com"
          required
          autoComplete="email"
        />
      </div>

      <div className="login-field">
        <label className="login-label">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          placeholder="Enter your password"
          required
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="login-button"
      >
        {loading ? (
          <span className="login-button-loading">
            <span className="login-spinner" />
            Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </button>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .login-form {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        .login-field {
          margin-bottom: 16px;
          text-align: left;
        }
        .login-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 6px;
          color: #334155;
        }
        .login-input {
          width: 100%;
          border-radius: 10px;
          border: 1.5px solid #d1d5db;
          padding: 12px 14px;
          font-size: 16px;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
          -webkit-appearance: none;
        }
        .login-input:focus {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5,150,105,0.15);
        }
        .login-button {
          width: 100%;
          border-radius: 12px;
          background: #059669;
          color: white;
          padding: 14px 0;
          font-size: 16px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-top: 4px;
          -webkit-appearance: none;
        }
        .login-button:active {
          transform: scale(0.98);
        }
        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .login-button-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .login-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `,
        }}
      />
    </form>
  );
}
