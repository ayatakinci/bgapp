import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { eq, and, gt } from "drizzle-orm";
import { db } from "../db";
import { sessions, users } from "../db/schema";
import { decrypt } from "./session";

// The "secure" check from the Next.js auth guide: verifies the session
// against the database, not just the cookie's signature. cache() means
// this only actually queries once per request, no matter how many
// components call it.
export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const payload = await decrypt(token);
  if (!payload) return null;

  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, payload.sessionId), gt(sessions.expiresAt, new Date())));

  if (!session) return null;

  return { userId: session.userId };
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) return null;

  const [user] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.id, session.userId));

  return user ?? null;
});
