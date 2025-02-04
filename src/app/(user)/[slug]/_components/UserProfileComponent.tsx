"use client";

import { SocialLink, User, UserProfile } from "@prisma/client";
import { socialPlatformConfigs } from "@/types/social";
import Image from "next/image";

interface UserProfileComponentProps {
  user: User & {
    UserProfile: (UserProfile & { socialLinks: SocialLink[] }) | null;
  };
}

export function UserProfileComponent({ user }: UserProfileComponentProps) {
  return (
    <div className="flex gap-8 p-12 w-full mx-auto">
      {/* Left Section - Profile */}
      <div className="flex-1 w-full space-y-6">
        <div className="space-y-4 flex flex-col justify-start items-start w-full">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-52 h-52 rounded-full overflow-hidden bg-gray-100">
              {user.image ? (
                <Image
                  src={user.image}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              {user.UserProfile?.displayName}
            </h1>
          </div>

          {/* Bio */}
          <div>
            <p className="text-gray-600">
              {user.UserProfile?.bio || "This user has not set a bio yet."}
            </p>
          </div>

          {/* Social Links */}
          {user.UserProfile?.socialLinks &&
            user.UserProfile.socialLinks.length > 0 && (
              <div className="flex justify-start items-center gap-3">
                {user.UserProfile.socialLinks.map((link) => {
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
            )}
        </div>
      </div>
      {/* Right Section - Grid */}
      <div className="flex-[2] max-h-screen overflow-hidden p-3">
        
      </div>
    </div>
  );
}
