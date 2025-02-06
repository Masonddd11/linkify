import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/session";
import { z } from "zod";

export async function PUT(req: NextRequest) {
  // Ensure we always return a valid JSON response

  try {
    const { session, user } = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { layouts } = await req.json();

    const layoutSchema = z
      .array(
        z.object({
          i: z.string(),
          x: z.number(),
          y: z.number(),
          w: z.number(),
          h: z.number(),
        })
      )
      .nonempty();

    const result = layoutSchema.safeParse(layouts);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid layout data" },
        { status: 400 }
      );
    }

    // Get the user's profile to verify ownership
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: user.id },
      include: { widgets: true },
    });

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: "User profile not found" },
        { status: 404 }
      );
    }

    // Verify all widgets belong to the user
    const userWidgetIds = new Set(userProfile.widgets.map((w) => w.id));
    const allWidgetsBelongToUser = result.data.every((layout) =>
      userWidgetIds.has(layout.i)
    );

    if (!allWidgetsBelongToUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to modify these widgets" },
        { status: 403 }
      );
    }

    console.log("Starting layout updates...");

    // Update layouts one by one to better track errors
    for (const layout of layouts) {
      const { i: id, x, y, w, h } = layout;
      console.log(`Updating layout for widget ${id}...`);

      try {
        await prisma.widgetLayout.upsert({
          where: { widgetId: id },
          create: { x, y, w, h, widgetId: id },
          update: { x, y, w, h },
        });

        console.log(`Successfully updated layout for widget ${id}`);
      } catch (error) {
        console.error(`Error updating layout for widget ${id}:`, error);
        throw error;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Layout updated successfully",
    });
  } catch (error) {
    console.error("Error updating layouts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update layouts" },
      { status: 500 }
    );
  }
}
