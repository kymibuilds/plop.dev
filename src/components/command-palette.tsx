"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useKeyboard } from "./keyboard-provider";

interface Command {
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const { showCommandPalette, setShowCommandPalette } = useKeyboard();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    { id: "home", label: "Go to Home", shortcut: "g h", action: () => router.push("/") },
    { id: "links", label: "Go to Links", shortcut: "g l", action: () => router.push("/links") },
    { id: "blogs", label: "Go to Blogs", shortcut: "g b", action: () => router.push("/blogs") },
    { id: "analytics", label: "Go to Analytics", shortcut: "g a", action: () => router.push("/analytics") },
    { id: "help", label: "Show Keyboard Shortcuts", shortcut: "?", action: () => {} },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (showCommandPalette) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [showCommandPalette]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
      case "j":
        if (e.ctrlKey || e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
        }
        break;
      case "ArrowUp":
      case "k":
        if (e.ctrlKey || e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
        }
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          setShowCommandPalette(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowCommandPalette(false);
        break;
    }
  };

  if (!showCommandPalette) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setShowCommandPalette(false)}
      />

      {/* Palette */}
      <div className="relative w-full max-w-md border border-border bg-background shadow-lg">
        {/* Input */}
        <div className="border-b border-border p-3">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground mono"
          />
        </div>

        {/* Results */}
        <div className="max-h-64 overflow-auto">
          {filtered.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground">No commands found</div>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                onClick={() => {
                  cmd.action();
                  setShowCommandPalette(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors ${
                  i === selectedIndex
                    ? "bg-foreground text-background"
                    : "hover:bg-muted"
                }`}
              >
                <span>{cmd.label}</span>
                {cmd.shortcut && (
                  <span className="mono text-xs opacity-60">{cmd.shortcut}</span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-3 py-2 text-[10px] mono text-muted-foreground flex gap-4">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
