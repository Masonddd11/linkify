"use client";

import { useEffect, useState } from "react";
import { PLATFORM } from "@prisma/client";
import { socialPlatformConfigs } from "@/types/social";
import { useSocialLinks } from "../_hooks/useSocialLinks";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
const socialPlatforms = socialPlatformConfigs.map((config) => ({
  ...config,
  icon: <config.icon className="w-6 h-6" />,  
}));

export function SocialLinksSettings() {
  const { data: existingLinks, isLoading, updateSocialLinks } = useSocialLinks();
  const [selectedPlatforms, setSelectedPlatforms] = useState<PLATFORM[]>([]);
  const [links, setLinks] = useState<Partial<Record<PLATFORM, string>>>({});

  const router = useRouter();

  useEffect(() => {
    if (existingLinks) {
      const platforms: PLATFORM[] = [];
      const linkValues: Partial<Record<PLATFORM, string>> = {};
      
      existingLinks.forEach(link => {
        platforms.push(link.platform);
        linkValues[link.platform] = link.handle;
      });
      
      setSelectedPlatforms(platforms);
      setLinks(linkValues);
    }
  }, [existingLinks]);

  const handlePlatformSelect = (platformId: PLATFORM) => {
    if (!selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
      setLinks({ ...links, [platformId]: "" });
    }
  };

  const handleLinkChange = (platformId: PLATFORM, value: string) => {
    const cleanValue = value.startsWith("@") ? value.slice(1) : value;
    setLinks({ ...links, [platformId]: cleanValue });
  };

  const handleRemovePlatform = (platformId: PLATFORM) => {
    setSelectedPlatforms(selectedPlatforms.filter((id) => id !== platformId));
    const newLinks = { ...links };
    delete newLinks[platformId];
    setLinks(newLinks);
  };

  const handleSave = async () => {
    try {
      const socialLinks = Object.entries(links)
        .filter(([, handle]) => handle.trim() !== "")
        .map(([platform, handle]) => {
          const platformConfig = socialPlatforms.find((p) => p.id === platform);
          if (!platformConfig) {
            throw new Error(`Platform ${platform} configuration not found`);
          }

          const username = handle.trim();
          const url = platformConfig.urlPattern.replace("{username}", username);

          return {
            platform: platform as PLATFORM,
            url,
            handle: username,
          };
        });

      const socialLinksRecord = socialLinks.reduce((acc, { platform, url, handle }) => {
        acc[platform] = { url, handle };
        return acc;
      }, {} as Record<string, { url: string; handle: string }>);

      await updateSocialLinks({ links: socialLinksRecord });
      router.refresh();
      toast.success("Social links updated successfully!");
    } catch (error) {
      console.error("Error saving social links:", error);
      toast.error("Failed to update social links");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
      <div className="p-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Social Links</h2>
          <p className="text-sm text-gray-500">
            Connect your social media accounts to your profile.
          </p>
        </div>
      </div>

      <div className="p-6">
        {/* Selected Platforms */}
        <div className="space-y-4">
          {selectedPlatforms.map((platformId) => {
            const platform = socialPlatforms.find((p) => p.id === platformId)!;
            return (
              <div
                key={platformId}
                className="relative group flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
              >
                <div style={{ color: platform.color }}>{platform.icon}</div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={platform.placeholder}
                    value={links[platformId] || ""}
                    onChange={(e) => handleLinkChange(platformId, e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400"
                  />
                </div>
                <button
                  onClick={() => handleRemovePlatform(platformId)}
                  className="opacity-0 group-hover:opacity-100 absolute right-2 p-2 text-gray-400 hover:text-gray-600 transition-opacity"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        {/* Add Platform Button */}
        {socialPlatforms.filter((platform) => !selectedPlatforms.includes(platform.id)).length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Add more platforms</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {socialPlatforms
                .filter((platform) => !selectedPlatforms.includes(platform.id))
                .map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformSelect(platform.id)}
                    className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                  >
                    <div style={{ color: platform.color }}>{platform.icon}</div>
                    <span className="text-sm text-gray-600">{platform.name}</span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
