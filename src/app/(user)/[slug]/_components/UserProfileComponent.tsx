"use client";

import { WidgetContent } from "@/components/widgets/WidgetContent";
import { SocialLinkVisualizer } from "@/components/SocialLinkVisualizer";
import { motion } from "framer-motion";
import EditTooltip from "./EditToolTip";
import { ProfileImageUpload } from "./ProfileImageUpload";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDeleteWidget } from "@/components/widgets/_hooks/useDeleteWidget";
import useUpdateUserInfo from "../_hooks/useUpdateUserInfo";
import React from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { getLayout } from "@/utils/layout.helper";
import useUpdateLayoutPositions from "../_hooks/useUpdateLayoutPositions";
import "./UserProfileComponent.css";
import { useRouter } from "next/navigation";
import { WIDGET_SIZE } from "@prisma/client";
import { useUpdateWidgetSize } from "../_hooks/useUpdateWidgetSize";
import { toast } from "react-hot-toast";
import { ImageWidgetDialog } from "@/components/widgets/ImageWidgetDialog";
import { ProfileAndSocialsAndWidgets, WidgetTypeInclude } from "@/lib/user";
import { Settings } from "lucide-react";

interface UserProfileComponentProps {
  user : ProfileAndSocialsAndWidgets;
  isMyLink: boolean;
  edit: boolean;
}

