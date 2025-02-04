import { SocialLink } from "@prisma/client";
import { socialPlatformConfigs } from "@/types/social";

interface SocialLinkVisualizerProps {
  socialLinks: SocialLink[];
}

export function SocialLinkVisualizer({
  socialLinks,
}: SocialLinkVisualizerProps) {
  if (!socialLinks || socialLinks.length === 0) return null;

  return (
    <div className="flex justify-start items-center gap-3">
      {socialLinks.map((link) => {
        const platform = socialPlatformConfigs.find(
          (p) => p.id === link.platform
        );
        if (!platform) return null;
        const Icon = platform.icon;

        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
            style={{ color: platform.color }}
          >
            <Icon className="w-6 h-6" />
          </a>
        );
      })}
    </div>
  );
}
