"use client";

import { useState, useRef, useEffect } from "react";
import { useKeyboard } from "@/components/keyboard-provider";

type LinkItem = {
  id: string;
  name: string;
  url: string;
  clicks: number;
};

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const formRef = useRef<HTMLDivElement>(null);
  const { registerAction, unregisterAction } = useKeyboard();

  // Register keyboard actions
  useEffect(() => {
    registerAction("down", () => {
      if (editingId) return;
      setFocusedIndex((i) => Math.min(i + 1, links.length - 1));
    });
    registerAction("up", () => {
      if (editingId) return;
      setFocusedIndex((i) => Math.max(i - 1, 0));
    });
    registerAction("new", () => {
      if (editingId) return;
      setIsAdding(true);
    });
    registerAction("edit", () => {
      if (editingId) return;
      const link = links[focusedIndex];
      if (link) {
        setEditingId(link.id);
        setEditName(link.name);
        setEditUrl(link.url);
      }
    });
    registerAction("select", () => {
      if (editingId) return;
      const link = links[focusedIndex];
      if (link) {
        setEditingId(link.id);
        setEditName(link.name);
        setEditUrl(link.url);
      }
    });
    registerAction("delete", () => {
      if (editingId) return;
      const link = links[focusedIndex];
      if (link && window.confirm(`Delete "${link.name}"?`)) handleDelete(link.id);
    });
    registerAction("cancel", () => {
      setIsAdding(false);
      setEditingId(null);
      setNewName("");
      setNewUrl("");
    });

    return () => {
      unregisterAction("down");
      unregisterAction("up");
      unregisterAction("new");
      unregisterAction("edit");
      unregisterAction("select");
      unregisterAction("delete");
      unregisterAction("cancel");
    };
  }, [links, focusedIndex, editingId, registerAction, unregisterAction]);



  // Fetch links on mount
  useEffect(() => {
    fetchLinks();
  }, []);


  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links");
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (error) {
      console.error("Failed to fetch links:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsAdding(false);
        setNewName("");
        setNewUrl("");
      }
    }

    if (isAdding) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAdding]);

  const handleAdd = async () => {
    if (!newName || !newUrl) return;

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, url: newUrl }),
      });

      if (res.ok) {
        const newLink = await res.json();
        setLinks([newLink, ...links]);
        setIsAdding(false);
        setNewName("");
        setNewUrl("");
      }
    } catch (error) {
      console.error("Failed to add link:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLinks(links.filter((link) => link.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  };

  const handleEdit = async () => {
    if (!editingId || !editName || !editUrl) return;

    try {
      const res = await fetch(`/api/links/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, url: editUrl }),
      });

      if (res.ok) {
        const updated = await res.json();
        setLinks(links.map((l) => (l.id === editingId ? updated : l)));
        setEditingId(null);
      }
    } catch (error) {
      console.error("Failed to update link:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditUrl("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewName("");
      setNewUrl("");
    }
  };


  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };


  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto py-16 px-6 flex items-center justify-center">
        <span className="text-sm text-muted-foreground">loading...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto py-16 px-6 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-normal">[manage links]</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="text-xs bg-foreground text-background px-3 py-1 hover:opacity-90 transition-opacity"
        >
          + add
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {/* Add Form */}
        {isAdding && (
          <div
            ref={formRef}
            className="flex items-center justify-between p-3 border border-border bg-card/50 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <div className="flex flex-col gap-0.5 w-full max-w-[70%]">
              <input
                autoFocus
                type="text"
                placeholder="name"
                className="text-sm font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground/50 p-0"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <input
                type="text"
                placeholder="https://..."
                className="text-[10px] mono bg-transparent border-none outline-none placeholder:text-muted-foreground/50 p-0 text-muted-foreground"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button
              onClick={handleAdd}
              className="text-xs bg-foreground text-background px-3 py-1 hover:opacity-90 transition-opacity"
            >
              save
            </button>
          </div>
        )}

        {/* Empty State */}
        {links.length === 0 && !isAdding && (
          <div className="text-sm text-muted-foreground text-center py-8">
            no links yet. click + add to create one.
          </div>
        )}

        {/* Links List */}
        {links.map((link, index) => {
          const isEditing = editingId === link.id;
          
          return (
            <div
              key={link.id}
              className={`flex items-center justify-between p-3 border bg-card/50 group transition-all ${
                index === focusedIndex && !isEditing
                  ? "border-l-2 border-l-foreground border-border" 
                  : "border-border"
              }`}
            >
              {isEditing ? (
                // Edit Mode
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <input
                      autoFocus
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      className="text-sm font-medium bg-transparent border-b border-foreground outline-none w-full"
                      placeholder="name"
                    />
                    <input
                      type="text"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      className="text-[10px] text-muted-foreground mono bg-transparent border-b border-border outline-none w-full"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleEdit}
                      className="text-xs bg-foreground text-background px-2 py-1 hover:opacity-90"
                    >
                      save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">{link.name}</span>
                    <span className="text-[10px] text-muted-foreground mono truncate max-w-[200px] sm:max-w-[250px]">{link.url}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <span className="text-[10px] mono text-muted-foreground">{link.clicks} clicks</span>
                    <div className="flex gap-3 text-xs opacity-50 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingId(link.id);
                          setEditName(link.name);
                          setEditUrl(link.url);
                        }}
                        className="hover:text-foreground text-muted-foreground"
                      >
                        edit
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="hover:text-red-500 text-muted-foreground"
                      >
                        del
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

