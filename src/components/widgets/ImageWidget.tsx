import { ImageContent } from "@prisma/client";
import Image from "next/image";

export function ImageWidget({ content }: { content: ImageContent }) {
  return (
    <div className="relative w-full h-full">
      <Image
        src={content.url}
        alt={content.alt || ""}
        fill
        className="object-cover"
      />
    </div>
  );
}
