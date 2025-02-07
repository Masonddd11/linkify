"use client";

import type { TextContent } from "@prisma/client";
import { useState } from "react";

export function TextWidget({
  content,
  edit,
  onUpdate,
}: {
  content: TextContent | null | undefined;
  edit: boolean;
  onUpdate?: (text: string) => void;
}) {
  const [text, setText] = useState(content?.text || "");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const textStyles = content?.color ? { color: content.color } : {};
  const commonClasses =
    "w-full text-2xl leading-normal font-[450] tracking-tight text-left";

  return (
    <div className="w-full h-full p-2 transition-all duration-200">
      <div className="w-full h-full bg-white rounded-md overflow-hidden">
        <div className="w-full h-full p-6 hover:bg-gray-50 transition-all duration-200">
          {edit ? (
            <textarea
              value={text}
              onChange={handleChange}
              style={textStyles}
              className={`${commonClasses} min-h-[120px] bg-transparent resize-none outline-none border-none rounded-lg px-3`}
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
