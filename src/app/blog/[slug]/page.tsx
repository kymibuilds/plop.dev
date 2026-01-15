"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MarkdownPreview } from "../../(dashboard)/_components/markdown-preview";

type Blog = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  views: number;
  createdAt: string;
};

export default function BlogPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/blogs/slug/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Blog not found");
        return res.json();
      })
      .then((data) => setBlog(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center">
        <span className="text-sm text-muted-foreground mono">loading...</span>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-lg font-medium">[404]</h1>
        <p className="text-sm text-muted-foreground">blog post not found</p>
        <a href="/" className="text-sm hover:underline">← back home</a>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen px-6 py-16">
      <article className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← back
          </a>
          <h1 className="text-2xl font-medium mb-2">{blog.title}</h1>
          <div className="flex items-center gap-3 text-xs mono text-muted-foreground">
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{blog.views} views</span>
          </div>
        </header>

        {/* Content */}
        <div className="border-t border-border pt-8">
          <MarkdownPreview content={blog.content || ""} />
        </div>
      </article>
    </main>
  );
}
