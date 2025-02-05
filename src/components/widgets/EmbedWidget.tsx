import { EmbedContent } from "@prisma/client";

export function EmbedWidget({ content }: { content: EmbedContent }) {
  return (
    <div className="w-full h-full">
      <iframe
        src={content.embedUrl}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
