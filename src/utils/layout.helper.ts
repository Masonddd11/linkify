import { Layout } from "react-grid-layout";
import { Prisma, WIDGET_SIZE } from "@prisma/client";

// Define the layout for different breakpoints
export const getLayout = (
  widgets: Prisma.WidgetGetPayload<{ include: { layout: true } }>[],
  edit: boolean
): { lg: Layout[] } => {
  const generateLayout = (columnCount: number): Layout[] => {
    // Initialize a grid to track occupied spaces
    const grid: boolean[][] = [];
    const layouts: Layout[] = [];

    // Helper function to check if a space is available
    const isSpaceAvailable = (
      x: number,
      y: number,
      w: number,
      h: number
    ): boolean => {
      for (let i = y; i < y + h; i++) {
        for (let j = x; j < x + w; j++) {
          if (!grid[i]) grid[i] = [];
          if (grid[i][j]) return false;
        }
      }
      return true;
    };

    const occupySpace = (x: number, y: number, w: number, h: number) => {
      for (let i = y; i < y + h; i++) {
        for (let j = x; j < x + w; j++) {
          if (!grid[i]) grid[i] = [];
          grid[i][j] = true;
        }
      }
    };

    widgets.forEach((widget) => {
      // Use saved layout if available
      if (widget.layout) {
        layouts.push({
          i: widget.id,
          x: widget.layout.x,
          y: widget.layout.y,
          w: widget.layout.w,
          h: widget.layout.h,
          isDraggable: edit,
          isResizable: false,
        });
        occupySpace(
          widget.layout.x,
          widget.layout.y,
          widget.layout.w,
          widget.layout.h
        );
        return;
      }
      let w = 1; // default width
      let h = 1; // default height

      // Set size based on widget type
      switch (widget.size) {
        case WIDGET_SIZE.SMALL_SQUARE:
          w = 1;
          h = 1;
          break;
        case WIDGET_SIZE.LARGE_SQUARE:
          w = Math.min(2, columnCount);
          h = 2;
          break;
        case WIDGET_SIZE.WIDE:
          w = Math.min(columnCount, 3);
          h = 1;
          break;
        case WIDGET_SIZE.LONG:
          w = Math.min(1, columnCount);
          h = 2; // Make it taller than LARGE_SQUARE
          break;
        default:
          w = 1;
          h = 1;
      }

      // Find the first available space
      let placed = false;
      let y = 0;

      while (!placed) {
        for (let x = 0; x <= columnCount - w; x++) {
          if (isSpaceAvailable(x, y, w, h)) {
            occupySpace(x, y, w, h);
            layouts.push({
              i: widget.id,
              x,
              y,
              w,
              h,
              isDraggable: edit,
              isResizable: false,
            });
            placed = true;
            break;
          }
        }
        if (!placed) y++;
      }
    });

    return layouts;
  };

  return {
    lg: generateLayout(3),
  };
};
