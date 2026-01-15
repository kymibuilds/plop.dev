"use client";
import { FeatureConfig, ToggleBar } from "./_components/toggle-bar";
import { useState, useEffect } from "react";

type LinkItem = {
  id: string;
  name: string;
  url: string;
};

type Product = {
  id: string;
  name: string;
  price: string;
  imageUrl: string | null;
  isActive: boolean;
};

type Blog = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  isExternal?: boolean;
  externalUrl?: string | null;
};

export default function MyPage() {
  const [features, setFeatures] = useState<FeatureConfig>({
    links: true,
    blogs: true,
    products: true,
    integrations: true,
  });

  const [links, setLinks] = useState<LinkItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  // Fetch data on mount
  useEffect(() => {
    fetch("/api/links")
      .then((res) => res.json())
      .then((data) => setLinks(data))
      .catch(console.error);

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error);

    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch(console.error);
  }, []);

  // Filter to only active items
  const activeProducts = products.filter((p) => p.isActive);
  const publishedBlogs = blogs.filter((b) => b.published);

  return (
    <main className="w-full min-h-screen flex justify-center px-6 py-16">
      <div className="w-full max-w-lg fixed top-4">
        <ToggleBar value={features} onChange={setFeatures} />
      </div>
      
      <div className="w-full max-w-lg flex flex-col gap-10 text-sm text-center items-center">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-normal">[nyahh]</h1>
        </div>

        {/* Divider */}
        <div className="mono text-xs text-muted-foreground">
          ────────────────────────
        </div>

        {/* Links */}
        {features.links && links.length > 0 && (
          <section className="flex flex-col gap-4 items-center">
            <h2 className="mono text-xs text-muted-foreground">［ links ］</h2>
            <div className="text-center max-w-xs leading-relaxed">
              {links.map((link, i) => (
                <span key={link.id}>
                  {i > 0 && <span className="text-muted-foreground mx-2">•</span>}
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline cursor-pointer">
                    {link.name}
                  </a>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Blogs */}
        {features.blogs && publishedBlogs.length > 0 && (
          <section className="flex flex-col gap-4 items-center">
            <h2 className="mono text-xs text-muted-foreground">［ blogs ］</h2>
            <div className="flex flex-col gap-2">
              {publishedBlogs.map((blog) => {
                 const isExternal = blog.isExternal;
                 const href = isExternal ? blog.externalUrl || "#" : `/blog/${blog.slug}`;
                 const target = isExternal ? "_blank" : undefined;
                 
                 return (
                  <a 
                    key={blog.id} 
                    href={href}
                    target={target}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="hover:underline cursor-pointer flex items-center gap-1"
                  >
                    {blog.title}
                    {isExternal && <span className="text-[9px] -mt-1">↗</span>}
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Products */}
        {features.products && activeProducts.length > 0 && (
          <section className="flex flex-col gap-4 items-center w-full">
            <h2 className="mono text-xs text-muted-foreground">［ products ］</h2>
            <div className="grid grid-cols-3 gap-2 w-full">
              {activeProducts.map((product) => (
                <a
                  key={product.id}
                  className="flex flex-col group cursor-pointer border border-border bg-card/50 hover:border-foreground/20 transition-colors"
                >
                  {product.imageUrl ? (
                    <div className="aspect-[3/2] overflow-hidden border-b border-border">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[3/2] bg-muted/50 border-b border-border flex items-center justify-center">
                      <span className="text-[10px] text-muted-foreground">no image</span>
                    </div>
                  )}
                  <div className="flex flex-col text-left p-2">
                    <span className="text-xs group-hover:underline truncate">{product.name}</span>
                    <span className="mono text-[10px] text-muted-foreground">{product.price}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="mono text-xs text-muted-foreground pt-6">
          plop.dev/nyahh
        </div>
      </div>
    </main>
  );
}
