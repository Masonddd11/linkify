"use client";

import { WIDGET_SIZE } from "@prisma/client";
import { useState } from "react";

export function useUpdateWidgetSize() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateWidgetSize = async (widgetId: string, newSize: WIDGET_SIZE) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/widgets/${widgetId}/size`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ size: newSize }),
      });

      if (!response.ok) {
        throw new Error("Failed to update widget size");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating widget size:", error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateWidgetSize, isUpdating };
}
