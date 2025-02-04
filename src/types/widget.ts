import { JsonObject } from "@prisma/client/runtime/library";

export enum WidgetSize {
  SMALL = "SMALL", // 1x1 (3 columns)
  MEDIUM = "MEDIUM", // 2x1 (6 columns)
  LARGE = "LARGE", // 2x2 (6 columns, 2 rows)
  WIDE = "WIDE", // 3x1 (9 columns)
  EXTRA_LARGE = "EXTRA_LARGE", // 3x2 (9 columns, 2 rows)
}

export enum WidgetType {
  TEXT = "text",
  LINK = "link",
  IMAGE = "image",
  EMBED = "embed",
  SOCIAL = "social",
}

export interface Widget {
  id: string;
  type: WidgetType;
  size: WidgetSize;
  position: number;
  content: WidgetContent;
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
  alt?: string;
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
