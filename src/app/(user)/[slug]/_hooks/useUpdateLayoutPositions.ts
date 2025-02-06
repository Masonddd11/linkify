"use client";

import { Layout } from "react-grid-layout";
import { useMutation } from "@tanstack/react-query";

interface UpdateLayoutResponse {
  success: boolean;
  data?: Layout[];
  error?: string;
}

export default function useUpdateLayoutPositions() {
  const { mutate: updateLayout, isError, error, isPending } = useMutation({
    mutationFn: async (newLayout: Layout[]): Promise<UpdateLayoutResponse> => {
      // Validate layout before sending
      if (!Array.isArray(newLayout) || newLayout.length === 0) {
        throw new Error("Invalid layout data");
      }

      // Ensure all required fields are present
      const validLayout = newLayout.every((item) => {
        return (
          item &&
          typeof item.i === "string" &&
          typeof item.x === "number" &&
          typeof item.y === "number" &&
          typeof item.w === "number" &&
          typeof item.h === "number"
        );
      });

      if (!validLayout) {
        throw new Error("Invalid layout format");
      }

      const response = await fetch("/api/widgets/layout", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ layouts: newLayout }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update layout positions");
      }

      return response.json();
    },
  });

  return {
    updateLayout,
    isError,
    error,
    isPending,
  };
}
