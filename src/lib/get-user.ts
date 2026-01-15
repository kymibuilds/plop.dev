import { cookies } from "next/headers";
import { auth } from "@/lib/auth";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = auth.readSessionCookie(cookieStore.toString());
  if (!sessionId) return null;

  const { user } = await auth.validateSession(sessionId);
  return user;
}