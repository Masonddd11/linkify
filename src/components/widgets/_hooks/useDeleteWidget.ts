import { useMutation } from "@tanstack/react-query";

export function useDeleteWidget() {
  return useMutation({
    mutationFn: async (widgetId: string) => {
      const response = await fetch(`/api/widgets/delete`, {
        method: "DELETE",
        body: JSON.stringify({ id: widgetId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete widget");
      }

      return response.json();
    },
  });
}
