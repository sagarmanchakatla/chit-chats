"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AuthResult = { error: string } | { success: string };

export async function signIn(_prev: AuthResult | null, formData: FormData): Promise<AuthResult> {
  const password = formData.get("password") as string;

  if (!password) {
    return { error: "Password is required." };
  }

  const allowedPassword = process.env.PASSWORD;

  if (!allowedPassword) {
    return { error: "Server configuration error. Please try again later." };
  }

  if (password !== allowedPassword) {
    return { error: "Incorrect password. Try again!" };
  }

  const cookieStore = await cookies();
  cookieStore.set("auth_token", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  redirect("/");
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/login");
}
