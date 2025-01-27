import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "@/lib/session";
import { verifyPasswordByEmail } from "@/lib/auth";
import { z } from "zod";

export async function isEmailExist(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const body = await request.json();
    const email = body.email;

    const emailSchema = z.string().email("Email is invalid");
    const parsedEmail = emailSchema.safeParse(email);
    if (!parsedEmail.success) {
      return NextResponse.json(
        { message: parsedEmail.error.issues[0].message },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return NextResponse.json({
      isEmailExist: user !== null,
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

export async function loginWithEmailAndPw(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log(email, password);

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isValid = await verifyPasswordByEmail(email, password);
    console.log("isValid", isValid);
    console.log(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    // Generate session token and create session
    const token = generateSessionToken();
    const session = await createSession(token, user.id);

    // Set session cookie
    await setSessionTokenCookie(token, session.expiresAt);

    // Return success response with user data (excluding sensitive information)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      message: "Login successful",
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
