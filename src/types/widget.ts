import { WIDGET_SIZE } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";

export enum WidgetSize {
  SMALL = "SMALL", // 1x1 (3 columns)
  MEDIUM = "MEDIUM", // 2x1 (6 columns)
  LARGE = "LARGE", // 2x2 (6 columns, 2 rows)
  WIDE = "WIDE", // 3x1 (9 columns)
  EXTRA_LARGE = "EXTRA_LARGE", // 3x2 (9 columns, 2 rows)
}

export enum WidgetType {
  TEXT = "TEXT",
  LINK = "LINK",
  IMAGE = "IMAGE",
  EMBED = "EMBED",
  SOCIAL = "SOCIAL",
}

export interface TextWidget {
  id: string;
  text: string;
  color: string | null;
  widgetId: string;
}

export interface LinkWidget {
  id: string;
  title: string;
  url: string;
  widgetId: string;
  description: string | null;
  thumbnail: string | null;
}

export interface ImageWidget {
  id: string;
  url: string;
  alt: string | null;
  widgetId: string;
}

export interface EmbedWidget {
  id: string;
  embedUrl: string;
  type: string;
  widgetId: string;
}

export interface SocialWidget {
  id: string;
  platform: string;
  username: string;
  widgetId: string;
}

export interface TextContent extends JsonObject {
  text: string;
  color?: string;
}

export interface LinkContent extends JsonObject {
  url: string;
  title: string;
  description?: string;
  thumbnail?: string;
}

export interface ImageContent extends JsonObject {
  url: string;
  alt?: string | null;
}

export interface EmbedContent extends JsonObject {
  embedUrl: string;
  type: "youtube" | "spotify" | "other";
}

export interface SocialContent extends JsonObject {
  platform: string;
  username: string;
  profileUrl: string;
}

export type WidgetContent =
  | TextContent
  | LinkContent
  | ImageContent
  | EmbedContent
  | SocialContent;

export const getWidgetSizeClass = (size: WIDGET_SIZE): string => {
  switch (size) {
    case WIDGET_SIZE.SMALL:
      return "w-[180px] h-[180px]";
    case WIDGET_SIZE.MEDIUM:
      return "w-[360px] h-[360px]";
    case WIDGET_SIZE.LARGE:
      return "w-[540px] h-[180px]";
    case WIDGET_SIZE.WIDE:
      return "w-[720px] h-[180px]";
    case WIDGET_SIZE.EXTRA_LARGE:
      return "w-[720px] h-[360px]";
    default:
      return "w-[180px] h-[180px]";
  }
};
