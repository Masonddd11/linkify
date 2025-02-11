"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { saveSocialLinks } from "../_actions";
import { PLATFORM } from "@prisma/client";
import { socialPlatformConfigs } from "@/types/social";
import { ContinueButton } from "./ContinueButton";

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
  const [errors, setErrors] = useState<Partial<Record<PLATFORM, string>>>({});

  const [isAdding, setIsAdding] = useState(false);

  const handlePlatformSelect = (platformId: PLATFORM) => {
    if (!selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
      setLinks({ ...links, [platformId]: "" });
    }
  };

  const validateHandle = (
    platformId: PLATFORM,
    handle: string
  ): string | null => {
    if (!handle) return null; // Empty handle is valid (optional)

    // Basic validation: must have at least 1 character
    if (handle.length < 1) return "Handle is required";

    // Only allow letters, numbers, underscores, and dots
    const username = handle; // Use handle directly
    if (!/^[a-zA-Z0-9._]+$/.test(username)) {
      return "Handle can only contain letters, numbers, dots, and underscores";
    }

    // Platform-specific validations
    switch (platformId) {
      case PLATFORM.TWITTER:
        if (username.length > 15)
          return "Twitter handle must be 15 characters or less";
        break;
      case PLATFORM.INSTAGRAM:
        if (username.length > 30)
          return "Instagram handle must be 30 characters or less";
        if (username.startsWith(".") || username.endsWith("."))
          return "Handle cannot start or end with a dot";
        if (username.includes(".."))
          return "Handle cannot contain consecutive dots";
        break;
      // Add more platform-specific validations as needed
    }

    return null;
  };

  const handleLinkChange = (platformId: PLATFORM, value: string) => {
    // Remove @ if user types it
    const cleanValue = value.startsWith("@") ? value.slice(1) : value;
    setLinks({ ...links, [platformId]: cleanValue });

    // Validate the new value
    const error = validateHandle(platformId, cleanValue);
    setErrors((prev) => ({
      ...prev,
      [platformId]: error || undefined,
    }));
  };

  const handleRemovePlatform = (platformId: PLATFORM) => {
    setSelectedPlatforms(selectedPlatforms.filter((id) => id !== platformId));
    const newLinks = { ...links };
    delete newLinks[platformId];
    setLinks(newLinks);
  };

  const handleContinue = async () => {
    try {
      setIsAdding(true);
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

      // Convert array to Record<string, { url: string, handle: string }>
      const socialLinksRecord = socialLinks.reduce((acc, { platform, url, handle }) => {
        acc[platform] = { url, handle };
        return acc;
      }, {} as Record<string, { url: string; handle: string }>);

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

      setIsAdding(false);
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
                  <div className="flex-1 flex flex-col">
                    <input
                      type="text"
                      placeholder={platform.placeholder}
                      value={links[platformId]}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) =>
                        handleLinkChange(platformId, e.target.value)
                      }
                      className={`w-full bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400 ${
                        errors[platformId] ? "text-red-500" : ""
                      }`}
                    />
                    {errors[platformId] && (
                      <span className="text-xs text-red-500 mt-1">
                        {errors[platformId]}
                      </span>
                    )}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
          <ContinueButton
            onClick={handleContinue}
            isDisabled={
              Object.keys(errors).some((k) => errors[k as PLATFORM]) ||
              (selectedPlatforms.length > 0 &&
                selectedPlatforms.some((p) => !links[p] || !links[p]?.trim()))
            }
            isLoading={isAdding}
            loadingText="Saving..."
          />

          {/* Skip Link */}
          <button
            onClick={() => setOnBoardStep(3)}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Right Section - Preview */}
      <div className="flex-1 sticky top-4 hidden lg:block">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-lg max-h-screen mx-auto">
          {/* Phone Frame */}
          <div className="relative aspect-[9/19] bg-gray-50 p-4">
            {/* Preview Content */}
            <div className="space-y-4">
              {/* Profile Section */}
              <div className="text-center space-y-2 flex flex-col items-start w-full">
                <div className="w-52 h-52 bg-gray-200 rounded-full animate-pulse duration-300"></div>
                <div className="h-8  bg-gray-200 rounded w-2/3 animate-pulse duration-300"></div>
                <div className="h-12 w-48 bg-gray-100 rounded animate-pulse duration-300"></div>
              </div>

              {/* Social Links Preview */}
              <div className=" flex justify-start items-center gap-3">
                {selectedPlatforms.map((platformId) => {
                  const platform = socialPlatforms.find(
                    (p) => p.id === platformId
                  )!;
                  return (
                    <div
                      key={platformId}
                      className="flex items-center justify-center"
                    >
                      <div style={{ color: platform.color }}>
                        {platform.icon}
                      </div>
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
