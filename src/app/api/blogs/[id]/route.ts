import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { validateRequest } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

// PUT: Update a blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, slug, description, content, published } = body;

  const [updated] = await db
    .update(blogs)
    .set({
      ...(title && { title }),
      ...(slug && { slug }),
      ...(description !== undefined && { description }),
      ...(content !== undefined && { content }),
      ...(published !== undefined && { published }),
      updatedAt: new Date(),
    })
    .where(and(eq(blogs.id, id), eq(blogs.userId, user.id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// DELETE: Delete a blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [deleted] = await db
    .delete(blogs)
    .where(and(eq(blogs.id, id), eq(blogs.userId, user.id)))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
