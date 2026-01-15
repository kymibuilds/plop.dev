import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET: Fetch a single published blog by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const [blog] = await db
    .select()
    .from(blogs)
    .where(and(eq(blogs.slug, slug), eq(blogs.published, true)))
    .limit(1);

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  // Increment view count
  await db
    .update(blogs)
    .set({ views: blog.views + 1 })
    .where(eq(blogs.id, blog.id));

  return NextResponse.json(blog);
}
