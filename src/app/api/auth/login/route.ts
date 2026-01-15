import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, or } from "drizzle-orm";

export async function POST(req: Request) {
  const { identifier, password } = await req.json();

  const user = await db.query.users.findFirst({
    where: or(
      eq(users.email, identifier),
      eq(users.username, identifier)
    ),
  });

  if (!user) {
    return new NextResponse("Invalid credentials", { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return new NextResponse("Invalid credentials", { status: 401 });
  }

  const session = await auth.createSession(user.id, {});
  const sessionCookie = auth.createSessionCookie(session.id);

  return new NextResponse(null, {
    headers: {
      "Set-Cookie": sessionCookie.serialize(),
    },
  });
}
