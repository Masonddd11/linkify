import { prisma } from "@/lib/db";
import { getCurrentSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as cheerio from "cheerio";
import { WIDGET_SIZE, WIDGET_TYPE, EmbedType, ListItem, SocialLink, PLATFORM } from "@prisma/client";
import { uploadImage } from "@/lib/cloudinary";
import { verifyWidgetOwnership } from "@/lib/user";

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
      .refine(
        (val) => val === undefined || (val.length >= 1 && val.length <= 32),
        {
          message: "Display name must be 1-32 characters",
        }
      ),
    bio: z
      .string()
      .optional()
      .refine(
        (val) => val === undefined || (val.length >= 0 && val.length <= 160),
        {
          message: "Bio must be 0-160 characters",
        }
      ),
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

const widgetSchema = z.object({
  type: z.nativeEnum(WIDGET_TYPE),
  size: z.nativeEnum(WIDGET_SIZE),
  content: z.record(z.any()).nullable(),
});

export async function addWidget(request: NextRequest) {
  const { session, user } = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, size, content } = widgetSchema.parse(body);

    // Check if the user exists and has a profile
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: user.id },
      include: {
        widgets: {
          include: {
            textContent: true,
            linkContent: true,
            imageContent: true,
            embedContent: true,
            socialContent: true,
            listContent: {
              include: {
                items: true,
              },
            },
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
              embedUrl: content?.embedUrl,
              type: content?.type.toUpperCase() as EmbedType,
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
        ...(type === WIDGET_TYPE.LIST && {
          listContent: {
            create: {
              items: {
                create: content?.items.map((item: ListItem) => ({
                  content: item.content,
                  isCompleted: item.isCompleted,
                  order: item.order,
                })),
              },
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
        listContent: {
          include: {
            items: true,
          },
        },
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

export async function updateWidgetLayouts(req: NextRequest) {
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

const textUpdateSchema = z.object({
  widgetId: z.string(),
  text: z.string().optional(),
  color: z.string().optional(),
});

export async function updateTextWidgets(request: NextRequest) {
  try {
    const { session, user } = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { text, widgetId, color } = textUpdateSchema.parse(body);

    const widget = await prisma.widget.findUnique({
      where: { id: widgetId },
      include: {
        profile: true,
        textContent: true,
      },
    });

    if (!widget) {
      return NextResponse.json(
        { message: "Widget not found" },
        { status: 404 }
      );
    }

    if (widget.profile.userId !== user.id) {
      return NextResponse.json(
        { message: "Unauthorized to modify this widget" },
        { status: 403 }
      );
    }

    const updatedTextContent = await prisma.textContent.update({
      where: { widgetId },
      data: { text, color },
    });

    return NextResponse.json(updatedTextContent);
  } catch (error) {
    console.error("Error updating widget text:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid text data", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed to update widget text" },
      { status: 500 }
    );
  }
}

export async function deleteWidget(request: Request) {
  const { session, user } = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  //check widget ownership
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ message: "Invalid widget ID" }, { status: 400 });
  }

  const widget = await prisma.widget.findUnique({
    where: { id },
    include: {
      profile: true,
    },
  });

  if (!widget) {
    return NextResponse.json({ message: "Widget not found" }, { status: 404 });
  }

  if (widget.profile.userId !== user.id) {
    return NextResponse.json(
      { message: "Unauthorized to modify this widget" },
      { status: 403 }
    );
  }

  try {
    const widget = await prisma.widget.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(widget);
  } catch (error: unknown) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function updateWidgetSize(
  req: Request,
  { params }: { params: { widgetId: string } }
) {
  try {
    const { widgetId } = await params;
    const { size } = await req.json();

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

export async function getMetadata(request: Request) {
  const url = new URL(request.url).searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const metadata = {
      title:
        $('meta[property="og:title"]').attr("content") ||
        $("title").text() ||
        "",
      description:
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        "",
      image: $('meta[property="og:image"]').attr("content") || "",
    };

    return NextResponse.json(metadata);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 500 }
    );
  }
}

export async function uploadImageToImageWidget(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const buffer = await file.arrayBuffer();

    const result = await uploadImage({
      buffer: new Uint8Array(buffer),
      userId: user.id,
      folder: "widget_images",
      tags: ["widget_image"],
      transformation: [{ width: 800, crop: "limit" }],
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}


export async function updateImageWidget(
  req: Request,
  { params }: { params: { widgetId: string } }
) {
  try {
    const { session, user } = await getCurrentSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { url, alt } = await req.json();

    if (!url) {
      return new NextResponse("URL is required", { status: 400 });
    }

    //check widget ownership
    const widget = await prisma.widget.findUnique({
      where: { id: params.widgetId },
      include: { profile: true },
    });
        

    if (!widget) {
      return new NextResponse("Widget not found", { status: 404 });
    }

    const ownership = verifyWidgetOwnership(widget.id, user.id);

    if (!ownership) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const updatedWidget = await prisma.imageContent.update({
      where: {
        widgetId: params.widgetId,
      },
      data: {
        url,
        alt: alt || null,
      },
    });

    return NextResponse.json(updatedWidget);
  } catch (error) {
    console.error("[WIDGET_IMAGE_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 


export async function uploadImageToWidget(req: Request) {
  try {
    const { user , session} = await getCurrentSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadImage({
      buffer: new Uint8Array(buffer),
      userId: user.id,
      transformation: [{ width: 800, height: 800, crop: "limit" }],
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("[IMAGE_UPLOAD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 

export async function createListItem(
  req: Request,
  { params } : { params: { listId: string } }
) {
  const { listId } = await params;

  const { user } = await getCurrentSession();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const list = await prisma.listContent.findUnique({
    where: { id: listId, widget: { profile: { userId: user.id } } },
  });
  if (!list) {
    return new NextResponse("List not found", { status: 404 });
  }

  const ownership = verifyWidgetOwnership(list.widgetId, user.id);
  if (!ownership) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {

    const body = await req.json();
    const { content, order } = body;

    const item = await prisma.listItem.create({
      data: {
        content,
        order,
        listId,
      },
    });

    return NextResponse.json(item);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 

export async function updateListItem(
  req: Request,
  { params }: { params: { listId: string; itemId: string } }
) {
  const { listId, itemId } = await params;

  const { user } = await getCurrentSession();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  //check list ownership
  const list = await prisma.listContent.findUnique({
    where: { id: listId, widget: { profile: { userId: user.id } } },
  });
  if (!list) return new NextResponse("List not found", { status: 404 });

  const ownership = verifyWidgetOwnership(list.widgetId, user.id);
  if (!ownership) return new NextResponse("Unauthorized", { status: 403 });

  const item = await prisma.listItem.findUnique({
    where: { id: itemId, listId },
  });
  if (!item) return new NextResponse("Item not found", { status: 404 });

  try {

    const body = await req.json();
    const item = await prisma.listItem.update({
      where: { id: itemId },
      data: body,
    });

    return NextResponse.json(item);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function deleteListItem(
  req: Request,
  { params }: { params: { listId: string; itemId: string } }
) {
  const { listId, itemId } = await params;

  const { user } = await getCurrentSession();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  //check list ownership
  const list = await prisma.listContent.findUnique({
    where: { id: listId, widget: { profile: { userId: user.id } } },
  });
  if (!list) return new NextResponse("List not found", { status: 404 });

  const ownership = verifyWidgetOwnership(list.widgetId, user.id);
  if (!ownership) return new NextResponse("Unauthorized", { status: 403 });

  const item = await prisma.listItem.findUnique({
    where: { id: itemId, listId },
  });
  if (!item) return new NextResponse("Item not found", { status: 404 });

  try {

    await prisma.listItem.delete({
      where: { id: itemId },
    });

    return new NextResponse(null, { status: 204 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 

export async function getGithubContributions(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  const { profileId } = await params;


  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(profileId),
    },
    include: {
      UserProfile: {
        include: {
          socialLinks: true,
        },
      },
    },
  });

  const githubUrl = user?.UserProfile?.socialLinks.find(
    (link: SocialLink) => link.platform === "GITHUB"
  )?.url;

  if (!githubUrl) {
    return NextResponse.json({ 
      username: null,
      total: {},
      contributions: []
    }, { status: 404 });
  }

  const username = githubUrl.split("https://github.com/")[1];
  if (!username) {
    return NextResponse.json({ 
      username: null,
      total: {},
      contributions: []
    }, { status: 404 });
  }

  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch GitHub contributions");
    }

    const data = await response.json();
    return NextResponse.json({
      username,
      total: data.total,
      contributions: data.contributions,
    });
  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ 
      username: null,
      total: {},
      contributions: []
    }, { status: 500 });
  }
} 

export async function getUserSocialLinks() {
  const { session, user } = await getCurrentSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const profile = await prisma.userProfile.findFirst({
      where: { userId: user.id },
      include: { socialLinks: true },
    });

    return NextResponse.json(profile?.socialLinks || []);
  } catch (error) {
    console.error("Error fetching social links:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

interface SocialLinkInput {
  links: Record<string, { url: string; handle: string }>;
}

export async function updateUserSocialLinks(req: Request) {
  const { session, user } = await getCurrentSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { links } = (await req.json()) as SocialLinkInput;

    const profile = await prisma.userProfile.findFirst({
      where: { userId: user.id },
    });

    if (!profile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    // Delete existing links
    await prisma.socialLink.deleteMany({
      where: { profileId: profile.id },
    });

    // Create new links
    const socialLinks = await Promise.all(
      Object.entries(links).map(([platform, { url, handle }]) =>
        prisma.socialLink.create({
          data: {
            platform: platform as PLATFORM,
            url,
            handle,
            profileId: profile.id,
          },
        })
      )
    );

    return NextResponse.json(socialLinks);
  } catch (error) {
    console.error("Error updating social links:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 