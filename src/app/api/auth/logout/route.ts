import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const sessionId = auth.readSessionCookie(
    req.headers.get("cookie") ?? ""
  );

  if (sessionId) {
    await auth.invalidateSession(sessionId);
  }

  return new NextResponse(null, {
    headers: {
      "Set-Cookie": auth.createBlankSessionCookie().serialize(),
    },
  });
}