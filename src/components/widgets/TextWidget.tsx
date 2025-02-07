"use client";

import type { Prisma } from "@prisma/client";
import { useState } from "react";
import { useWidgetText } from "./_hooks/useWidgetText";

export function TextWidget({
  widget,
  edit,
}: {
  widget:
    | Prisma.WidgetGetPayload<{ include: { textContent: true } }>
    | null
    | undefined;
  edit: boolean;
}) {
  const [text, setText] = useState(widget?.textContent?.text || "");
  const { updateText, isError, error } = useWidgetText();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (widget?.id) {
      updateText({ widgetId: widget.id, text: newText });
    }
  };

  if (isError && error instanceof Error) {
    console.error("Failed to update text:", error.message);
  }

  const textStyles = widget?.textContent?.color
    ? { color: widget.textContent.color }
    : {};
  const commonClasses =
    "w-full text-2xl leading-normal font-[450] tracking-tight text-left";

  return (
    <div className="w-full h-full p-2  ">
      <div className="w-full h-full rounded-md overflow-hidden hover:bg-gray-50 ">
        <div className="w-full h-full p-6  transition-all duration-200">
          {edit ? (
            <textarea
              value={text}
              onChange={handleChange}
              style={textStyles}
              className={`${commonClasses} h-full w-full no-scrollbar box-border bg-transparent resize-none outline-none border-none rounded-lg px-3`}
              placeholder="Start typing..."
            />
          ) : (
            <p className={commonClasses} style={textStyles}>
              {text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
