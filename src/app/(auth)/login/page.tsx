"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { CenteredLayout } from "@/components/centered-layout";

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        setError(text || "invalid credentials");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CenteredLayout>
      <div className="w-full max-w-md flex flex-col gap-6 text-sm">
        {/* title */}
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-lg font-medium">
            sign in
          </h1>
          <p className="text-xs text-muted-foreground">
            welcome back to sproink
          </p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* identifier */}
          <div className="flex items-center gap-2">
            <span className="w-24 text-muted-foreground">
              email / username
            </span>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com"
              required
              className="flex-1 bg-transparent outline-none border-b border-border focus:border-foreground"
            />
          </div>

          {/* password */}
          <div className="flex items-center gap-2">
            <span className="w-24 text-muted-foreground">
              password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="flex-1 bg-transparent outline-none border-b border-border focus:border-foreground"
            />
          </div>

          {error && (
            <p className="text-xs text-destructive">
              {error}
            </p>
          )}

          {/* submit */}
          <button
            type="submit"
            disabled={loading}
            className="text-left hover:underline disabled:opacity-50"
          >
            {loading ? "signing in…" : "sign in"}
          </button>
        </form>

        {/* footer */}
        <p className="text-xs text-muted-foreground text-center">
          don&apos;t have an account?{" "}
          <Link href="/signup" className="hover:underline">
            sign up
          </Link>
        </p>
      </div>
    </CenteredLayout>
  );
}
