import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/session";

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

    let body;
    try {
      body = await req.json();

      console.log("body: ", body);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON payload",
        },
        {
          status: 400,
        }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { layouts } = body;

    if (!layouts || !Array.isArray(layouts) || layouts.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid layout data" },
        { status: 400 }
      );
    }

    // Validate layout objects
    const isValidLayout = layouts.every((layout) => {
      return (
        layout &&
        typeof layout === "object" &&
        typeof layout.i === "string" &&
        typeof layout.x === "number" &&
        typeof layout.y === "number" &&
        typeof layout.w === "number" &&
        typeof layout.h === "number"
      );
    });

    if (!isValidLayout) {
      return NextResponse.json(
        { success: false, error: "Invalid layout format" },
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
    const allWidgetsBelongToUser = layouts.every((layout) =>
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
