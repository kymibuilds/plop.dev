"use client";

import { useKeyboard } from "./keyboard-provider";

const shortcuts = [
  { category: "Navigation", prefix: "g +", items: [
    { keys: ["h"], desc: "Home" },
    { keys: ["l"], desc: "Links" },
    { keys: ["b"], desc: "Blogs" },
    { keys: ["p"], desc: "Products" },
    { keys: ["a"], desc: "Analytics" },
    { keys: ["s"], desc: "Sponsors" },
    { keys: ["i"], desc: "Integrations" },
  ]},
  { category: "Command", items: [
    { keys: [":"], desc: "Command palette" },
    { keys: ["/"], desc: "Search" },
    { keys: ["Esc"], desc: "Close / Cancel" },
  ]},
  { category: "Lists", items: [
    { keys: ["j"], desc: "Move down" },
    { keys: ["k"], desc: "Move up" },
    { keys: ["↵"], desc: "Open / Select" },
    { keys: ["a", "n"], desc: "New" },
    { keys: ["e"], desc: "Edit" },
    { keys: ["d"], desc: "Delete" },
  ]},
  { category: "Editor", items: [
    { keys: ["Ctrl", "S"], desc: "Save" },
    { keys: ["Esc"], desc: "Close" },
  ]},
];

function Key({ children }: { children: string }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[1.75rem] h-7 px-2 mono text-xs bg-muted border border-border rounded-sm shadow-[0_1px_0_1px_var(--border)]">
      {children}
    </kbd>
  );
}

export function KeyboardHelp() {
  const { showHelp, setShowHelp } = useKeyboard();

  if (!showHelp) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-sm"
        onClick={() => setShowHelp(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 border border-border bg-background animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-sm font-medium tracking-wide">[keyboard shortcuts]</h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>press</span>
            <Key>Esc</Key>
            <span>to close</span>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-2 gap-px bg-border">
          {shortcuts.map((section) => (
            <div key={section.category} className="bg-background p-5">
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                  {section.category}
                </span>
                {section.prefix && (
                  <span className="text-[10px] mono text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded-sm">
                    {section.prefix}
                  </span>
                )}
              </div>

              {/* Shortcuts */}
              <div className="space-y-2">
                {section.items.map((item) => (
                  <div
                    key={item.desc}
                    className="flex items-center justify-between group"
                  >
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                      {item.desc}
                    </span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((key, i) => (
                        <span key={key} className="flex items-center gap-1">
                          <Key>{key}</Key>
                          {i < item.keys.length - 1 && (
                            <span className="text-muted-foreground/40 text-xs">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground mono">
            vim-style navigation
          </span>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <Key>?</Key>
            <span>show this guide</span>
          </div>
        </div>
      </div>
    </div>
  );
}

