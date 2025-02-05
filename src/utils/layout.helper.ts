import { Layout } from "react-grid-layout";
import { WIDGET_SIZE, Widget } from "@prisma/client";

// Define the layout for different breakpoints
export const getDefaultLayout = (
  widgets: Widget[],
  edit: boolean
): { [key: string]: Layout[] } => {
  const generateLayout = (columnCount: number): Layout[] => {
    let currentY = 0;
    let currentX = 0;

    return widgets.map((widget) => {
      let w = 1; // default width in column units
      let h = 1; // default height in row units

      // Set size based on widget type
      switch (widget.size) {
        case WIDGET_SIZE.SMALL_SQUARE:
          if (columnCount === 3) {
            w = 1; // 1/3 width on large screens
          } else if (columnCount === 2) {
            w = 1; // 1/2 width on medium/small screens
          }
          h = 1;
          break;
        case WIDGET_SIZE.LARGE_SQUARE:
          if (columnCount === 3) {
            w = 2; // 2/3 width on large screens
          } else if (columnCount === 2) {
            w = 2; // full width on medium/small screens
          }
          h = 2;
          break;
        case WIDGET_SIZE.WIDE:
          w = columnCount; // full width
          h = 1;
          break;
        case WIDGET_SIZE.LONG:
          if (columnCount === 3) {
            w = 2; // 2/3 width on large screens
          } else if (columnCount === 2) {
            w = 2; // full width on medium/small screens
          }
          h = 2;
          break;
        default:
          w = 1;
          h = 1;
      }

      // Reset x and increment y when we reach the end of a row
      if (currentX + w > columnCount) {
        currentX = 0;
        currentY += h;
      }

      const layout = {
        i: widget.id,
        x: currentX,
        y: currentY,
        w,
        h,
        static: true,
        isDraggable: edit ? true : false,
        isResizable: false,
      };

      // Update x position for next widget
      currentX += w;

      // If this widget spans multiple rows, update currentY
      if (h > 1) {
        currentY += h - 1;
      }

      return layout;
    });
  };

  return {
    xl: generateLayout(3),
    lg: generateLayout(3),
    md: generateLayout(3),
    sm: generateLayout(2),
    xs: generateLayout(2),
  };
};
