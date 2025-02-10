import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PLATFORM } from "@prisma/client";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {

    const { userId } = await params;
  try {
    const { searchParams } = new URL(req.url);
    const platform = searchParams.get("platform");

    const socialLink = await prisma.socialLink.findFirst({
      where: {
        profileId: parseInt(userId),
        platform: platform as PLATFORM,
      },
    });

    if (!socialLink) {
      return new NextResponse("Social link not found", { status: 404 });
    }

    // Extract username from GitHub URL
    const username = socialLink.url.split("/").pop();
    return NextResponse.json({ username });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 