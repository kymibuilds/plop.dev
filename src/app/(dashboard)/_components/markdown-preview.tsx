"use client";

import { useMemo } from "react";
import { marked } from "marked";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className = "" }: MarkdownPreviewProps) {
  const html = useMemo(() => {
    if (!content) return "";
    
    // Configure marked for security
    marked.setOptions({
      gfm: true,
      breaks: true,
    });

    return marked.parse(content) as string;
  }, [content]);

  if (!content) {
    return (
      <div className={`text-sm text-muted-foreground italic ${className}`}>
        Preview will appear here...
      </div>
    );
  }

  return (
    <div
      className={`prose-custom ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
