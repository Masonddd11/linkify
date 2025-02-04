import { TextContent } from "@/types/widget";

export function TextWidget({ content }: { content: TextContent }) {
  return (
    <div className="w-full h-full p-4 flex items-center justify-center">
      <p className="text-center text-lg" style={{ color: content.color }}>
        {content.text}
      </p>
    </div>
  );
}
