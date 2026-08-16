"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "../db";
import { users } from "../db/schema";
import { createSession, deleteSession } from "./session";

export type AuthFormState = { error: string } | undefined;

function validateCredentials(email: string, password: string): string | null {
  if (!email.includes("@")) return "Enter a valid email address.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  return null;
}

export async function signup(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const validationError = validateCredentials(email, password);
  if (validationError) return { error: validationError };

  const [existing] = await db.select().from(users).where(eq(users.email, email));
  if (existing) return { error: "An account with that email already exists." };

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db.insert(users).values({ email, passwordHash }).returning();

  await createSession(user.id);
  redirect("/review");
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const [user] = await db.select().from(users).where(eq(users.email, email));

  // Deliberately the same error for "no such user" and "wrong password" --
  // a different message for each would let an attacker discover which
  // emails have accounts by trying passwords against them.
  if (!user) return { error: "Invalid email or password." };

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) return { error: "Invalid email or password." };

  await createSession(user.id);
  redirect("/review");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
