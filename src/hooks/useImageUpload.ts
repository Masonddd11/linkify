"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useImageUpload = () => {
  const { mutateAsync: uploadImage, isPending: isUploading } = useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.url;
    },
    onError: () => {
      toast.error("Failed to upload image");
    }
  });

  return { uploadImage, isUploading };
}; 