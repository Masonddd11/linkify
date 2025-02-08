import { prisma } from "@/lib/db";
import { WIDGET_SIZE } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { widgetId: string } }
) {
  try {
    const { widgetId } = params;
    const { size } = await req.json();

    // Update both the widget size and its layout
    const widget = await prisma.widget.update({
      where: { id: widgetId },
      data: {
        size: size as WIDGET_SIZE,
        layout: {
          update: {
            w:
              size === WIDGET_SIZE.SMALL_SQUARE
                ? 1
                : size === WIDGET_SIZE.LARGE_SQUARE
                ? 2
                : size === WIDGET_SIZE.WIDE
                ? 2
                : 1,
            h:
              size === WIDGET_SIZE.SMALL_SQUARE
                ? 1
                : size === WIDGET_SIZE.LARGE_SQUARE
                ? 2
                : size === WIDGET_SIZE.LONG
                ? 2
                : 1,
          },
        },
      },
      include: {
        layout: true,
      },
    });

    return NextResponse.json(widget);
  } catch (error) {
    console.error("Error updating widget size:", error);
    return NextResponse.json(
      { error: "Failed to update widget size" },
      { status: 500 }
    );
  }
}
