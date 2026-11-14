"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notConfigured = searchParams.get("error") === "not-configured";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        setError(data.error || "Invalid username or password.");
        setLoading(false);
        return;
      }
      router.push("/admin/orders/");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-card p-8 shadow-card">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-gold" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-charcoal mb-1">Admin Login</h1>
          <p className="font-body text-sm text-warm-gray">ZAMÉ Fashion order management</p>
        </div>

        {notConfigured && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-input px-4 py-3 mb-4 font-body text-sm">
            Admin access is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD and ADMIN_SESSION_SECRET in your environment variables.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-body text-sm font-medium text-charcoal mb-1.5">Username</label>
            <input
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-cream border border-champagne rounded-input font-body text-sm focus:outline-none focus:border-gold"
              placeholder="Admin username"
            />
          </div>
          <div>
            <label className="block font-body text-sm font-medium text-charcoal mb-1.5">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-cream border border-champagne rounded-input font-body text-sm focus:outline-none focus:border-gold"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="font-body text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gold text-white rounded-pill font-body text-sm font-medium hover:bg-gold-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-champagne border-t-gold rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
