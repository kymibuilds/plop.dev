"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type KeyboardMode = "normal" | "command" | "g-prefix";

interface KeyboardContextType {
  mode: KeyboardMode;
  setMode: (mode: KeyboardMode) => void;
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
  showCommandPalette: boolean;
  setShowCommandPalette: (show: boolean) => void;
  registerAction: (key: string, action: () => void) => void;
  unregisterAction: (key: string) => void;
}

const KeyboardContext = createContext<KeyboardContextType | null>(null);

export function useKeyboard() {
  const ctx = useContext(KeyboardContext);
  if (!ctx) throw new Error("useKeyboard must be used within KeyboardProvider");
  return ctx;
}

interface KeyboardProviderProps {
  children: ReactNode;
}

export function KeyboardProvider({ children }: KeyboardProviderProps) {
  const router = useRouter();
  const [mode, setMode] = useState<KeyboardMode>("normal");
  const [showHelp, setShowHelp] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [customActions, setCustomActions] = useState<Record<string, () => void>>({});

  const registerAction = useCallback((key: string, action: () => void) => {
    setCustomActions((prev) => ({ ...prev, [key]: action }));
  }, []);

  const unregisterAction = useCallback((key: string) => {
    setCustomActions((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || 
                      target.tagName === "TEXTAREA" || 
                      target.isContentEditable;

      // Always allow Escape
      if (e.key === "Escape") {
        setMode("normal");
        setShowHelp(false);
        setShowCommandPalette(false);
        customActions["cancel"]?.();
        return;
      }

      // Don't intercept when typing in inputs (except for specific combos)
      if (isInput) {
        // Allow Ctrl+S for save
        if (e.ctrlKey && e.key === "s") {
          e.preventDefault();
          customActions["save"]?.();
        }
        return;
      }

      // Prevent default for our shortcuts
      const preventAndHandle = (action: () => void) => {
        e.preventDefault();
        action();
      };

      // Handle g-prefix mode (navigation)
      if (mode === "g-prefix") {
        setMode("normal");
        switch (e.key.toLowerCase()) {
          case "h": preventAndHandle(() => router.push("/")); break;
          case "l": preventAndHandle(() => router.push("/links")); break;
          case "b": preventAndHandle(() => router.push("/blogs")); break;
          case "a": preventAndHandle(() => router.push("/analytics")); break;
        }
        return;
      }

      // Normal mode shortcuts
      switch (e.key) {
        case "g":
          preventAndHandle(() => setMode("g-prefix"));
          break;
        case "?":
          preventAndHandle(() => setShowHelp(true));
          break;
        case ":":
        case "/":
          preventAndHandle(() => setShowCommandPalette(true));
          break;
        case "j":
          preventAndHandle(() => customActions["down"]?.());
          break;
        case "k":
          preventAndHandle(() => customActions["up"]?.());
          break;
        case "Enter":
          preventAndHandle(() => customActions["select"]?.());
          break;
        case "n":
        case "a":
          preventAndHandle(() => customActions["new"]?.());
          break;
        case "e":
          preventAndHandle(() => customActions["edit"]?.());
          break;
        case "d":
          preventAndHandle(() => customActions["delete"]?.());
          break;
        case "p":
          preventAndHandle(() => customActions["p"]?.());
          break;
        case "u":
          preventAndHandle(() => customActions["u"]?.());
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, router, customActions]);

  // Reset g-prefix after timeout
  useEffect(() => {
    if (mode === "g-prefix") {
      const timeout = setTimeout(() => setMode("normal"), 1500);
      return () => clearTimeout(timeout);
    }
  }, [mode]);

  return (
    <KeyboardContext.Provider
      value={{
        mode,
        setMode,
        showHelp,
        setShowHelp,
        showCommandPalette,
        setShowCommandPalette,
        registerAction,
        unregisterAction,
      }}
    >
      {children}
      
      {/* Mode indicator */}
      {mode === "g-prefix" && (
        <div className="fixed bottom-4 left-4 px-3 py-1.5 bg-foreground text-background text-xs mono z-50">
          g-
        </div>
      )}
    </KeyboardContext.Provider>
  );
}
