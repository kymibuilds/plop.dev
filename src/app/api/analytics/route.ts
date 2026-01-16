import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { db } from "@/db";
import { links, blogs, products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    // Get session using validateRequest
    const { session, user } = await validateRequest();
    
    if (!session || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all user data in parallel
    const [userLinks, userBlogs, userProducts] = await Promise.all([
      db.select().from(links).where(eq(links.userId, user.id)).orderBy(desc(links.clicks)),
      db.select().from(blogs).where(eq(blogs.userId, user.id)).orderBy(desc(blogs.views)),
      db.select().from(products).where(eq(products.userId, user.id)),
    ]);

    // Calculate totals
    const totalLinkClicks = userLinks.reduce((sum, link) => sum + link.clicks, 0);
    const totalBlogViews = userBlogs.reduce((sum, blog) => sum + blog.views, 0);
    const totalProductSales = userProducts.reduce((sum, product) => sum + product.sales, 0);
    const totalRevenue = userProducts.reduce((sum, product) => sum + product.revenue, 0);

    // Top performers (max in each category for percentage calculation)
    const maxLinkClicks = Math.max(...userLinks.map(l => l.clicks), 1);
    const maxBlogViews = Math.max(...userBlogs.map(b => b.views), 1);

    // Format top links with percentage
    const topLinks = userLinks.slice(0, 5).map(link => ({
      id: link.id,
      name: link.name,
      url: link.url,
      clicks: link.clicks,
      percentage: Math.round((link.clicks / maxLinkClicks) * 100),
    }));

    // Format top blogs with percentage
    const topBlogs = userBlogs.slice(0, 5).map(blog => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      views: blog.views,
      percentage: Math.round((blog.views / maxBlogViews) * 100),
    }));

    // Summary counts
    const counts = {
      links: userLinks.length,
      blogs: userBlogs.length,
      products: userProducts.length,
    };

    return NextResponse.json({
      totalLinkClicks,
      totalBlogViews,
      totalProductSales,
      totalRevenue, // in cents
      topLinks,
      topBlogs,
      counts,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
