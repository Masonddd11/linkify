"use client";

import { useState } from "react";
import {
  Plus,
  ChevronRight,
  Link,
  List,
  Video,
  MonitorPlay,
  ImageIcon,
  Type,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWidgets } from "../_hooks/useWidgets";
import { PLATFORM, WIDGET_SIZE } from "@prisma/client";
import {
  WidgetType,
  type TextContent,
  type LinkContent,
  type ImageContent,
  type EmbedContent,
  type SocialContent,
  type WidgetContent,
} from "@/types/widget";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { SocialWidgetDialog } from "@/components/widgets/SocialWidgetDialog";
import { LinkWidgetDialog } from "@/components/widgets/LinkWidgetDialog";

const WIDGET_CATEGORIES = [
  {
    title: "Basics",
    items: [
      {
        icon: Type,
        label: "Text",
        type: WidgetType.TEXT,
        color: "bg-blue-100",
      },
      {
        icon: Link,
        label: "Link",
        type: WidgetType.LINK,
        color: "bg-blue-100",
      },
      { icon: List, label: "List", type: "LIST", color: "bg-blue-100" },
      { icon: Video, label: "Video", type: "VIDEO", color: "bg-blue-100" },
      {
        icon: MonitorPlay,
        label: "Custom content",
        type: "CUSTOM",
        color: "bg-blue-100",
      },
      {
        icon: ImageIcon,
        label: "Image",
        type: WidgetType.IMAGE,
        color: "bg-blue-100",
      },
    ],
  },
  {
    title: "Promote",
    items: [
      { icon: Plus, label: "Product", type: "PRODUCT", color: "bg-purple-100" },
      {
        icon: Plus,
        label: "Booking service",
        type: "BOOKING",
        color: "bg-purple-100",
      },
      { icon: Plus, label: "Blog post", type: "BLOG", color: "bg-purple-100" },
      { icon: Plus, label: "Event", type: "EVENT", color: "bg-purple-100" },
      {
        icon: Share2,
        label: "Social profile",
        type: WidgetType.SOCIAL,
        color: "bg-purple-100",
      },
    ],
  },
  {
    title: "Collect leads",
    items: [
      {
        icon: Plus,
        label: "Contact form",
        type: "CONTACT_FORM",
        color: "bg-orange-100",
      },
      {
        icon: Plus,
        label: "Contact card",
        type: "CONTACT_CARD",
        color: "bg-orange-100",
      },
      {
        icon: Plus,
        label: "Contact button",
        type: "CONTACT_BUTTON",
        color: "bg-orange-100",
      },
      {
        icon: Plus,
        label: "Scheduling",
        type: "SCHEDULING",
        color: "bg-orange-100",
      },
    ],
  },
  // {
  //   title: "Integrate",
  //   items: [
  //     { icon: Plus, label: "YouTube", type: "YOUTUBE", color: "bg-gray-100" },
  //     { icon: Plus, label: "X", type: "TWITTER", color: "bg-gray-100" },
  //     { icon: Plus, label: "TikTok", type: "TIKTOK", color: "bg-gray-100" },
  //     { icon: Plus, label: "Facebook", type: "FACEBOOK", color: "bg-gray-100" },
  //     { icon: Plus, label: "Twitch", type: "TWITCH", color: "bg-gray-100" },
  //     { icon: Plus, label: "Spotify", type: "SPOTIFY", color: "bg-gray-100" },
  //   ],
  // },
];

