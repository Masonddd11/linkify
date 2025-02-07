import { useMutation } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

interface UpdateTextParams {
  widgetId: string;
  text: string;
}

async function updateWidgetText({ widgetId, text }: UpdateTextParams) {
  const response = await fetch(`/api/widgets/text`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ widgetId, text }),
  });

  if (!response.ok) {
    throw new Error("Failed to update text");
  }

  return response.json();
}

export function useWidgetText() {
  const { mutate, isError, error } = useMutation({
    mutationFn: updateWidgetText,
  });

  const debouncedUpdate = useDebouncedCallback(
    (params: UpdateTextParams) => mutate(params),
    500
  );

  return {
    updateText: debouncedUpdate,
    isError,
    error,
  };
}
