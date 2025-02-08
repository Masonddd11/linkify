import { SocialContent } from "@prisma/client";
import { socialPlatformConfigs } from "@/types/social";
import { Button } from "@/components/ui/button";

export function SocialWidget({ content }: { content: SocialContent }) {
  const platform = socialPlatformConfigs.find((p) => p.id === content.platform);
  const Icon = platform?.icon;

  if (!platform || !Icon) {
    return null;
  }

  return (
    <a
      href={content.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full h-full flex flex-col items-center justify-center p-6 hover:bg-accent/50 transition-colors rounded-lg group"
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <div
          className="p-4 rounded-xl transition-colors"
          style={{ backgroundColor: `${platform.color}15` }}
        >
          <Icon
            className="w-8 h-8 transition-colors"
            style={{ color: platform.color }}
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-base font-medium group-hover:text-accent-foreground">
            {platform.name}
          </span>
          <span className="text-sm text-muted-foreground">
            {content.username || "@" + content.profileUrl.split("/").pop()}
          </span>
        </div>
        <Button
          className="w-full mt-2 hover:bg-[var(--hover-color)] transition-colors"
          style={
            {
              backgroundColor: platform.color,
              color: "white",
              "--hover-color": platform.color + "CC",
            } as React.CSSProperties
          }
        >
          Follow on {platform.name}
        </Button>
      </div>
    </a>
  );
}
