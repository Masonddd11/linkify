"use client";

import { useState } from "react";
import {
  Plus,
  ChevronRight,
  Link,
  List,
  ImageIcon,
  Type,
  Share2,
  GitBranch,
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
import { LinkContent, PLATFORM, SocialContent, WIDGET_SIZE, TextContent, EmbedContent, ImageContent, ListItem, ListContent } from "@prisma/client";
import { WIDGET_TYPE } from "@prisma/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { SocialWidgetDialog } from "@/components/widgets/SocialWidgetDialog";
import { LinkWidgetDialog } from "@/components/widgets/LinkWidgetDialog";
import { EmbedType } from "@prisma/client";

const WIDGET_CATEGORIES = [
  {
    title: "Basics",
    items: [
      {
        icon: Type,
        label: "Text",
        type: WIDGET_TYPE.TEXT,
        color: "bg-blue-100",
      },
      {
        icon: Link,
        label: "Link",
        type: WIDGET_TYPE.LINK,
        color: "bg-blue-100",
      },
      { 
        icon: List, 
        label: "List", 
        type: WIDGET_TYPE.LIST, 
        color: "bg-blue-100" 
      },
      {
        icon: ImageIcon,
        label: "Image",
        type: WIDGET_TYPE.IMAGE,
        color: "bg-blue-100",
      },
    ],
  },
  {
    title: "Promote",
    items: [
      {
        icon: Share2,
        label: "Social profile",
        type: WIDGET_TYPE.SOCIAL,
        color: "bg-purple-100",
      },
      {
        icon: GitBranch,
        label: "GitHub",
        type: WIDGET_TYPE.GITHUB,
        color: "bg-gray-100",
      },
    ],
  },
];

export function AddWidgetButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isSocialDialogOpen, setIsSocialDialogOpen] = useState(false);
  const { addWidget, isAdding } = useWidgets();
  const router = useRouter();

  const handleSelectWidget = (type: string) => {
    if (type === WIDGET_TYPE.LINK) {
      setIsOpen(false);
      setIsLinkDialogOpen(true);
      return;
    }

    if (type === WIDGET_TYPE.SOCIAL) {
      setIsOpen(false);
      setIsSocialDialogOpen(true);
      return;
    }

    let widgetContent;
    let widgetType = type as WIDGET_TYPE;

    switch (type) {
      case WIDGET_TYPE.TEXT:
        widgetContent = { text: "" } as TextContent;
        break;
      case WIDGET_TYPE.EMBED:
        widgetContent = { embedUrl: "", type: EmbedType.OTHER } as EmbedContent;
        break;
      case WIDGET_TYPE.IMAGE:
        widgetContent = { url: "", alt: "" } as ImageContent;
        break;
      case WIDGET_TYPE.SOCIAL:
        widgetType = WIDGET_TYPE.SOCIAL;
        widgetContent = {
          platform: "YouTube",
          username: "",
          profileUrl: "",
        } as SocialContent;
        break;
      case WIDGET_TYPE.LIST:
        widgetContent = {
          items: [{
            content: "New item",
            isCompleted: false,
            order: 0
          }]
        } as  ListContent & {
          items: ListItem[];
        };
        break;
      case WIDGET_TYPE.GITHUB:
        widgetContent = null;
        widgetType = WIDGET_TYPE.GITHUB;
        break;
      default:
        widgetContent = { text: "" } as TextContent;
        widgetType = WIDGET_TYPE.TEXT;
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
        type: WIDGET_TYPE.LINK,
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
        type: WIDGET_TYPE.SOCIAL,
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
                    {category?.items?.map((item) => (
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
