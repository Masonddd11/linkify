import { prisma } from "./db";
import { compare, hash } from "bcryptjs";
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "./session";
import { redirect } from "next/navigation";
import { createServerActionProcedure } from "zsa";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(plainPassword, hashedPassword);
}

export async function verifyPasswordByEmail(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    console.log("user", user);

    if (!user) {
      return false;
    }

    const isPasswordValid = await verifyPassword(password, user.password ?? "");

    return isPasswordValid;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return false;
  }
}

export async function signOut() {
  "use server";

  const { session } = await getCurrentSession();
  if (session) {
    await invalidateSession(session.id);
  }
  await deleteSessionTokenCookie();
  redirect("/login");
}

export const authedProcedure = createServerActionProcedure().handler(
  async () => {
    try {
      const { user, session } = await getCurrentSession();

      return {
        user,
        session,
      };
    } catch {
      throw new Error("User not authenticated");
    }
  }
);
