// src/app/(auth)/register/_controllers/index.ts
import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "@/lib/session";
import { z } from "zod";
import { createUser, findUserByEmail, findUserByName } from "@/lib/user";
import { prisma } from "@/lib/db";

export async function register(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const registerSchema = z.object({
      email: z
        .string()
        .email("Please enter a valid email address")
        .nonempty({ message: "Email is required" }),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .nonempty({ message: "Password is required" }),
      name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .nonempty({ message: "Name is required" })
        .regex(
          /^[a-zA-Z0-9_]+$/,
          "Username can only contain letters, numbers, and underscores"
        ),
    });

    const parsedBody = registerSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { message: parsedBody.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, name } = parsedBody.data;

    // Check if username is taken
    const existingUsername = await findUserByName(name);
    if (existingUsername) {
      return NextResponse.json(
        { message: "Username is already taken" },
        { status: 400 }
      );
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      // If user exists but only has Google auth (no password), allow setting a password
      if (existingUser.googleId && !existingUser.password) {
        const hashedPassword = await hashPassword(password);

        // Update the existing user with a password
        const updatedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            password: hashedPassword,
            // Update name if it was only set from Google
            name: name, // Use the new name provided in registration
          },
        });

        // Create session for the user
        const token = generateSessionToken();
        const session = await createSession(token, updatedUser.id);
        await setSessionTokenCookie(token, session.expiresAt);

        // Return success response
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = updatedUser;
        return NextResponse.json({
          message: "Password set successfully for Google account",
          user: userWithoutPassword,
        });
      }

      // If user already has a password, return error
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password for new user
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = await createUser({
      email,
      password: hashedPassword,
      name,
    });

    // Generate session token and create session
    const token = generateSessionToken();
    const session = await createSession(token, user.id);

    // Set session cookie
    await setSessionTokenCookie(token, session.expiresAt);

    // Return success response with user data (excluding sensitive information)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      message: "Registration successful",
      user: userWithoutPassword,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        message: "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
