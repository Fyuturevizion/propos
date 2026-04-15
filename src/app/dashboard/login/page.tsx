import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; tg?: string }>;
}) {
  const { error, tg } = await searchParams;

  // Check for TG auto-login cookie (skip redirect if DB is down)
  let hasTgAuth = false;
  try {
    const cookieStore = await cookies();
    const tgUserId = cookieStore.get("tg-auth-user-id")?.value;
    if (tgUserId) {
      hasTgAuth = true;
    }
  } catch {
    // Cookie check failed, show login form
  }

  return (
    <div className="standalone-login">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">T</div>
          <h1 className="login-title">TTT Properties</h1>
          <p className="login-subtitle">
            {tg ? "Welcome back! Sign in to continue." : "Admin Dashboard"}
          </p>
        </div>

        {/* TG auto-login hint */}
        {tg && (
          <div className="login-tg-hint">
            <span className="login-tg-icon">📱</span>
            <span>Opened from Telegram — use email login below</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="login-error">
            {error === "missing_params" && "Missing login information."}
            {error === "invalid_auth" && "Invalid authentication. Please try again."}
            {error === "expired" && "Login link expired. Please request a new one."}
            {error === "no_account" && "No account found. Contact admin."}
            {!["missing_params", "invalid_auth", "expired", "no_account"].includes(error) &&
              decodeURIComponent(error)}
          </div>
        )}

        {/* Login Form */}
        <LoginForm />

        {/* Footer */}
        <p className="login-footer">
          PropOS by TTT Properties · Powered by Hermes
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .standalone-login {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #ecfdf5 100%);
          padding: 20px;
          overscroll-behavior: none;
          -webkit-overflow-scrolling: touch;
        }
        .login-card {
          width: 100%;
          max-width: 380px;
          text-align: center;
        }
        .login-logo {
          margin-bottom: 32px;
        }
        .login-logo-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          border-radius: 18px;
          background: #059669;
          color: white;
          font-size: 28px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 32px rgba(5,150,105,0.3);
        }
        .login-title {
          font-size: 26px;
          font-weight: bold;
          margin: 0;
          color: #0f172a;
        }
        .login-subtitle {
          margin-top: 4px;
          font-size: 14px;
          color: #64748b;
        }
        .login-tg-hint {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 13px;
          color: #065f46;
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
        }
        .login-tg-icon {
          font-size: 18px;
        }
        .login-error {
          font-size: 14px;
          color: #dc2626;
          background: #fef2f2;
          border-radius: 12px;
          padding: 10px 16px;
          margin-bottom: 20px;
          border: 1px solid #fecaca;
        }
        .login-footer {
          margin-top: 32px;
          font-size: 12px;
          color: #94a3b8;
        }
      `,
        }}
      />
    </div>
  );
}
