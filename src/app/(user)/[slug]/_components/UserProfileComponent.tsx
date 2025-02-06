"use client";

import { Prisma } from "@prisma/client";
import { Layout } from "react-grid-layout";
import { WidgetContent } from "@/components/widgets/WidgetContent";
import { SocialLinkVisualizer } from "@/components/SocialLinkVisualizer";
import { motion } from "framer-motion";
import EditTooltip from "./EditToolTip";
import { ProfileImageUpload } from "./ProfileImageUpload";
import { useEffect, useRef, useState, useCallback } from "react";
import useUpdateUserInfo from "../_hooks/useUpdateUserInfo";
import React from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { AddWidgetButton } from "./AddWidgetButton";
import { getLayout } from "@/utils/layout.helper";
import "./UserProfileComponent.css";

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
              layout: true;
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
  const layouts = getLayout(user.UserProfile?.widgets || [], edit);
  const [currentLayout, setCurrentLayout] = useState<Layout[]>(layouts.lg);
  const gridRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);
  const isDragging = useRef(false);

  const updateLayoutPositions = async (newLayout: Layout[]) => {
    // Validate layout before sending
    if (!Array.isArray(newLayout) || newLayout.length === 0) {
      console.error("Invalid layout data");
      setCurrentLayout(layouts.lg);
      return;
    }

    // Ensure all required fields are present
    const validLayout = newLayout.every((item) => {
      return (
        item &&
        typeof item.i === "string" &&
        typeof item.x === "number" &&
        typeof item.y === "number" &&
        typeof item.w === "number" &&
        typeof item.h === "number"
      );
    });

    if (!validLayout) {
      console.error("Invalid layout format");
      setCurrentLayout(layouts.lg);
      return;
    }

    try {
      const response = await fetch("/api/widgets/layout", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ layouts: newLayout }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update layout positions");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating layout positions:", error);
      // Revert the layout change if it failed
      setCurrentLayout(layouts.lg);
    }
  };

  const handleLayoutChange = (layout: Layout[]) => {
    setCurrentLayout(layout);

    // Only update positions if we're in edit mode and not in the initial load or dragging
    if (edit && !isInitialLoad.current && !isDragging.current) {
      updateLayoutPositions(layout);
    }

    // After the first layout change, set initial load to false
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  };

  const handleDrag = useCallback((layout: Layout[]) => {
    isDragging.current = true;
    setCurrentLayout(layout);
  }, []);

  const handleDragStop = useCallback(
    (layout: Layout[]) => {
      isDragging.current = false;
      setCurrentLayout(layout);

      // Only update positions if in edit mode
      if (edit) {
        updateLayoutPositions(layout);
      }
    },
    [edit]
  );

  useEffect(() => {
    const updateRowHeight = () => {
      if (gridRef.current) {
        const containerWidth = gridRef.current.offsetWidth;
        const columns = 3;

        // Calculate available width after subtracting container padding
        const containerPadding = 16 * 2; // 16px padding on each side
        const availableWidth = containerWidth - containerPadding;

        // Calculate total margin space between items
        const marginSpace = (columns - 1) * 16; // 16px margin between items

        // Calculate the width for each item
        const itemWidth = (availableWidth - marginSpace) / columns;

        // Set the row height equal to the item width to make squares
        setRowHeight(itemWidth);
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
          <div
            ref={gridRef}
            className="m-auto lg:w-[600px] xl:w-[750px] 2xl:max-w-[1500px]"
          >
            <GridLayout
              className="layout"
              layout={currentLayout}
              cols={3}
              rowHeight={rowHeight}
              width={gridRef.current?.offsetWidth || 1200}
              margin={[16, 16]}
              containerPadding={[16, 16]}
              isDraggable={edit}
              isResizable={false}
              useCSSTransforms={true}
              preventCollision={false}
              compactType={null}
              onLayoutChange={handleLayoutChange}
              onDrag={(layout: Layout[]) => {
                if (edit) {
                  handleDrag(layout);
                }
              }}
              onDragStop={(layout) => {
                if (edit) {
                  handleDragStop(layout);
                }
              }}
            >
              {user.UserProfile?.widgets?.map((widget) => (
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
              ))}
            </GridLayout>
          </div>
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
