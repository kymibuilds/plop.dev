"use client";

import { useState, useRef, useEffect } from "react";
import { BlogEditor } from "../_components/blog-editor";

type Blog = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  published: boolean;
  views: number;
  isExternal: boolean;
  externalUrl: string | null;
  createdAt: string;
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [addMode, setAddMode] = useState<"post" | "link">("post");
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newExternalUrl, setNewExternalUrl] = useState("");
  
  const formRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsAdding(false);
        resetForm();
      }
    }

    if (isAdding) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAdding]);

  const resetForm = () => {
    setNewTitle("");
    setNewSlug("");
    setNewDescription("");
    setNewExternalUrl("");
  };

  // Auto-generate slug from title (only for posts)
  useEffect(() => {
    if (isAdding && addMode === "post" && newTitle) {
      const slug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setNewSlug(slug);
    }
  }, [newTitle, isAdding, addMode]);

  const handleAddStart = (mode: "post" | "link") => {
    setAddMode(mode);
    setIsAdding(true);
    resetForm();
  };

  const handleAdd = async () => {
    if (!newTitle) return;
    if (addMode === "post" && !newSlug) return;
    if (addMode === "link" && !newExternalUrl) return;

    // For links, generate a dummy slug if needed, or backend can handle it.
    // We'll use a random slug for links to satisfy the constraint if needed, 
    // or the backend logic we just wrote requires slug. 
    // Let's generate a slug for links too for consistency in the DB.
    const effectiveSlug = addMode === "link" 
      ? `link-${crypto.randomUUID().slice(0, 8)}` 
      : newSlug;

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          slug: effectiveSlug,
          description: newDescription || null,
          isExternal: addMode === "link",
          externalUrl: addMode === "link" ? newExternalUrl : null,
        }),
      });

      if (res.ok) {
        const newBlog = await res.json();
        setBlogs([newBlog, ...blogs]);
        setIsAdding(false);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to create blog:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBlogs(blogs.filter((b) => b.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  };

  const handleTogglePublish = async (id: string, currentPublished: boolean) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentPublished }),
      });

      if (res.ok) {
        const updated = await res.json();
        setBlogs(blogs.map((b) => (b.id === id ? updated : b)));
      }
    } catch (error) {
      console.error("Failed to update blog:", error);
    }
  };

  const handleSaveBlog = async (title: string, content: string) => {
    if (!editingBlog) return;

    const res = await fetch(`/api/blogs/${editingBlog.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      const updated = await res.json();
      setBlogs(blogs.map((b) => (b.id === editingBlog.id ? updated : b)));
    } else {
      throw new Error("Failed to save");
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
        <h1 className="text-lg font-normal">[manage posts]</h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleAddStart("post")}
            className="text-xs bg-foreground text-background px-3 py-1 hover:opacity-90 transition-opacity"
          >
            + write
          </button>
          <button
            onClick={() => handleAddStart("link")}
            className="text-xs border border-input hover:bg-accent hover:text-accent-foreground px-3 py-1 transition-colors"
          >
            + link
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Add Form */}
        {isAdding && (
          <div
            ref={formRef}
            className="flex flex-col gap-3 p-4 border border-border bg-card/50 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <div className="flex flex-col gap-2">
              <input
                autoFocus
                type="text"
                placeholder={addMode === "post" ? "post title" : "link title"}
                className="text-sm font-medium bg-transparent border-b border-border outline-none placeholder:text-muted-foreground/50 pb-1"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              
              {addMode === "post" ? (
                <input
                  type="text"
                  placeholder="slug-url"
                  className="text-xs mono bg-transparent border-b border-border outline-none placeholder:text-muted-foreground/50 pb-1 text-muted-foreground"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  placeholder="https://external-site.com/article"
                  className="text-xs mono bg-transparent border-b border-border outline-none placeholder:text-muted-foreground/50 pb-1 text-muted-foreground"
                  value={newExternalUrl}
                  onChange={(e) => setNewExternalUrl(e.target.value)}
                />
              )}

              <textarea
                placeholder="short description..."
                rows={2}
                className="text-xs bg-transparent border-b border-border outline-none placeholder:text-muted-foreground/50 pb-1 text-muted-foreground resize-none"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleAdd}
                className="text-xs bg-foreground text-background px-3 py-1 hover:opacity-90 transition-opacity"
              >
                {addMode === "post" ? "create draft" : "add link"}
              </button>
            </div>
          </div>
        )}


        {/* Empty State */}
        {blogs.length === 0 && !isAdding && (
          <div className="text-sm text-muted-foreground text-center py-8">
            no posts yet. click + write to create one.
          </div>
        )}

        {/* Blogs List */}
        {blogs.map((blog) => (
          <article
            key={blog.id}
            className={`flex flex-col gap-2 p-3 border border-border bg-card/50 group ${
              !blog.published ? "opacity-75 border-dashed" : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{blog.title}</span>
                  {blog.isExternal && (
                    <span className="text-[10px] bg-muted text-muted-foreground px-1 py-0.5 rounded-sm">
                      link
                    </span>
                  )}
                </div>
                {blog.isExternal ? (
                  <a 
                    href={blog.externalUrl || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mono text-[10px] text-muted-foreground hover:underline truncate max-w-[200px]"
                  >
                    {blog.externalUrl} ↗
                  </a>
                ) : (
                  <span className="mono text-[10px] text-muted-foreground">/{blog.slug}</span>
                )}
              </div>
              <button
                onClick={() => handleTogglePublish(blog.id, blog.published)}
                className={`mono text-[10px] px-1.5 py-0.5 cursor-pointer transition-colors ${
                  blog.published
                    ? "bg-green-500/10 text-green-600 hover:bg-red-500/10 hover:text-red-600"
                    : "bg-yellow-500/10 text-yellow-600 hover:bg-green-500/10 hover:text-green-600"
                }`}
              >
                {blog.published ? (
                  <>
                    <span className="group-hover:hidden">published</span>
                    <span className="hidden group-hover:inline">unpublish</span>
                  </>
                ) : (
                  <>
                    <span className="group-hover:hidden">draft</span>
                    <span className="hidden group-hover:inline">publish</span>
                  </>
                )}
              </button>
            </div>
            
            {blog.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {blog.description}
              </p>
            )}

            <div className="flex justify-between items-center mt-1 pt-2 border-t border-border/50">
               <span className="mono text-[10px] text-muted-foreground">
                 {new Date(blog.createdAt).toLocaleDateString()} · {blog.views} views
               </span>
               <div className="flex gap-3 text-xs opacity-50 group-hover:opacity-100 transition-opacity">
                  {!blog.isExternal && (
                    <button 
                      onClick={() => setEditingBlog(blog)}
                      className="hover:text-foreground text-muted-foreground"
                    >
                      edit
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(blog.id)}
                    className="hover:text-red-500 text-muted-foreground"
                  >
                    del
                  </button>
               </div>
            </div>
          </article>
        ))}

      </div>

      {/* Blog Editor Modal */}
      {editingBlog && (
        <BlogEditor
          blogId={editingBlog.id}
          initialTitle={editingBlog.title}
          initialContent={editingBlog.content || ""}
          onSave={handleSaveBlog}
          onClose={() => setEditingBlog(null)}
        />
      )}
    </div>
  );
}
