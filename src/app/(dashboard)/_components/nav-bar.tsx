"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen border-r px-6 py-6 flex flex-col gap-8 bg-background">
      {/* Brand */}
      <div className="text-sm font-medium tracking-tight">nyahh.sproink.dev</div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3 text-sm">
        <Link href="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link href="/links" className="hover:underline">
          Links
        </Link>
        <Link href="/products" className="hover:underline">
          Products
        </Link>
        <Link href="/sponsors" className="hover:underline">
          Sponsors
        </Link>
      </nav>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between text-sm">
        <span>© {new Date().getFullYear()}</span>
        <button onClick={handleLogout} className="hover:underline">
          Logout
        </button>
      </div>
    </aside>
  );
}
