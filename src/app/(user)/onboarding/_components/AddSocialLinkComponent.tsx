"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { saveSocialLinks } from "../_actions";
import { PLATFORM } from "@prisma/client";
import { socialPlatformConfigs } from "@/types/social";

const socialPlatforms = socialPlatformConfigs.map((config) => ({
  ...config,
  icon: <config.icon className="w-6 h-6" />,
}));

interface AddSocialLinkComponentProps {
  setOnBoardStep: (step: number) => void;
}

export function AddSocialLinkComponent({
  setOnBoardStep,
}: AddSocialLinkComponentProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<PLATFORM[]>([]);
  const [links, setLinks] = useState<Partial<Record<PLATFORM, string>>>({});

  const handlePlatformSelect = (platformId: PLATFORM) => {
    if (!selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
      setLinks({ ...links, [platformId]: "" });
    }
  };

  const handleLinkChange = (platformId: PLATFORM, value: string) => {
    setLinks({ ...links, [platformId]: value });
  };

  const handleRemovePlatform = (platformId: PLATFORM) => {
    setSelectedPlatforms(selectedPlatforms.filter((id) => id !== platformId));
    const newLinks = { ...links };
    delete newLinks[platformId];
    setLinks(newLinks);
  };

  const handleContinue = async () => {
    try {
      // Convert links to the format expected by the API
      const socialLinks = Object.entries(links)
        .filter(([, handle]) => handle.trim() !== "")
        .map(([platform, handle]) => {
          const platformConfig = socialPlatforms.find((p) => p.id === platform);
          if (!platformConfig) {
            throw new Error(`Platform ${platform} configuration not found`);
          }

          const cleanHandle = handle.replace("@", "").trim();
          let url = handle;

          if (!handle.startsWith("http")) {
            url = platformConfig.urlPattern.replace("{username}", cleanHandle);
          }

          return {
            platform: platform as PLATFORM,
            url: url.startsWith("https://") ? url : `https://${url}`,
          };
        });

      // Convert array to Record<string, string>
      const socialLinksRecord = socialLinks.reduce((acc, { platform, url }) => {
        acc[platform] = url;
        return acc;
      }, {} as Record<string, string>);

      // Save social links
      const [response, error] = await saveSocialLinks({
        links: socialLinksRecord,
      });

      if (error) {
        throw error;
      }

      if (!response.success) {
        throw new Error(response.message);
      }

      // Move to next step
      setOnBoardStep(3);
    } catch (error) {
      console.error("Error saving social links:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save social links"
      );
    }
  };

  return (
    <div className="flex w-full gap-8 px-4 max-w-6xl mx-auto">
      {/* Left Section - Form */}
      <div className="flex-1 max-w-md">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Add your social media accounts
            </h2>
            <p className="text-gray-500">
              Connect your social media accounts to your Linkify page.
            </p>
          </div>

          {/* Selected Platforms */}
          <div className="space-y-4">
            {selectedPlatforms.map((platformId) => {
              const platform = socialPlatforms.find(
                (p) => p.id === platformId
              )!;
              return (
                <div
                  key={platformId}
                  className="relative group flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-gray-300 transition-all"
                >
                  <div style={{ color: platform.color }}>{platform.icon}</div>
                  <input
                    type="text"
                    placeholder={platform.placeholder}
                    value={links[platformId]}
                    onChange={(e) =>
                      handleLinkChange(platformId, e.target.value)
                    }
                    className="flex-1 bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400"
                  />
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {socialPlatforms
              .filter((platform) => !selectedPlatforms.includes(platform.id))
              .map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handlePlatformSelect(platform.id)}
                  className="flex items-center justify-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                >
                  <div style={{ color: platform.color }}>{platform.icon}</div>
                  <span className="text-sm text-gray-600">{platform.name}</span>
                </button>
              ))}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            Continue
          </button>

          {/* Skip Link */}
          <button
            onClick={() => setOnBoardStep(4)}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Right Section - Preview */}
      <div className="flex-1 sticky top-4 hidden lg:block">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-sm mx-auto">
          {/* Phone Frame */}
          <div className="relative aspect-[9/19] bg-gray-50 p-4">
            {/* Preview Content */}
            <div className="space-y-4">
              {/* Profile Section */}
              <div className="text-center space-y-2">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
                <div className="h-3 w-48 bg-gray-100 rounded mx-auto"></div>
              </div>

              {/* Social Links Preview */}
              <div className="space-y-3">
                {selectedPlatforms.map((platformId) => {
                  const platform = socialPlatforms.find(
                    (p) => p.id === platformId
                  )!;
                  const link = links[platformId];
                  return (
                    <div
                      key={platformId}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div style={{ color: platform.color }}>
                        {platform.icon}
                      </div>
                      <span className="text-sm text-gray-600">
                        {link || platform.placeholder}
                      </span>
                    </div>
                  );
                })}
                {selectedPlatforms.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    Add social links to see preview
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
