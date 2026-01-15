"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MarkdownEditor } from "./markdown-editor";
import { MarkdownPreview } from "./markdown-preview";

interface BlogEditorProps {
  blogId: string;
  initialTitle: string;
  initialContent: string;
  onSave: (title: string, content: string) => Promise<void>;
  onClose: () => void;
}

export function BlogEditor({
  blogId,
  initialTitle,
  initialContent,
  onSave,
  onClose,
}: BlogEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Resizable split state
  const [splitPercent, setSplitPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track changes
  useEffect(() => {
    const changed = title !== initialTitle || content !== initialContent;
    setHasChanges(changed);
  }, [title, content, initialTitle, initialContent]);

  // Auto-save to localStorage
  useEffect(() => {
    if (hasChanges) {
      const draft = { title, content, savedAt: Date.now() };
      localStorage.setItem(`blog-draft-${blogId}`, JSON.stringify(draft));
    }
  }, [title, content, blogId, hasChanges]);

  // Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(`blog-draft-${blogId}`);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.content && draft.savedAt) {
          const useDraft = window.confirm(
            "You have an unsaved draft. Would you like to restore it?"
          );
          if (useDraft) {
            setTitle(draft.title || initialTitle);
            setContent(draft.content);
          } else {
            localStorage.removeItem(`blog-draft-${blogId}`);
          }
        }
      } catch {
        localStorage.removeItem(`blog-draft-${blogId}`);
      }
    }
  }, [blogId, initialTitle]);

  // Handle resize drag
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      // Clamp between 20% and 80%
      setSplitPercent(Math.max(20, Math.min(80, percent)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave(title, content);
      localStorage.removeItem(`blog-draft-${blogId}`);
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  }, [title, content, blogId, onSave]);

  const handleClose = () => {
    if (hasChanges) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Your draft will be saved locally. Close anyway?"
      );
      if (!confirmClose) return;
    }
    onClose();
  };

  return (
    <div className={`fixed inset-0 bg-background z-50 flex flex-col ${isDragging ? "cursor-col-resize select-none" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={handleClose}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← back
          </button>
          <span className="text-xs mono text-muted-foreground">
            {hasChanges ? "unsaved changes" : "saved"}
          </span>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="text-xs bg-foreground text-background px-4 py-1.5 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSaving ? "saving..." : "save"}
        </button>
      </div>

      {/* Title Input */}
      <div className="px-6 py-4 border-b border-border">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title..."
          className="w-full text-2xl font-medium bg-transparent outline-none placeholder:text-muted-foreground/50"
        />
      </div>

      {/* Side-by-side Editor and Preview */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden">
        {/* Editor Pane */}
        <div 
          className="h-full overflow-hidden"
          style={{ width: `${splitPercent}%` }}
        >
          <div className="h-full p-4 flex flex-col">
            <div className="text-[10px] mono text-muted-foreground mb-2 px-1">write</div>
            <div className="flex-1 overflow-auto">
              <MarkdownEditor
                value={content}
                onChange={setContent}
                placeholder="Start writing in markdown..."
                minHeight="100%"
              />
            </div>
          </div>
        </div>

        {/* Resizable Divider */}
        <div
          className="w-1 bg-border hover:bg-foreground/20 cursor-col-resize transition-colors flex-shrink-0 relative group"
          onMouseDown={() => setIsDragging(true)}
        >
          <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-foreground/10" />
        </div>

        {/* Preview Pane */}
        <div 
          className="h-full overflow-hidden"
          style={{ width: `${100 - splitPercent}%` }}
        >
          <div className="h-full p-4 flex flex-col">
            <div className="text-[10px] mono text-muted-foreground mb-2 px-1">preview</div>
            <div className="flex-1 overflow-auto border border-border bg-card/30 p-6">
              <div className="max-w-2xl">
                <h1 className="text-2xl font-medium mb-6">{title || "Untitled"}</h1>
                <MarkdownPreview content={content} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

