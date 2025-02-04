import { TextWidget } from "./TextWidget";
import { LinkWidget } from "./LinkWidget";
import { ImageWidget } from "./ImageWidget";
import { EmbedWidget } from "./EmbedWidget";
import { SocialWidget } from "./SocialWidget";
import { Widget, WIDGET_TYPE } from "@prisma/client";
import {
  EmbedContent,
  ImageContent,
  LinkContent,
  SocialContent,
  TextContent,
} from "@/types/widget";

export function WidgetContent({ widget }: { widget: Widget }) {
  switch (widget.type) {
    case WIDGET_TYPE.TEXT:
      return <TextWidget content={widget.content as TextContent} />;
    case WIDGET_TYPE.LINK:
      return <LinkWidget content={widget.content as LinkContent} />;
    case WIDGET_TYPE.IMAGE:
      return <ImageWidget content={widget.content as ImageContent} />;
    case WIDGET_TYPE.EMBED:
      return <EmbedWidget content={widget.content as EmbedContent} />;
    case WIDGET_TYPE.SOCIAL:
      return <SocialWidget content={widget.content as SocialContent} />;
    default:
      return null;
  }
}
