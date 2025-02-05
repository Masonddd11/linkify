"use client";

import { Prisma } from "@prisma/client";
import { WidgetContent } from "@/components/widgets/WidgetContent";
import { SocialLinkVisualizer } from "@/components/SocialLinkVisualizer";
import { motion } from "framer-motion";
import EditTooltip from "./EditToolTip";
import { ProfileImageUpload } from "./ProfileImageUpload";
import { useEffect, useRef, useMemo, useState } from "react";
import useUpdateUserInfo from "../_hooks/useUpdateUserInfo";
import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { AddWidgetButton } from "./AddWidgetButton";
import { getDefaultLayout } from "@/utils/layout.helper";

interface UserProfileComponentProps {
  user: Prisma.UserGetPayload<{
    include: {
      UserProfile: {
        include: {
          socialLinks: true;
          widgets: {
            include: {
              textContent: true;
              linkContent: true;
              imageContent: true;
              embedContent: true;
              socialContent: true;
            };
          };
        };
      };
    };
  }>;
  isMyLink: boolean;
  edit: boolean;
}

export const UserProfileComponent: React.FC<UserProfileComponentProps> = ({
  user,
  isMyLink,
  edit,
}) => {
  const [rowHeight, setRowHeight] = useState<number>(150);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateRowHeight = () => {
      if (gridRef.current) {
        const containerWidth = gridRef.current.offsetWidth;
        const columns =
          window.innerWidth >= 1280
            ? 4
            : window.innerWidth >= 1024
            ? 3
            : window.innerWidth >= 768
            ? 3
            : window.innerWidth >= 480
            ? 2
            : 1;
        setRowHeight(containerWidth / columns);
      }
    };

    updateRowHeight();
    window.addEventListener("resize", updateRowHeight);
    return () => window.removeEventListener("resize", updateRowHeight);
  }, []);

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
    <div className="flex-col lg:flex-row flex gap-8 p-12 w-full mx-auto relative min-h-screen">
      {/* Left Section - Profile */}
      <div className="flex-1 w-full space-y-6">
        <motion.div
          initial={edit ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 flex flex-col justify-center items-center lg:justify-start lg:items-start w-full"
        >
          {/* Profile Image Upload */}
          <motion.div
            initial={edit ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center space-y-4"
          >
            <ProfileImageUpload currentImage={user.image} edit={edit} />
          </motion.div>

          {/* Display Name */}
          <motion.div
            initial={edit ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full relative"
          >
            {edit ? (
              <>
                <input
                  value={displayName}
                  onChange={handleNameChange}
                  className="ring-0 text-4xl font-bold text-center lg:text-left text-gray-800 outline-none focus:border-transparent focus:ring-0 w-full"
                  disabled={isLoading}
                />
              </>
            ) : (
              <h1 className="text-4xl font-bold text-center lg:text-left text-gray-800 break-words">
                {user.UserProfile?.displayName}
              </h1>
            )}
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={edit ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="w-full relative"
          >
            {edit ? (
              <>
                <textarea
                  ref={bioTextareaRef}
                  value={bio || ""}
                  onChange={handleBioChange}
                  className="ring-0 text-gray-600 outline-none focus:border-transparent focus:ring-0 w-full resize-none overflow-hidden min-h-[24px] text-center lg:text-left"
                  rows={1}
                  disabled={isLoading}
                  placeholder="Tell us about yourself"
                />
              </>
            ) : (
              <p className="text-gray-600 whitespace-pre-wrap break-words text-center lg:text-left">
                {user.UserProfile?.bio || "This user has not set a bio yet."}
              </p>
            )}
          </motion.div>

          {/* Social Links */}
          {user.UserProfile?.socialLinks && (
            <motion.div
              initial={edit ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <SocialLinkVisualizer
                socialLinks={user.UserProfile.socialLinks}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
      {/* Right Section - Grid */}
      <div className="flex-[2.5] min-h-screen overflow-y-auto p-6 ">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={edit ? { delay: 0.5 } : { delay: 1, duration: 0.5 }}
          className="w-full max-w-5xl mx-auto"
        >
          {/* Loading Skeleton */}

          {useMemo(() => {
            const ResponsiveGridLayout = WidthProvider(Responsive);
            return (
              <div ref={gridRef}>
                <ResponsiveGridLayout
                  className="m-auto lg:w-[600px] xl:w-[750px] 2xl:max-w-[1500px]"
                  layouts={getDefaultLayout(
                    user.UserProfile?.widgets || [],
                    edit
                  )}
                  breakpoints={{
                    xl: 1280,
                    lg: 1024,
                    md: 768,
                    sm: 480,
                    xs: 200,
                  }}
                  cols={{ xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
                  margin={[16, 16]}
                  rowHeight={rowHeight}
                  containerPadding={[16, 16]}
                  isDraggable={edit}
                  useCSSTransforms={true}
                  onLayoutChange={(layout) => {
                    console.log("layout changed:", layout);
                  }}
                >
                  {user.UserProfile?.widgets?.map((widget) => {
                    return (
                      <div
                        key={widget.id}
                        className={`
                      bg-white rounded-2xl
                      border border-gray-200
                      overflow-hidden
                      backdrop-blur-xl backdrop-saturate-200
                      group
                      transition-shadow duration-200
                      hover:shadow-[0_8px_16px_-3px_rgba(0,0,0,0.15)]
                      ${edit ? "cursor-grab active:cursor-grabbing" : ""}
                    `}
                      >
                        <WidgetContent widget={widget} />
                      </div>
                    );
                  })}
                </ResponsiveGridLayout>
              </div>
            );
          }, [user.UserProfile?.widgets, edit])}
        </motion.div>
      </div>

      {/* Edit Tooltip and Add Widget Button */}
      {isMyLink && (
        <>
          <div className="fixed bottom-8 right-1/2 translate-x-1/2">
            <EditTooltip edit={edit} />
            <AddWidgetButton userId={user.id} />
          </div>
        </>
      )}
    </div>
  );
};