export function AddWidgetButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isSocialDialogOpen, setIsSocialDialogOpen] = useState(false);
  const { addWidget, isAdding } = useWidgets();
  const router = useRouter();

  const handleSelectWidget = (type: string) => {
    if (type === WidgetType.LINK) {
      setIsOpen(false);
      setIsLinkDialogOpen(true);
      return;
    }

    if (type === WidgetType.SOCIAL) {
      setIsOpen(false);
      setIsSocialDialogOpen(true);
      return;
    }

    let widgetContent: WidgetContent;
    let widgetType = type as WidgetType;

    switch (type) {
      case WidgetType.TEXT:
        widgetContent = { text: "" } as TextContent;
        break;
      case WidgetType.EMBED:
        widgetContent = { embedUrl: "", type: "other" } as EmbedContent;
        break;
      case WidgetType.IMAGE:
        widgetContent = { url: "", alt: "" } as ImageContent;
        break;
      case "YOUTUBE":
        widgetType = WidgetType.SOCIAL;
        widgetContent = {
          platform: "YouTube",
          username: "",
          profileUrl: "",
        } as SocialContent;
        break;
      case "TWITTER":
        widgetType = WidgetType.SOCIAL;
        widgetContent = {
          platform: "Twitter",
          username: "",
          profileUrl: "",
        } as SocialContent;
        break;
      case "TIKTOK":
        widgetType = WidgetType.SOCIAL;
        widgetContent = {
          platform: "TikTok",
          username: "",
          profileUrl: "",
        } as SocialContent;
        break;
      case "FACEBOOK":
        widgetType = WidgetType.SOCIAL;
        widgetContent = {
          platform: "Facebook",
          username: "",
          profileUrl: "",
        } as SocialContent;
        break;
      case "TWITCH":
        widgetType = WidgetType.SOCIAL;
        widgetContent = {
          platform: "Twitch",
          username: "",
          profileUrl: "",
        } as SocialContent;
        break;
      case "SPOTIFY":
        widgetType = WidgetType.SOCIAL;
        widgetContent = {
          platform: "Spotify",
          username: "",
          profileUrl: "",
        } as SocialContent;
        break;
      default:
        // Handle unknown widget type
        widgetContent = { text: "" } as TextContent;
        widgetType = WidgetType.TEXT;
        break;
    }

    addWidget(
      {
        type: widgetType,
        size: WIDGET_SIZE.SMALL_SQUARE,
        content: widgetContent,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          toast.success(`${type} widget added successfully!`);
          router.refresh();
        },
        onError: (error) => {
          toast.error(`Failed to add widget: ${error.message}`);
        },
      }
    );
  };

  const handleLinkSubmit = (data: { url: string; title: string }) => {
    addWidget(
      {
        type: WidgetType.LINK,
        size: WIDGET_SIZE.SMALL_SQUARE,
        content: {
          url: data.url,
          title: data.title,
        } as LinkContent,
      },
      {
        onSuccess: () => {
          setIsLinkDialogOpen(false);
          toast.success("Link widget added successfully!");
          router.refresh();
        },
        onError: (error) => {
          toast.error(`Failed to add widget: ${error.message}`);
        },
      }
    );
  };

  const handleSocialSubmit = (data: { platform: PLATFORM; url: string }) => {
    addWidget(
      {
        type: WidgetType.SOCIAL,
        size: WIDGET_SIZE.SMALL_SQUARE,
        content: {
          platform: data.platform,
          profileUrl: data.url,
          username: "",
        } as SocialContent,
      },
      {
        onSuccess: () => {
          setIsSocialDialogOpen(false);
          toast.success("Social widget added successfully!");
          router.refresh();
        },
        onError: (error) => {
          toast.error(`Failed to add widget: ${error.message}`);
        },
      }
    );
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className="w-full h-full flex p-2 justify-center items-center gap-2 border-dashed border-2 "
          >
            <Plus className="h-6 w-6" />
            <span className="text-sm font-bold">Add Widget</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[400px] sm:w-[540px] sm:max-w-none"
        >
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">
              Add Widget
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-80px)] pr-4">
            <div className="space-y-6 py-6">
              {WIDGET_CATEGORIES.map((category) => (
                <div key={category.title} className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {category.title}
                  </h3>
                  <div className="space-y-1">
                    {category.items.map((item) => (
                      <button
                        key={item.type}
                        onClick={() => handleSelectWidget(item.type)}
                        className="w-full flex items-center space-x-3 rounded-lg px-3 py-2 hover:bg-accent text-sm"
                        disabled={isAdding}
                      >
                        <div className={`p-2 rounded-lg ${item.color}`}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <LinkWidgetDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        onSubmit={handleLinkSubmit}
      />

      <SocialWidgetDialog
        isOpen={isSocialDialogOpen}
        onClose={() => setIsSocialDialogOpen(false)}
        onSubmit={handleSocialSubmit}
      />
    </>
  );
}
