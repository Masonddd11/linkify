import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { WIDGET_SIZE, WIDGET_TYPE, EmbedType } from "@prisma/client";

const widgetSchema = z.object({
  userId: z.number(),
  type: z.nativeEnum(WIDGET_TYPE),
  size: z.nativeEnum(WIDGET_SIZE),
  content: z.record(z.any()),
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
      include: {
        widgets: {
          include: {
            textContent: true,
            linkContent: true,
            imageContent: true,
            embedContent: true,
            socialContent: true,
          },
        },
      },
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
      orderBy: { position: "desc" },
    });

    const nextPosition = (highestPositionWidget?.position ?? -1) + 1;

    // Create the widget with the appropriate content type
    const widget = await prisma.widget.create({
      data: {
        type,
        size,
        position: nextPosition,
        profile: {
          connect: { id: userProfile.id },
        },
        ...(type === WIDGET_TYPE.TEXT && {
          textContent: {
            create: content as { text: string; color?: string },
          },
        }),
        ...(type === WIDGET_TYPE.LINK && {
          linkContent: {
            create: content as {
              url: string;
              title: string;
              description?: string;
              thumbnail?: string;
            },
          },
        }),
        ...(type === WIDGET_TYPE.IMAGE && {
          imageContent: {
            create: content as { url: string; alt?: string },
          },
        }),
        ...(type === WIDGET_TYPE.EMBED && {
          embedContent: {
            create: {
              embedUrl: content.embedUrl,
              type: content.type.toUpperCase() as EmbedType,
            },
          },
        }),
        ...(type === WIDGET_TYPE.SOCIAL && {
          socialContent: {
            create: content as {
              platform: string;
              username: string;
              profileUrl: string;
            },
          },
        }),
      },
      include: {
        textContent: true,
        linkContent: true,
        imageContent: true,
        embedContent: true,
        socialContent: true,
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
    const pathParts = url.pathname.split("/");
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
