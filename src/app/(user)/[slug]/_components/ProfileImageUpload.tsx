"use client";

import { useRef, useState } from "react";
import { updateUserProfilePicture } from "../../onboarding/_actions";
import Image from "next/image";

interface ProfileImageUploadProps {
  currentImage: string | null;
  edit: boolean;
}

export function ProfileImageUpload({
  currentImage,
  edit,
}: ProfileImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);

      const [, error] = await updateUserProfilePicture({ image: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      setIsUploading(false);

      if (error) {
        console.error(error);
        // You might want to add toast notification here
      }
    }
  };

  if (!edit) {
    return (
      <div className="relative w-52 h-52 rounded-full overflow-hidden bg-gray-100">
        {currentImage ? (
          <Image
            src={currentImage}
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
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className="relative w-52 h-52 rounded-full overflow-hidden bg-gray-100 cursor-pointer group"
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
            <svg
              className="animate-spin h-8 w-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : (
          <>
            {(currentImage || imageUrl) && (
              <>
                <Image
                  src={imageUrl || currentImage || ""}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </>
            )}
            {!currentImage && !imageUrl && (
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
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}
