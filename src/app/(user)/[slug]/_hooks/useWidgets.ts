"use client";

import { WIDGET_SIZE, WIDGET_TYPE, TextContent, LinkContent, ImageContent, EmbedContent, SocialContent } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface AddWidgetParams {
  type: WIDGET_TYPE;
  size: WIDGET_SIZE;
  content: TextContent | LinkContent | ImageContent | EmbedContent | SocialContent;
}

interface WidgetResponse {
  id: string;
  type: WIDGET_TYPE;
  size: WIDGET_SIZE;
  textContent: {
    id: string;
    text: string;
    color: string | null;
    widgetId: string;
  } | null;
  linkContent: {
    id: string;
    title: string;
    url: string;
    widgetId: string;
    description: string | null;
    thumbnail: string | null;
  } | null;
  imageContent: {
    id: string;
    url: string;
    alt: string | null;
    widgetId: string;
  } | null;
  embedContent: {
    id: string;
    embedUrl: string;
    type: string;
    widgetId: string;
  } | null;
  socialContent: {
    id: string;
    platform: string;
    username: string;
    widgetId: string;
  } | null;
}

export function useWidgets() {
  const queryClient = useQueryClient();

  const { mutate: addWidget, isPending: isAdding } = useMutation<
    WidgetResponse,
    Error,
    AddWidgetParams
  >({
    mutationFn: async (params: AddWidgetParams) => {
      const response = await fetch("/api/user/widgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...params,
          content: params.content,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to add widget");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Widget added successfully");
      // Invalidate and refetch user profile data
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add widget");
    },
  });

  const { mutate: deleteWidget, isPending: isDeleting } = useMutation<
    void,
    Error,
    string
  >({
    mutationFn: async (widgetId: string) => {
      const response = await fetch(`/api/user/widgets/${widgetId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to delete widget");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Widget deleted successfully");
      // Invalidate and refetch user profile data
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete widget");
    },
  });

  return {
    addWidget,
    deleteWidget,
    isAdding,
    isDeleting,
  };
}
