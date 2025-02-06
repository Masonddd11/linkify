"use client";

import { useState } from "react";
import {
  Plus,
  ChevronRight,
  Link,
  ImageIcon,
  Type,
  Share2,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWidgets } from "../_hooks/useWidgets";
import { WIDGET_SIZE } from "@prisma/client";
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

interface AddWidgetButtonProps {
  userId: number;
}

const WIDGET_SIZES = [
  { value: WIDGET_SIZE.SMALL_SQUARE, label: "Small Square" },
  { value: WIDGET_SIZE.LARGE_SQUARE, label: "Large Square" },
  { value: WIDGET_SIZE.WIDE, label: "Wide" },
  { value: WIDGET_SIZE.LONG, label: "Long" },
];

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
      {
        icon: ImageIcon,
        label: "Image",
        type: WidgetType.IMAGE,
        color: "bg-blue-100",
      },
      {
        icon: Code,
        label: "Embed",
        type: WidgetType.EMBED,
        color: "bg-blue-100",
      },
      {
        icon: Share2,
        label: "Social",
        type: WidgetType.SOCIAL,
        color: "bg-blue-100",
      },
    ],
  },
];

export function AddWidgetButton({ userId }: AddWidgetButtonProps) {
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [type, setType] = useState<WidgetType>(WidgetType.TEXT);
  const [size, setSize] = useState<WIDGET_SIZE>(WIDGET_SIZE.SMALL_SQUARE);
  const [content, setContent] = useState<WidgetContent>({} as TextContent);

  const { addWidget, isAdding } = useWidgets(userId);
  const router = useRouter();

  const handleSelectWidget = (selectedType: WidgetType) => {
    setType(selectedType);
    setIsTypeSelectOpen(false);
    setIsConfigOpen(true);
    // Reset content when changing type
    switch (selectedType) {
      case WidgetType.TEXT:
        setContent({} as TextContent);
        break;
      case WidgetType.LINK:
        setContent({} as LinkContent);
        break;
      case WidgetType.IMAGE:
        setContent({} as ImageContent);
        break;
      case WidgetType.EMBED:
        setContent({} as EmbedContent);
        break;
      case WidgetType.SOCIAL:
        setContent({} as SocialContent);
        break;
    }
  };

  const handleSubmit = () => {
    // Validate required fields based on widget type
    let isValid = false;
    switch (type) {
      case WidgetType.TEXT:
        isValid = !!(content as TextContent).text;
        break;
      case WidgetType.LINK:
        isValid =
          !!(content as LinkContent).url && !!(content as LinkContent).title;
        break;
      case WidgetType.IMAGE:
        isValid = !!(content as ImageContent).url;
        break;
      case WidgetType.EMBED:
        isValid = !!(content as EmbedContent).embedUrl;
        break;
      case WidgetType.SOCIAL:
        isValid = !!(
          (content as SocialContent).platform &&
          (content as SocialContent).username &&
          (content as SocialContent).profileUrl
        );
        break;
    }

    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    addWidget(
      {
        userId,
        type,
        size,
        content,
      },
      {
        onSuccess: () => {
          setIsConfigOpen(false);
          setType(WidgetType.TEXT);
          setSize(WIDGET_SIZE.SMALL_SQUARE);
          setContent({} as TextContent);
          toast.success("Widget added successfully!");
        },
      }
    );

    router.refresh();
  };

  const renderContentInputs = () => {
    switch (type) {
      case WidgetType.TEXT:
        return (
          <Card>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="text">Text</Label>
                <Input
                  id="text"
                  value={(content as TextContent).text || ""}
                  onChange={(e) =>
                    setContent({ text: e.target.value } as TextContent)
                  }
                  placeholder="Enter your text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color (optional)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="color"
                    type="color"
                    value={(content as TextContent).color || "#000000"}
                    onChange={(e) =>
                      setContent({
                        ...(content as TextContent),
                        color: e.target.value,
                      } as TextContent)
                    }
                    className="w-12 h-12 p-1 rounded"
                  />
                  <span>{(content as TextContent).color || "#000000"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      // Other cases remain the same...
      default:
        return null;
    }
  };

  return (
    <>
      <Sheet open={isTypeSelectOpen} onOpenChange={setIsTypeSelectOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className="w-full h-full flex flex-col justify-center items-center gap-2 border-dashed border-2 hover:border-primary"
          >
            <Plus className="h-6 w-6" />
            <span>Add Widget</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[400px] sm:w-[540px] sm:max-w-none"
        >
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">
              Choose Widget Type
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

      <Sheet open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <SheetContent
          side="right"
          className="w-[400px] sm:w-[540px] sm:max-w-none"
        >
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">
              Configure Widget
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="space-y-6 py-6">
              {renderContentInputs()}
              <div className="space-y-2">
                <Label>Widget Size</Label>
                <Select
                  value={size}
                  onValueChange={(value) => setSize(value as WIDGET_SIZE)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {WIDGET_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ScrollArea>
          <SheetFooter className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={
                isAdding || !content || Object.keys(content).length === 0
              }
              className="w-full"
            >
              {isAdding ? "Adding..." : "Add Widget"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
