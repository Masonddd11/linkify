import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/session";

export async function POST(
  req: Request,
  { params }: { params: { listId: string } }
) {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { content, order } = body;

    const item = await db.listItem.create({
      data: {
        content,
        order,
        listId: params.listId,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("[LIST_ITEM_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 