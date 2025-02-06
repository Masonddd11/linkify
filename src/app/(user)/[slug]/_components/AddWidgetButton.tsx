"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddWidgetButtonProps {
  userId: number;
}

const WIDGET_SIZES = [
  { value: WIDGET_SIZE.SMALL_SQUARE, label: "Small Square" },
  { value: WIDGET_SIZE.LARGE_SQUARE, label: "Large Square" },
  { value: WIDGET_SIZE.WIDE, label: "Wide" },
  { value: WIDGET_SIZE.LONG, label: "Long" },
];

export function AddWidgetButton({ userId }: AddWidgetButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<WidgetType>(WidgetType.TEXT);
  const [size, setSize] = useState<WIDGET_SIZE>(WIDGET_SIZE.SMALL_SQUARE);
  const [content, setContent] = useState<WidgetContent>({} as TextContent);

  const { addWidget, isAdding } = useWidgets(userId);
  const router = useRouter();

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
          setIsOpen(false);
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
      case WidgetType.LINK:
        return (
          <>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={(content as LinkContent).url || ""}
              onChange={(e) =>
                setContent({
                  ...(content as LinkContent),
                  url: e.target.value,
                } as LinkContent)
              }
              placeholder="https://example.com"
            />
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={(content as LinkContent).title || ""}
              onChange={(e) =>
                setContent({
                  ...(content as LinkContent),
                  title: e.target.value,
                } as LinkContent)
              }
              placeholder="Link Title"
            />
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              value={(content as LinkContent).description || ""}
              onChange={(e) =>
                setContent({
                  ...(content as LinkContent),
                  description: e.target.value,
                } as LinkContent)
              }
              placeholder="Brief description"
            />
          </>
        );
      case WidgetType.IMAGE:
        return (
          <>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={(content as ImageContent).url || ""}
              onChange={(e) =>
                setContent({
                  ...(content as ImageContent),
                  url: e.target.value,
                } as ImageContent)
              }
              placeholder="https://example.com/image.jpg"
            />
            <Label htmlFor="alt">Alt Text (optional)</Label>
            <Input
              id="alt"
              value={(content as ImageContent).alt || ""}
              onChange={(e) =>
                setContent({
                  ...(content as ImageContent),
                  alt: e.target.value,
                } as ImageContent)
              }
              placeholder="Describe the image"
            />
          </>
        );
      case WidgetType.EMBED:
        return (
          <>
            <Label htmlFor="embedUrl">Embed URL</Label>
            <Input
              id="embedUrl"
              value={(content as EmbedContent).embedUrl || ""}
              onChange={(e) =>
                setContent({
                  ...(content as EmbedContent),
                  embedUrl: e.target.value,
                } as EmbedContent)
              }
              placeholder="https://youtube.com/embed/..."
            />
            <Label htmlFor="embedType">Embed Type</Label>
            <select
              id="embedType"
              value={(content as EmbedContent).type || "other"}
              onChange={(e) =>
                setContent({
                  ...(content as EmbedContent),
                  type: e.target.value as "youtube" | "spotify" | "other",
                } as EmbedContent)
              }
              className="w-full p-2 border rounded"
            >
              <option value="youtube">YouTube</option>
              <option value="spotify">Spotify</option>
              <option value="other">Other</option>
            </select>
          </>
        );
      case WidgetType.SOCIAL:
        return (
          <>
            <Label htmlFor="platform">Platform</Label>
            <Input
              id="platform"
              value={(content as SocialContent).platform || ""}
              onChange={(e) =>
                setContent({
                  ...(content as SocialContent),
                  platform: e.target.value,
                } as SocialContent)
              }
              placeholder="Twitter, Instagram, etc."
            />
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={(content as SocialContent).username || ""}
              onChange={(e) =>
                setContent({
                  ...(content as SocialContent),
                  username: e.target.value,
                } as SocialContent)
              }
              placeholder="@username"
            />
            <Label htmlFor="profileUrl">Profile URL</Label>
            <Input
              id="profileUrl"
              value={(content as SocialContent).profileUrl || ""}
              onChange={(e) =>
                setContent({
                  ...(content as SocialContent),
                  profileUrl: e.target.value,
                } as SocialContent)
              }
              placeholder="https://twitter.com/username"
            />
          </>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="w-full h-full flex flex-col justify-center items-center gap-2 border-dashed border-2 hover:border-primary"
        >
          <Plus className="h-6 w-6" />
          <span>Add Widget</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Add New Widget
          </DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue={WidgetType.TEXT}
          onValueChange={(value) => {
            setType(value as WidgetType);
            // Reset content when changing type
            switch (value as WidgetType) {
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
          }}
        >
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value={WidgetType.TEXT}>Text</TabsTrigger>
            <TabsTrigger value={WidgetType.LINK}>Link</TabsTrigger>
            <TabsTrigger value={WidgetType.IMAGE}>Image</TabsTrigger>
            <TabsTrigger value={WidgetType.EMBED}>Embed</TabsTrigger>
            <TabsTrigger value={WidgetType.SOCIAL}>Social</TabsTrigger>
          </TabsList>
          <TabsContent value={type} className="mt-4 space-y-4">
            {renderContentInputs()}
          </TabsContent>
        </Tabs>
        <div className="mt-6 space-y-4">
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
          <Button
            onClick={handleSubmit}
            disabled={isAdding || !content || Object.keys(content).length === 0}
            className="w-full"
          >
            {isAdding ? "Adding..." : "Add Widget"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