export const UserProfileComponent: React.FC<UserProfileComponentProps> = ({
  user,
  isMyLink,
  edit,
}) => {
  const [rowHeight, setRowHeight] = useState<number>(150);
  const [isMobile, setIsMobile] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Generate layout based on current widgets and mobile state
  const currentLayout = getLayout(
    user?.UserProfile?.widgets || [],
    edit,
    isMobile
  ).lg;
  const gridRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const { updateLayout, isError, error } = useUpdateLayoutPositions();
  const { mutate: deleteWidget } = useDeleteWidget();

  const router = useRouter();

  const { updateWidgetSize } = useUpdateWidgetSize();

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<WidgetTypeInclude | null>(null);

  const handleDeleteWidget = useCallback(
    async (widgetId: string) => {
      if (isDeleting) return; // Prevent multiple deletions

      try {
        setIsDeleting(true);
        // First delete the widget
        await deleteWidget(widgetId);

        // Wait a bit before refreshing to ensure deletion is complete
        setTimeout(() => {
          router.refresh();
          setIsDeleting(false);
        }, 500);
      } catch (error) {
        console.error("Error deleting widget:", error);
        setIsDeleting(false);
      }
    },
    [deleteWidget, router, isDeleting]
  );

  useEffect(() => {
    if (isError) {
      console.error("Error updating layout:", error);
    }
  }, [isError, error]);

  useEffect(() => {
    const updateLayout = () => {
      if (gridRef.current) {
        const containerWidth = gridRef.current.offsetWidth;
        const newIsMobile = window.innerWidth < 768;
        setIsMobile(newIsMobile);

        const columns = newIsMobile ? 2 : 3;

        // Calculate available width after subtracting container padding
        const containerPadding = newIsMobile ? 8 * 2 : 16 * 2; // Smaller padding on mobile
        const availableWidth = containerWidth - containerPadding;

        // Calculate total margin space between items
        const marginSpace = (columns - 1) * (newIsMobile ? 8 : 16); // Smaller margins on mobile

        // Calculate the width for each item
        const itemWidth = (availableWidth - marginSpace) / columns;

        // Set the row height equal to the item width to maintain aspect ratio
        setRowHeight(itemWidth);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const {
    name: displayName,
    bio,
    handleNameChange,
    handleBioChange,
    handleSave,
    isLoading,
  } = useUpdateUserInfo(
    user?.UserProfile?.displayName || "",
    user?.UserProfile?.bio || "",
    user?.id || 0
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

  const handleResizeWidget = useCallback(
    async (widgetId: string, newSize: WIDGET_SIZE) => {
      try {
        const widgetLayout = currentLayout.find((item) => item.i === widgetId);
        if (!widgetLayout) return;

        let newW = 1,
          newH = 1;
        switch (newSize) {
          case WIDGET_SIZE.LARGE_SQUARE:
            newW = 2;
            newH = 2;
            break;
          case WIDGET_SIZE.WIDE:
            newW = 2;
            newH = 1;
            break;
          case WIDGET_SIZE.LONG:
            newW = 1;
            newH = 2;
            break;
          case WIDGET_SIZE.SMALL_SQUARE:
          default:
            newW = 1;
            newH = 1;
            break;
        }

        const newLayout = currentLayout.map((item) => {
          if (item.i === widgetId) {
            return {
              ...item,
              w: newW,
              h: newH,
            };
          }
          return item;
        });

        updateLayout(newLayout);

        await updateWidgetSize(widgetId, newSize);

        router.refresh();
      } catch (error) {
        console.error("Error resizing widget:", error);
        toast.error("Failed to resize widget");
      }
    },
    [currentLayout, updateLayout, router, updateWidgetSize]
  );

  const handleOpenImageDialog = (widget: WidgetTypeInclude) => {
    setSelectedWidget(widget);
    setImageDialogOpen(true);
  };

  const handleImageUpdate = async (data: { url: string; alt?: string }) => {
    if (selectedWidget?.id) {
      try {
        const response = await fetch(`/api/widgets/${selectedWidget.id}/image`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Failed to update image');
        
        setImageDialogOpen(false);
        router.refresh();
      } catch (error) {
        console.error("Error updating image:", error);
        toast.error("Failed to update image");
      }
    }
  };

  return (
    <div className="flex-col lg:flex-row flex gap-8 p-12 w-full mx-auto relative min-h-screen">
      {/* Left Section - Profile */}
      <div className="flex-1 w-full space-y-6">
        <motion.div
          initial={edit ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 flex flex-col justify-center items-center lg:justify-start lg:items-start w-full relative"
        >
          {/* Add Settings Button */}
          {isMyLink && (
            <motion.button
              initial={edit ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              onClick={() => router.push('/settings')}
              className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          )}

          {/* Profile Image Upload */}
          <motion.div
            initial={edit ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center space-y-4"
          >
            <ProfileImageUpload currentImage={user?.image || null} edit={edit} />
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
                {user?.UserProfile?.displayName}
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
                {user?.UserProfile?.bio || "This user has not set a bio yet."}
              </p>
            )}
          </motion.div>

          {/* Social Links */}
          {user?.UserProfile?.socialLinks && (
            <motion.div
              initial={edit ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <SocialLinkVisualizer
                socialLinks={user?.UserProfile?.socialLinks || []}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
      {/* Right Section - Grid */}
      <div className="flex-[2.5] min-h-screen overflow-y-auto lg:p-6 p-2 overflow-visible ">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={edit ? {} : { delay: 1, duration: 0.5 }}
          className="w-full max-w-5xl mx-auto"
        >
          {/* Loading Skeleton */}
          <div
            ref={gridRef}
            className="m-auto lg:w-[600px] xl:w-[750px] 2xl:max-w-[1500px]"
          >
            <GridLayout
              className="layout max-h-screen overflow-y-auto no-scrollbar"
              layout={currentLayout}
              cols={isMobile ? 2 : 3}
              rowHeight={rowHeight}
              width={gridRef.current?.offsetWidth || 1200}
              margin={isMobile ? [8, 8] : [16, 16]}
              containerPadding={isMobile ? [8, 8] : [16, 16]}
              compactType={isMobile ? "vertical" : null}
              isDraggable={edit}
              isResizable={false}
              useCSSTransforms={true}
              preventCollision={false}
              onDragStart={() => {
                isDragging.current = true;
              }}
              onDragStop={(layout) => {
                if (edit && !isDeleting && isDragging.current) {
                  isDragging.current = false;
                  const filteredLayout = layout.filter((item) =>
                    user?.UserProfile?.widgets?.some(
                      (widget) => widget.id === item.i
                    )
                  );
                  if (filteredLayout.length > 0) {
                    // Always update layout on drag stop
                    updateLayout(filteredLayout);
                    // Force a refresh to ensure UI is in sync
                    router.refresh();
                  }
                }
              }}
            >
              {user?.UserProfile?.widgets?.map((widget) => (
                <div
                  key={widget.id}
                  className={`
                        bg-white rounded-2xl
                        border border-gray-200
                        backdrop-blur-xl backdrop-saturate-200
                        group
                        transition-shadow duration-200
                        hover:shadow-[0_8px_16px_-3px_rgba(0,0,0,0.15)]
                        ${edit ? "cursor-grab active:cursor-grabbing" : ""}
                      `}
                >
                  <WidgetContent
                    widget={widget}
                    edit={edit}
                    onDelete={handleDeleteWidget}
                    onResize={handleResizeWidget}
                    onOpenImageDialog={handleOpenImageDialog}
                  />
                </div>
              ))}
            </GridLayout>
          </div>
        </motion.div>
      </div>

      {/* Edit Tooltip and Add Widget Button */}
      {isMyLink && (
        <>
          <div className="fixed bottom-8 right-1/2 translate-x-1/2 z-[999]">
            <EditTooltip
              edit={edit}
              onSave={() =>
                currentLayout.length > 0 && updateLayout(currentLayout)
              }
            />
          </div>
        </>
      )}

      <ImageWidgetDialog
        isOpen={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        onSubmit={handleImageUpdate}
        initialData={selectedWidget?.imageContent || undefined}
      />
    </div>
  );
};
