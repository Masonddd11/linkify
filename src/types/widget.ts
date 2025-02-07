import { WIDGET_SIZE, PLATFORM } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";

export enum WidgetSize {
  SMALL_SQUARE = "SMALL_SQUARE", // 2x2 (4 columns)
  LARGE_SQUARE = "LARGE_SQUARE", // 4x4 (8 columns)
  WIDE = "WIDE", // 6x2 (12 columns, short)
  LONG = "LONG", // 4x6 (8 columns, tall)
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
  platform: PLATFORM;
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
    case WIDGET_SIZE.SMALL_SQUARE:
      return "w-[240px] h-[240px]";
    case WIDGET_SIZE.LARGE_SQUARE:
      return "w-[480px] h-[480px]";
    case WIDGET_SIZE.WIDE:
      return "w-[720px] h-[240px]";
    case WIDGET_SIZE.LONG:
      return "w-[480px] h-[720px]";
    default:
      return "w-[240px] h-[240px]";
  }
};
