// src/app/(user)/[slug]/_hooks/useImageWidget.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface ImageWidgetData {
  url: string;
  alt?: string;
}

export function useImageWidget() {
  const uploadImage = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/widgets/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Image uploaded successfully!");
    },
    onError: () => {
      toast.error("Failed to upload image");
    },
  });

  const updateImageContent = useMutation({
    mutationFn: async ({
      widgetId,
      data,
    }: {
      widgetId: string;
      data: ImageWidgetData;
    }) => {
      const response = await fetch(`/api/widgets/${widgetId}/image`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update image");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Image updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update image");
    },
  });

  return {
    uploadImage,
    updateImageContent,
    isLoading: uploadImage.isPending || updateImageContent.isPending,
  };
}
