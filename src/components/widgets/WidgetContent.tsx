import { TextWidget } from "./TextWidget";
import { LinkWidget } from "./LinkWidget";
import { ImageWidget } from "./ImageWidget";
import { EmbedWidget } from "./EmbedWidget";
import { SocialWidget } from "./SocialWidget";
import { type Prisma, WIDGET_TYPE, WIDGET_SIZE } from "@prisma/client";
import { FaTrash } from "react-icons/fa";
import { MdOutlineDragIndicator } from "react-icons/md";

interface WidgetContentProps {
  edit: boolean;
  onDelete?: (widgetId: string) => void;
  onResize?: (widgetId: string, newSize: WIDGET_SIZE) => void;
  widget: Prisma.WidgetGetPayload<{
    include: {
      textContent: true;
      linkContent: true;
      imageContent: true;
      embedContent: true;
      socialContent: true;
    };
  }>;
  size: WIDGET_SIZE;
}

const ResizeIcon = ({ type }: { type: WIDGET_SIZE }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="white"
    strokeWidth="1.5"
  >
    {type === WIDGET_SIZE.SMALL_SQUARE && (
      <rect x="6" y="6" width="8" height="8" />
    )}
    {type === WIDGET_SIZE.LARGE_SQUARE && (
      <rect x="3" y="3" width="14" height="14" />
    )}
    {type === WIDGET_SIZE.WIDE && <rect x="3" y="6" width="14" height="8" />}
    {type === WIDGET_SIZE.LONG && <rect x="6" y="3" width="8" height="14" />}
  </svg>
);

export function WidgetContent({
  widget,
  edit,
  onDelete,
  onResize,
  size,
}: WidgetContentProps) {
  const handleDeleteWidget = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!widget.id || !onDelete) return;
    onDelete(widget.id);
  };

  const handleResize = (e: React.MouseEvent, newSize: WIDGET_SIZE) => {
    e.stopPropagation();
    if (!widget.id || !onResize) return;
    onResize(widget.id, newSize);
  };

  const renderResizeButtons = () => {
    const buttonClass =
      "p-1 hover:bg-gray-700 rounded transition-colors duration-200";
    const sizes = [
      WIDGET_SIZE.SMALL_SQUARE,
      WIDGET_SIZE.LARGE_SQUARE,
      WIDGET_SIZE.WIDE,
      WIDGET_SIZE.LONG,
    ];

    return sizes.map((size) => (
      <button
        key={size}
        onClick={(e) => handleResize(e, size)}
        onMouseDown={(e) => e.stopPropagation()}
        className={`${buttonClass} ${
          widget.size === size ? "bg-gray-700" : ""
        }`}
        title={`Resize to ${size.toLowerCase().replace("_", " ")}`}
      >
        <ResizeIcon type={size} />
      </button>
    ));
  };

  return (
    <div
      className={`relative w-full h-full group transition-all duration-300 ease-in-out ${
        widget.size === WIDGET_SIZE.SMALL_SQUARE
          ? "col-span-1 row-span-1"
          : widget.size === WIDGET_SIZE.LARGE_SQUARE
          ? "col-span-2 row-span-2"
          : widget.size === WIDGET_SIZE.WIDE
          ? "col-span-2 row-span-1"
          : widget.size === WIDGET_SIZE.LONG
          ? "col-span-1 row-span-2"
          : ""
      }`}
    >
      {(() => {
        switch (widget.type) {
          case WIDGET_TYPE.TEXT:
            if (!widget.textContent) return null;
            return <TextWidget widget={widget} edit={edit} />;
          case WIDGET_TYPE.LINK:
            if (!widget.linkContent) return null;
            return (
              <LinkWidget
                content={widget.linkContent}
                edit={edit}
                size={size}
              />
            );
          case WIDGET_TYPE.IMAGE:
            if (!widget.imageContent) return null;
            return <ImageWidget content={widget.imageContent} />;
          case WIDGET_TYPE.EMBED:
            if (!widget.embedContent) return null;
            return <EmbedWidget content={widget.embedContent} />;
          case WIDGET_TYPE.SOCIAL:
            if (!widget.socialContent) return null;
            return <SocialWidget content={widget.socialContent} edit={edit} />;
          default:
            return null;
        }
      })()}
      {/* Widget Controls */}
      {edit && (
        <>
          {/* Delete button - increased z-index */}
          <button
            onClick={handleDeleteWidget}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute -right-2 -top-2 z-[9999] p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200/50 opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all duration-200 hover:scale-110 text-gray-500 hover:text-red-500"
            aria-label="Delete widget"
          >
            <FaTrash size={14} />
          </button>
          {/* Resize tools - increased z-index */}
          <div
            className="absolute -bottom-3 left-1/2 z-[9999] transform -translate-x-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center bg-black rounded-full px-1 py-1">
              {renderResizeButtons()}
            </div>
          </div>
          {/* Drag handle - increased z-index */}
          <div
            className="absolute top-2 left-2 z-[9999] opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-move"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <MdOutlineDragIndicator size={20} className="text-gray-400" />
          </div>
        </>
      )}
    </div>
  );
}
