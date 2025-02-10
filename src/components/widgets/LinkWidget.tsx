import { LinkContent, WIDGET_SIZE } from "@prisma/client";
import { SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Metadata {
  title: string | null;
  description: string | null;
  image: string | null;
}

export function LinkWidget({
  content,
  edit,
  size,
}: {
  content: LinkContent;
  edit: boolean;
  size: WIDGET_SIZE;
}) {
  const [metadata, setMetadata] = useState<Metadata>({
    title: null,
    description: null,
    image: null,
  });
  const hostname = new URL(content.url).hostname;

  const fetchMetadata = async () => {
    try {
      const response = await fetch(`/api/metadata?url=${content.url}`);
      if (!response.ok) {
        throw new Error("Failed to fetch metadata");
      }
      const data = await response.json();

      setMetadata({
        title: data.title,
        description: data.description,
        image: data.image,
      });
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  const generateTextClamp = (size: WIDGET_SIZE) => {
    switch (size) {
      case WIDGET_SIZE.SMALL_SQUARE:
        return "line-clamp-1";
      case WIDGET_SIZE.LARGE_SQUARE:
        return "line-clamp-2";
      case WIDGET_SIZE.WIDE:
        return "line-clamp-3";
      case WIDGET_SIZE.LONG:
        return "line-clamp-4";
    }
  };

  return (
    <a
      href={content.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${
        edit && "pointer-events-none"
      } block w-full h-full p-6 hover:bg-accent/50 transition-all duration-200 rounded-lg group overflow-hidden`}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="shrink-0 w-6 h-6 bg-white rounded-full shadow-sm p-0.5 flex items-center justify-center">
              <Image
                src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
                alt=""
                width={24}
                height={24}
                className="w-5 h-5"
              />
            </div>
            <span className="text-sm text-gray-500 font-medium truncate">
              {hostname}
            </span>
          </div>
          <h3 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-gray-900 transition-colors mb-2">
            {content.title ?? metadata?.title}
          </h3>
          <p
            className={`text-sm text-gray-600 ${generateTextClamp(
              size
            )} group-hover:text-gray-700 transition-colors mb-4`}
          >
            {metadata?.description || content.description}
          </p>
          <div className="mt-auto pt-2 text-xs text-gray-400 flex items-center gap-2">
            <SquareArrowOutUpRight size={15} />
            <span>Visit site</span>
          </div>
        </div>
      </div>
    </a>
  );
}
