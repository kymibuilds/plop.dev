import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { links } from "@/db/schema";
import { validateRequest } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

// PUT: Update a link by ID
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
  const { name, url } = body;

  // Normalize URL: add https:// if no protocol is present
  let normalizedUrl = url?.trim() || "";
  if (normalizedUrl && !normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  const [updated] = await db
    .update(links)
    .set({ name, url: normalizedUrl })
    .where(and(eq(links.id, id), eq(links.userId, user.id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// DELETE: Delete a link by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Ensure the link belongs to the user
  const [deleted] = await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.userId, user.id)))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

