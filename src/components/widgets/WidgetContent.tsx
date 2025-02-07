import { TextWidget } from "./TextWidget";
import { LinkWidget } from "./LinkWidget";
import { ImageWidget } from "./ImageWidget";
import { EmbedWidget } from "./EmbedWidget";
import { SocialWidget } from "./SocialWidget";
import { Prisma, WIDGET_TYPE } from "@prisma/client";
import { FaTrash } from "react-icons/fa";

export function WidgetContent({
  widget,
  edit,
  onDelete,
}: {
  edit: boolean;
  onDelete?: (widgetId: string) => void;
  widget: Prisma.WidgetGetPayload<{
    include: {
      textContent: true;
      linkContent: true;
      imageContent: true;
      embedContent: true;
      socialContent: true;
    };
  }>;
}) {
  const handleDeleteWidget = () => {
    if (!widget.id || !onDelete) return;
    onDelete(widget.id);
  };

  return (
    <div className="relative w-full h-full">
      {(() => {
        switch (widget.type) {
          case WIDGET_TYPE.TEXT:
            if (!widget.textContent) return null;
            return <TextWidget widget={widget} edit={edit} />;
          case WIDGET_TYPE.LINK:
            if (!widget.linkContent) return null;
            return <LinkWidget content={widget.linkContent} />;
          case WIDGET_TYPE.IMAGE:
            if (!widget.imageContent) return null;
            return <ImageWidget content={widget.imageContent} />;
          case WIDGET_TYPE.EMBED:
            if (!widget.embedContent) return null;
            return <EmbedWidget content={widget.embedContent} />;
          case WIDGET_TYPE.SOCIAL:
            if (!widget.socialContent) return null;
            return <SocialWidget content={widget.socialContent} />;
          default:
            return null;
        }
      })()}
      {/* Delete button */}
      {edit && (
        <button
          onClick={handleDeleteWidget}
          className="absolute -right-2 -top-2  z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200/50 opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all duration-200 hover:scale-110 text-gray-500 hover:text-red-500"
          aria-label="Delete widget"
        >
          <FaTrash size={14} />
        </button>
      )}
    </div>
  );
}
