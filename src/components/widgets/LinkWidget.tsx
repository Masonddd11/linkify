import { LinkContent } from "@/types/widget";
import Image from "next/image";

export function LinkWidget({ content }: { content: LinkContent }) {
  return (
    <a 
      href={content.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full h-full p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex gap-4 h-full">
        {content.thumbnail && (
          <div className="relative w-1/3 aspect-square">
            <Image
              src={content.thumbnail}
              alt={content.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
        <div className="flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-800 line-clamp-2">
            {content.title}
          </h3>
          {content.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {content.description}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
