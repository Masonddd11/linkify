"use client";

import { useMutation } from "@tanstack/react-query";

export function useUpdateImageContent() {
  return useMutation({
    mutationFn: async ({
      widgetId,
      data,
    }: {
      widgetId: string;
      data: { url: string; alt?: string };
    }) => {
      const response = await fetch(`/api/widgets/${widgetId}/image`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update image");
      return response.json();
    },
  });
}
