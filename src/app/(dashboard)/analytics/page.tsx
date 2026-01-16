"use client";

import { useState, useEffect } from "react";
import { BarChart3, Eye, MousePointerClick, DollarSign } from "lucide-react";

type Analytics = {
  totalLinkClicks: number;
  totalBlogViews: number;
  totalProductSales: number;
  totalRevenue: number;
  topLinks: Array<{ id: string; name: string; url: string; clicks: number; percentage: number }>;
  topBlogs: Array<{ id: string; title: string; slug: string; views: number; percentage: number }>;
  counts: { links: number; blogs: number; products: number };
};

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load analytics");
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto py-16 px-6 flex flex-col gap-8">
        <h1 className="text-lg font-normal">[analytics]</h1>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 border border-border bg-card/50 animate-pulse">
              <div className="h-3 w-16 bg-muted rounded mb-2" />
              <div className="h-8 w-24 bg-muted rounded" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-muted/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full max-w-md mx-auto py-16 px-6 flex flex-col gap-4 items-center justify-center">
        <span className="text-sm text-muted-foreground">failed to load analytics</span>
      </div>
    );
  }

  const hasNoData = data.totalLinkClicks === 0 && data.totalBlogViews === 0 && data.totalProductSales === 0;

  // Format currency
  const formatRevenue = (cents: number) => {
    if (cents === 0) return "$0";
    return `$${(cents / 100).toFixed(2)}`;
  };

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}m`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="w-full max-w-md mx-auto py-16 px-6 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-normal">[analytics]</h1>
        <span className="text-xs text-muted-foreground mono">
          {data.counts.links} links · {data.counts.blogs} blogs · {data.counts.products} products
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="link clicks"
          value={formatNumber(data.totalLinkClicks)}
          icon={<MousePointerClick className="w-4 h-4" />}
        />
        <StatCard
          label="blog views"
          value={formatNumber(data.totalBlogViews)}
          icon={<Eye className="w-4 h-4" />}
        />
        <StatCard
          label="total sales"
          value={formatNumber(data.totalProductSales)}
          icon={<BarChart3 className="w-4 h-4" />}
        />
        <StatCard
          label="revenue"
          value={formatRevenue(data.totalRevenue)}
          icon={<DollarSign className="w-4 h-4" />}
        />
      </div>

      {hasNoData ? (
        <div className="text-center py-12 text-sm text-muted-foreground">
          <p>no data yet.</p>
          <p className="mt-1 text-xs">add links and blogs to start tracking.</p>
        </div>
      ) : (
        <>
          {/* Top Links Chart */}
          {data.topLinks.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-xs text-muted-foreground mono">top links</h2>
              <div className="flex flex-col gap-2">
                {data.topLinks.map((link) => (
                  <BarItem
                    key={link.id}
                    label={link.name}
                    value={link.clicks}
                    percentage={link.percentage}
                    suffix="clicks"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Top Blogs Chart */}
          {data.topBlogs.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-xs text-muted-foreground mono">top blogs</h2>
              <div className="flex flex-col gap-2">
                {data.topBlogs.map((blog) => (
                  <BarItem
                    key={blog.id}
                    label={blog.title}
                    value={blog.views}
                    percentage={blog.percentage}
                    suffix="views"
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-4 border border-border bg-card/50 flex flex-col gap-2 group hover:border-foreground/20 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground mono">{label}</span>
        <span className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
          {icon}
        </span>
      </div>
      <span className="text-2xl font-light mono">{value}</span>
    </div>
  );
}

function BarItem({
  label,
  value,
  percentage,
  suffix,
}: {
  label: string;
  value: number;
  percentage: number;
  suffix: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm">
        <span className="truncate max-w-[200px]">{label}</span>
        <span className="text-xs text-muted-foreground mono ml-2 whitespace-nowrap">
          {value} {suffix}
        </span>
      </div>
      {/* Monochrome Bar */}
      <div className="h-1.5 w-full bg-muted/50 overflow-hidden">
        <div
          className="h-full bg-foreground/70 transition-all duration-500 ease-out"
          style={{ width: `${Math.max(percentage, 2)}%` }}
        />
      </div>
    </div>
  );
}