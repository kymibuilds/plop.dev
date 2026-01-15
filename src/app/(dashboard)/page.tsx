"use client";
import { FeatureConfig, ToggleBar } from "./_components/toggle-bar";
import { useState } from "react";

export default function MyPage() {
  const [features, setFeatures] = useState<FeatureConfig>({
    links: true,
    blogs: false,
    products: false,
  });
  return (
    <main className="w-full min-h-screen flex justify-center px-6 py-16">
      <div className="w-full max-w-md fixed top-4">
        <ToggleBar value={features} onChange={setFeatures} />
      </div>
      
      <div className="w-full max-w-md flex flex-col gap-10 text-sm">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-normal">[nyahh]</h1>
        </div>

        {/* Divider */}
        <div className="mono text-xs text-muted-foreground">
          ────────────────────────
        </div>

        {/* Links */}
        <section className="flex flex-col gap-2">
          <h2 className="mono text-xs text-muted-foreground">［ links ］</h2>

          <div className="flex flex-col gap-1">
            <a className="hover:underline">portfolio</a>
            <a className="hover:underline">x</a>
            <a className="hover:underline">twitter</a>
            <a className="hover:underline">linkedin</a>
            <a className="hover:underline">codeforces</a>
            <a className="hover:underline">leetcode</a>
          </div>
        </section>

        {/* Writing */}
        <section className="flex flex-col gap-2">
          <h2 className="mono text-xs text-muted-foreground">［ blogs ］</h2>

          <div className="flex flex-col gap-1">
            <a className="hover:underline">
              building a minimal saas with next.js
            </a>
            <a className="hover:underline">why text-first uis scale better</a>
            <a className="hover:underline">auth patterns that don’t suck</a>
          </div>
        </section>

        {/* Products */}
        <section className="flex flex-col gap-2">
          <h2 className="mono text-xs text-muted-foreground">［ products ］</h2>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span>minimal saas starter</span>
              <span className="mono">$19</span>
            </div>

            <div className="flex items-center justify-between">
              <span>auth + payments boilerplate</span>
              <span className="mono">$29</span>
            </div>

            <div className="flex items-center justify-between">
              <span>next.js dashboard kit</span>
              <span className="mono">free</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mono text-xs text-muted-foreground pt-6">
          sproink.dev/nyahh
        </div>
      </div>
    </main>
  );
}
