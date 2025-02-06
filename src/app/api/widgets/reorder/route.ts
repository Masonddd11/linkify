import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/session";

export async function PUT(request: Request) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { widgets } = await request.json();

    // Update each widget's layout in a transaction
    await prisma.$transaction(
      widgets.map((widget: { id: string; x: number; y: number; w: number; h: number }) =>
        prisma.widgetLayout.upsert({
          where: { widgetId: widget.id },
          create: {
            x: widget.x,
            y: widget.y,
            w: widget.w,
            h: widget.h,
            widget: { connect: { id: widget.id } }
          },
          update: {
            x: widget.x,
            y: widget.y,
            w: widget.w,
            h: widget.h
          }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to reorder widgets:", error);
    return NextResponse.json(
      { error: "Failed to reorder widgets" },
      { status: 500 }
    );
  }
}
