import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, userSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/users/[username] - Get public user data
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
    columns: {
      id: true,
      username: true,
      bio: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get user settings
  const settings = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, user.id),
  });

  return NextResponse.json({
    username: user.username,
    bio: user.bio,
    settings: {
      showLinks: settings?.showLinks ?? true,
      showBlogs: settings?.showBlogs ?? true,
      showProducts: settings?.showProducts ?? true,
      showIntegrations: settings?.showIntegrations ?? true,
      linksLayout: settings?.linksLayout ?? "horizontal",
    },
  });
}

