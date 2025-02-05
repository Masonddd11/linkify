import { TextContent } from "@prisma/client";

export function TextWidget({
  content,
}: {
  content: TextContent | null | undefined;
}) {
  if (!content) return null;
  return (
    <div className="w-full h-full flex items-center justify-center p-4 transition-colors duration-200">
      <p
        className="text-center text-[15px] w-full break-words leading-[1.35] font-[450] tracking-[-0.003em]"
        style={{
          color: content.color ?? "rgb(25, 28, 33)",
        }}
      >
        {content.text}
      </p>
    </div>
  );
}
