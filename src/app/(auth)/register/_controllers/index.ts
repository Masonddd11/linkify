// src/app/(auth)/register/_controllers/index.ts
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "@/lib/session";
import { z } from "zod";

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
        .nonempty({ message: "Name is required" }),
    });

    const parsedBody = registerSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { message: parsedBody.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, name } = parsedBody.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
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
