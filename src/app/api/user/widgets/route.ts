import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { WIDGET_SIZE, WIDGET_TYPE } from "@prisma/client";

const widgetSchema = z.object({
  userId: z.number(),
  type: z.nativeEnum(WIDGET_TYPE),
  size: z.nativeEnum(WIDGET_SIZE),
  content: z.string().transform((str) => JSON.parse(str)), // Transform string to JSON
});

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, type, size, content } = widgetSchema.parse(body);

    // Check if the user exists and has a profile
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!userProfile) {
      return NextResponse.json(
        { message: "User profile not found" },
        { status: 404 }
      );
    }

    // Get the highest position for the current profile's widgets
    const highestPositionWidget = await prisma.widget.findFirst({
      where: { profileId: userProfile.id },
      orderBy: { position: 'desc' },
    });

    const nextPosition = (highestPositionWidget?.position ?? -1) + 1;

    // Create the widget
    const widget = await prisma.widget.create({
      data: {
        type,
        size,
        content,
        position: nextPosition,
        profile: {
          connect: { id: userProfile.id }
        }
      },
    });

    return NextResponse.json(widget);
  } catch (error) {
    console.error("Error creating widget:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid widget data", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed to create widget" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get widget ID from the URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const widgetId = pathParts[pathParts.length - 1];

    if (!widgetId) {
      return NextResponse.json(
        { message: "Invalid widget ID" },
        { status: 400 }
      );
    }

    await prisma.widget.delete({
      where: { id: widgetId },
    });

    return NextResponse.json({ message: "Widget deleted successfully" });
  } catch (error) {
    console.error("Error deleting widget:", error);
    return NextResponse.json(
      { message: "Failed to delete widget" },
      { status: 500 }
    );
  }
}