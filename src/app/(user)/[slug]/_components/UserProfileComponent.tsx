"use client";

import { SocialLink, User, UserProfile, Widget } from "@prisma/client";
import { WidgetContent } from "@/components/widgets/WidgetContent";
import { WIDGET_SIZE } from "@prisma/client";
import { SocialLinkVisualizer } from "@/components/SocialLinkVisualizer";
import EditTooltip from "./EditToolTip";
import { ProfileImageUpload } from "./ProfileImageUpload";
import { useEffect, useRef } from "react";
import useUpdateUserInfo from "../_hooks/useUpdateUserInfo";
import { Loader2 } from "lucide-react";
import React from "react";
import { AddWidgetButton } from "./AddWidgetButton";

interface UserProfileComponentProps {
  user: User & {
    UserProfile:
      | (UserProfile & { socialLinks: SocialLink[]; widgets: Widget[] })
      | null;
  };
  isMyLink: boolean;
  edit: boolean;
}

const getWidgetSizeClass = (size: WIDGET_SIZE): string => {
  switch (size) {
    case WIDGET_SIZE.SMALL:
      return "col-span-3 row-span-1";
    case WIDGET_SIZE.MEDIUM:
      return "col-span-6 row-span-1";
    case WIDGET_SIZE.LARGE:
      return "col-span-6 row-span-2";
    case WIDGET_SIZE.WIDE:
      return "col-span-9 row-span-1";
    case WIDGET_SIZE.EXTRA_LARGE:
      return "col-span-9 row-span-2";
    default:
      return "col-span-3 row-span-1";
  }
};

export const UserProfileComponent: React.FC<UserProfileComponentProps> = ({
  user,
  isMyLink,
  edit,
}) => {
  const {
    name: displayName,
    bio,
    handleNameChange,
    handleBioChange,
    handleSave,
    isLoading,
  } = useUpdateUserInfo(
    user.UserProfile?.displayName || "",
    user.UserProfile?.bio || "",
    user.id
  );

  const bioTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = bioTextareaRef.current;
    if (textarea && edit) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [bio, edit]);

  useEffect(() => {
    if (edit) {
      handleSave();
    }
  }, [displayName, bio, edit, handleSave]);

  return (
    <div className="flex gap-8 p-12 w-full mx-auto relative min-h-screen">
      {/* Left Section - Profile */}
      <div className="flex-1 w-full space-y-6">
        <div className="space-y-4 flex flex-col justify-start items-start w-full">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center space-y-4">
            <ProfileImageUpload currentImage={user.image} edit={edit} />
          </div>

          {/* Display Name */}
          <div className="w-full relative">
            {edit ? (
              <>
                <input
                  value={displayName}
                  onChange={handleNameChange}
                  className="ring-0 text-4xl font-bold text-gray-800 outline-none focus:border-transparent focus:ring-0 w-full"
                  disabled={isLoading}
                />
                {isLoading && (
                  <Loader2 className="absolute right-0 top-1/2 -translate-y-1/2 animate-spin text-gray-500" />
                )}
              </>
            ) : (
              <h1 className="text-4xl font-bold text-gray-800 break-words">
                {user.UserProfile?.displayName}
              </h1>
            )}
          </div>

          {/* Bio */}
          <div className="w-full relative">
            {edit ? (
              <>
                <textarea
                  ref={bioTextareaRef}
                  value={bio || ""}
                  onChange={handleBioChange}
                  className="ring-0 text-gray-600 outline-none focus:border-transparent focus:ring-0 w-full resize-none overflow-hidden min-h-[24px]"
                  rows={1}
                  disabled={isLoading}
                  placeholder="Tell us about yourself"
                />
                {isLoading && (
                  <Loader2 className="absolute right-0 top-1/2 -translate-y-1/2 animate-spin text-gray-500" />
                )}
              </>
            ) : (
              <p className="text-gray-600 whitespace-pre-wrap break-words">
                {user.UserProfile?.bio || "This user has not set a bio yet."}
              </p>
            )}
          </div>

          {/* Social Links */}
          {user.UserProfile?.socialLinks && (
            <SocialLinkVisualizer socialLinks={user.UserProfile.socialLinks} />
          )}
        </div>
      </div>
      {/* Right Section - Grid */}
      <div className="flex-[2] min-h-screen overflow-y-auto p-3">
        <div className="grid grid-cols-12 auto-rows-[1fr] gap-4">
          {user.UserProfile?.widgets?.map((widget: Widget) => (
            <div
              key={widget.id}
              className={`
                ${getWidgetSizeClass(widget.size)}
                bg-white rounded-lg border border-gray-200 
                shadow-sm hover:border-gray-300 
                hover:scale-[1.02] transition-all duration-200
                overflow-hidden
              `}
            >
              <WidgetContent widget={widget} />
            </div>
          ))}
        </div>
      </div>

      {/* Edit Tooltip and Add Widget Button */}
      {isMyLink && (
        <>
          <div className="fixed bottom-8 right-1/2 translate-x-1/2">
            <EditTooltip edit={edit} />
          </div>
        </>
      )}
    </div>
  );
};
