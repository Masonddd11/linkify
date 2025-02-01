import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function validateSlug(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ message: "Slug is required" }, { status: 400 });
  }

  const slugSchema = z
    .string({ required_error: "Slug is required" })
    .min(3, { message: "Slug must be at least 3 characters" })
    .max(32, { message: "Slug must be at most 32 characters" })
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    )
    .trim()
    .refine((value) => !value.endsWith("-"), {
      message: "Slug cannot end with a hyphen",
    })
    .refine((value) => !value.startsWith("-"), {
      message: "Slug cannot start with a hyphen",
    });

  const parsedSlug = slugSchema.safeParse(slug);
  if (!parsedSlug.success) {
    return NextResponse.json(
      { message: parsedSlug.error.issues[0].message },
      { status: 400 }
    );
  }

  const existingSlug = await prisma.userProfile.findUnique({
    where: {
      slug: parsedSlug.data,
    },
  });

  const isAvailable = existingSlug === null;

  return NextResponse.json({ isAvailable: isAvailable }, { status: 200 });
}
