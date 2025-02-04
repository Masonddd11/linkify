"use client";

import { SocialLink, User, UserProfile, Widget } from "@prisma/client";
import { WidgetContent } from "@/components/widgets/WidgetContent";
import { WIDGET_SIZE } from "@prisma/client";
import Image from "next/image";
import { SocialLinkVisualizer } from "@/components/SocialLinkVisualizer";
import EditTooltip from "./EditToolTip";

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

export function UserProfileComponent({
  user,
  isMyLink,
  edit,
}: UserProfileComponentProps) {
  return (
    <div className="flex gap-8 p-12 w-full mx-auto relative min-h-screen">
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
          {user.UserProfile?.socialLinks && (
            <SocialLinkVisualizer socialLinks={user.UserProfile.socialLinks} />
          )}
        </div>
      </div>
      {/* Right Section - Grid */}
      <div className="flex-[2] max-h-screen overflow-y-auto p-3">
        <div className="grid grid-cols-12 auto-rows-[120px] gap-4">
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

      {/* Edit Tooltip */}
      {isMyLink && (
        <div className="fixed bottom-8 right-1/2 translate-x-1/2 ">
          <EditTooltip />
        </div>
      )}
    </div>
  );
}
