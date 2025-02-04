"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { saveUserInfo, updateUserProfilePicture } from "../_actions";
import { ContinueButton } from "./ContinueButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SocialLinkVisualizer } from "@/components/SocialLinkVisualizer";
import { Prisma } from "@prisma/client";

interface UserInfoComponentProps {
  setOnBoardStep: (step: number) => void;
  user: Prisma.UserGetPayload<{
    include: {
      UserProfile: {
        include: {
          socialLinks: true;
        };
      };
    };
  }>;
}

export function UserInfoComponent({
  setOnBoardStep,
  user,
}: UserInfoComponentProps) {
  const [displayName, setDisplayName] = useState(
    user.username.replace("_", " ").toUpperCase()
  );
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await updateUserProfilePicture({ image: file });

      const reader = new FileReader();

      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!displayName.trim()) {
      toast.error("Please enter your display name");
      return;
    }

    try {
      setIsSaving(true);
      const [response, error] = await saveUserInfo({
        displayName: displayName.trim(),
        bio: bio.trim(),
      });

      if (error) {
        throw new Error(
          error.message || "An error occurred while saving user info"
        );
      }

      if (!response.success) {
        throw new Error(response.message);
      }

      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex gap-8 p-6 w-full mx-auto">
      {/* Left Section - Profile */}
      <div className="flex-1 w-full space-y-6">
        <div className="space-y-4 flex flex-col justify-start items-start w-full">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div
              className="relative w-52 h-52 rounded-full overflow-hidden bg-gray-100 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Display Name Input */}
          <div>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="ring-0 text-4xl font-bold text-gray-800 bg-gray-50 outline-none focus:border-transparent focus:ring-0"
              maxLength={50}
            />
          </div>

          {/* Bio Input */}
          <div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Your bio..."
              className="ring-0 bg-gray-50 outline-none focus:border-transparent focus:ring-0 resize-none"
              rows={4}
              maxLength={160}
            />
          </div>
        </div>

        {/* Social Links */}
        <div>
          <SocialLinkVisualizer
            socialLinks={user?.UserProfile?.socialLinks ?? []}
          />
        </div>

        {/* Continue Button */}
        <ContinueButton
          onClick={handleSubmit}
          isDisabled={!displayName.trim()}
          isLoading={isSaving}
          loadingText="Saving..."
        />

        {/* Skip Link */}
        <button
          onClick={() => setOnBoardStep(4)}
          className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Skip for now
        </button>
      </div>

      {/* Right Section - Grid */}
      <div className="flex-[2] max-h-screen overflow-hidden p-3">
        <div className="grid grid-cols-8 md:grid-cols-12 grid-flow-dense gap-4">
          {Array(Math.floor(Math.random() * (8 - 6) + 6))
            .fill(Math.floor(Math.random() * (3 - 1) + 1))
            .map((_, i) => (
              <div
                key={i}
                className={`aspect-square
                  hover:scale-105 transition-all duration-200 
                  bg-white rounded-lg border border-gray-200 shadow-sm hover:border-gray-300 transition-all flex flex-col items-center justify-center 
                space-y-2 cursor-pointer ${
                  i % 5 === 0
                    ? "col-span-6"
                    : i % 3 === 0
                    ? "col-span-4"
                    : "col-span-3"
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
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
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
