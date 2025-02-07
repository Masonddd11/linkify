import { TextWidget } from "./TextWidget";
import { LinkWidget } from "./LinkWidget";
import { ImageWidget } from "./ImageWidget";
import { EmbedWidget } from "./EmbedWidget";
import { SocialWidget } from "./SocialWidget";
import { Prisma, WIDGET_TYPE } from "@prisma/client";

export function WidgetContent({
  widget,
  edit,
}: {
  edit: boolean;
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
  switch (widget.type) {
    case WIDGET_TYPE.TEXT:
      if (!widget.textContent) return null;
      return <TextWidget content={widget.textContent} edit={edit} />;
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
}
