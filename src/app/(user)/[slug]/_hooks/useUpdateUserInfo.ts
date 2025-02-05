"use client";

import { useDebouncedCallback } from "use-debounce";
import { useMutation } from "@tanstack/react-query";
import { useState, useCallback } from "react";

interface UpdateUserProfileParams {
  userId: number;
  displayName?: string;
  bio?: string;
}

export default function useUpdateUserInfo(
  initialName = "",
  initialBio = "",
  userId: number
) {
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: updateProfile } = useMutation({
    mutationFn: async ({
      userId,
      displayName,
      bio,
    }: UpdateUserProfileParams) => {
      // Only send non-empty values
      const payload: UpdateUserProfileParams = { userId };
      if (displayName && displayName.trim()) payload.displayName = displayName;
      if (bio && bio.trim()) payload.bio = bio;

      try {
        setIsLoading(true);
        const response = await fetch("/api/user/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to update profile");
        }

        return await response.json();
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error: Error) => {
      console.error("Profile update error:", error);
    },
    onSuccess: () => {},
  });

  // Debounced save function
  const debouncedSave = useDebouncedCallback(
    () => {
      // Only update if there are changes
      if (name !== initialName || bio !== initialBio) {
        updateProfile({
          userId,
          displayName: name,
          bio: bio,
        });
      }
    },
    500 // 500ms delay
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    debouncedSave();
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBio = e.target.value;
    setBio(newBio);
    debouncedSave();
  };

  const handleSave = useCallback(() => {
    debouncedSave();
  }, [debouncedSave]);

  return {
    name,
    bio,
    handleNameChange,
    handleBioChange,
    handleSave,
    setName,
    setBio,
    isLoading,
  };
}
