import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { sessions } from "../db/schema";

const secretKey = process.env.SESSION_SECRET!;
const encodedKey = new TextEncoder().encode(secretKey);
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export async function encrypt(sessionId: number) {
  return new SignJWT({ sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
    return payload as { sessionId: number };
  } catch {
    return null;
  }
}

// Creates a real row in the sessions table (so it can be revoked/expired
// server-side), then stores an encrypted reference to it in a cookie. The
// cookie alone is what proxy.ts can cheaply check without a DB round trip;
// the DB row is what makes the check in getSession() actually authoritative.
export async function createSession(userId: number) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const [session] = await db.insert(sessions).values({ userId, expiresAt }).returning();

  const token = await encrypt(session.id);

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const payload = await decrypt(token);

  if (payload) {
    await db.delete(sessions).where(eq(sessions.id, payload.sessionId));
  }

  cookieStore.delete("session");
}
