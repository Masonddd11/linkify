import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function updateUserInfo(request: NextRequest) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const schema = z.object({
    userId: z.number(),
    displayName: z
      .string()
      .optional()
      .refine((val) => val === undefined || (val.length >= 1 && val.length <= 32), {
        message: "Display name must be 1-32 characters",
      }),
    bio: z
      .string()
      .optional()
      .refine((val) => val === undefined || (val.length >= 0 && val.length <= 160), {
        message: "Bio must be 0-160 characters",
      }),
  });

  const parsedBody = schema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      { message: parsedBody.error.issues[0].message },
      { status: 400 }
    );
  }

  const { displayName, bio, userId } = parsedBody.data;

  try {
    const response = await prisma.userProfile.update({
      where: {
        userId,
      },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(bio !== undefined && { bio }),
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      data: response,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
