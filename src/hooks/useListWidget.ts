"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { WidgetTypeInclude } from "@/lib/user";
import { useRouter } from "next/navigation";

interface AddItemData {
  content: string;
  order: number;
}

interface UpdateItemData {
  isCompleted?: boolean;
  content?: string;
  order?: number;
}

export function useListWidget(listId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const addItem = useMutation({
    mutationFn: async (data: AddItemData) => {
      const response = await fetch(`/api/widgets/list/${listId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to add item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["widgets"] });
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to add item");
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ itemId, data }: { itemId: string; data: UpdateItemData }) => {
      const response = await fetch(`/api/widgets/list/${listId}/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update item");
      return response.json();
    },
    onMutate: async ({ itemId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["widgets"] });

      const previousWidgets = queryClient.getQueryData(["widgets"]);

      queryClient.setQueryData(["widgets"], (old: WidgetTypeInclude[] | undefined) => {
        return old?.map((widget: WidgetTypeInclude) => {
          if (widget.listContent?.items) {
            return {
              ...widget,
              listContent: {
                ...widget.listContent,
                items: widget.listContent.items.map((item) =>
                  item.id === itemId ? { ...item, ...data } : item
                ),
              },
            };
          }
          return widget;
        });
      });

      return { previousWidgets };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousWidgets) {
        queryClient.setQueryData(["widgets"], context.previousWidgets);
      }
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["widgets"] });
      router.refresh();
    },
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(`/api/widgets/list/${listId}/items/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["widgets"] });
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to remove item");
    },
  });

  return {
    addItem: addItem.mutateAsync,
    updateItem: updateItem.mutateAsync,
    removeItem: removeItem.mutateAsync,
    isLoading: addItem.isPending || updateItem.isPending || removeItem.isPending,
  };
} 