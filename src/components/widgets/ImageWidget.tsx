"use client";

import { ImageContent } from "@prisma/client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import React from "react";

interface ImageWidgetProps {
  content: ImageContent;
  edit?: boolean;
}

export function ImageWidget({ content, edit }: ImageWidgetProps) {
  return (
    <div
      className={cn(
        "w-full h-full relative overflow-hidden rounded-lg group",
        edit && "cursor-pointer"
      )}
    >
      <div
        className={cn(
          "w-full h-full relative overflow-hidden rounded-lg",
          edit && "pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-200" />
        {content.url ? (
          <>
            <Image
              src={content.url}
              alt={content.alt || "Image"}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {content.alt && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                <p className="text-white text-sm font-medium truncate">
                  {content.alt}
                </p>
              </div>
            )}
          </>
        ) : edit ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p className="text-gray-500 text-sm">No images yet</p>
          </div>
        ) : null}
      </div>

      {!edit && content.url && (
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}
