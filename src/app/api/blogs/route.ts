import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { validateRequest } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

// GET: Fetch all blogs for the authenticated user
export async function GET() {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userBlogs = await db
    .select()
    .from(blogs)
    .where(eq(blogs.userId, user.id))
    .orderBy(desc(blogs.createdAt));

  return NextResponse.json(userBlogs);
}

// POST: Create a new blog draft
export async function POST(request: NextRequest) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug, description, content, isExternal, externalUrl } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
  }

  if (isExternal && !externalUrl) {
    return NextResponse.json({ error: "External URL is required for external links" }, { status: 400 });
  }

  const [newBlog] = await db
    .insert(blogs)
    .values({
      userId: user.id,
      title,
      slug,
      description: description || null,
      content: content || null,
      published: false, // Default to draft
      isExternal: isExternal || false,
      externalUrl: externalUrl || null,
    })
    .returning();

  return NextResponse.json(newBlog, { status: 201 });
}

