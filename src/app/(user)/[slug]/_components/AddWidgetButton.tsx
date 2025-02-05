"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WIDGET_SIZE, WIDGET_TYPE } from "@prisma/client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useWidgets } from "../_hooks/useWidgets";

interface AddWidgetButtonProps {
  userId: number;
}

const WIDGET_TYPES = [
  { value: WIDGET_TYPE.TEXT, label: "Text" },
  { value: WIDGET_TYPE.LINK, label: "Link" },
  { value: WIDGET_TYPE.IMAGE, label: "Image" },
  { value: WIDGET_TYPE.EMBED, label: "Embed" },
  { value: WIDGET_TYPE.SOCIAL, label: "Social" },
];

const WIDGET_SIZES = [
  { value: WIDGET_SIZE.SMALL, label: "Small" },
  { value: WIDGET_SIZE.MEDIUM, label: "Medium" },
  { value: WIDGET_SIZE.LARGE, label: "Large" },
  { value: WIDGET_SIZE.WIDE, label: "Wide" },
  { value: WIDGET_SIZE.EXTRA_LARGE, label: "Extra Large" },
];

export function AddWidgetButton({ userId }: AddWidgetButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<WIDGET_TYPE | "">("");
  const [size, setSize] = useState<WIDGET_SIZE>(WIDGET_SIZE.SMALL);
  const [content, setContent] = useState("");

  const { addWidget, isAdding } = useWidgets(userId);

  const handleSubmit = () => {
    if (!type || !content) return;

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
          setType("");
          setSize(WIDGET_SIZE.SMALL);
          setContent("");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="col-span-3 row-span-3 w-full h-full">
          <Button
            variant="outline"
            size="icon"
            className="w-full h-full flex justify-center items-center"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Widget Type</Label>
            <Select
              value={type}
              onValueChange={(value: WIDGET_TYPE) => setType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select widget type" />
              </SelectTrigger>
              <SelectContent>
                {WIDGET_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Widget Size</Label>
            <Select
              value={size}
              onValueChange={(value: WIDGET_SIZE) => setSize(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select widget size" />
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

          <div className="space-y-2">
            <Label>Content</Label>
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter widget content"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isAdding || !type || !content}
            className="w-full"
          >
            {isAdding ? "Adding..." : "Add Widget"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
