"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "@/hooks/useDebounce";

type ValidationStatus = {
  isValid: boolean;
  isAvailable: boolean | null;
  message: string;
};

type ValidationResponse = {
  exists: boolean;
};

// Basic validation rules
const validateSlug = (value: string): ValidationStatus => {
  if (value.length === 0) {
    return {
      isValid: false,
      isAvailable: null,
      message: "",
    };
  }

  if (value.length < 3) {
    return {
      isValid: false,
      isAvailable: null,
      message: "The link must be at least 3 characters long",
    };
  }

  if (value.length > 32) {
    return {
      isValid: false,
      isAvailable: null,
      message: "The link must be at most 32 characters long",
    };
  }

  if (!/^[a-z0-9-]+$/.test(value)) {
    return {
      isValid: false,
      isAvailable: null,
      message: "Only lowercase letters, numbers, and hyphens are allowed",
    };
  }

  if (value.startsWith("-") || value.endsWith("-")) {
    return {
      isValid: false,
      isAvailable: null,
      message: "Link cannot start or end with a hyphen",
    };
  }

  return {
    isValid: true,
    isAvailable: null,
    message: "",
  };
};

export function useValidateSlug(initialValue: string = "") {
  const [slug, setSlug] = useState(initialValue);
  const debouncedSlug = useDebounce(slug, 500);

  // Validate the slug format (synchronous)
  const validation = validateSlug(debouncedSlug);

  // Check slug availability using React Query
  const { data: availabilityData, isLoading } = useQuery({
    queryKey: ["slug-availability", debouncedSlug],
    queryFn: async () => {
      if (!debouncedSlug || !validation.isValid) return null;

      try {
        const response = await fetch(`/api/check-slug?slug=${debouncedSlug}`);
        if (!response.ok) throw new Error("Failed to check availability");

        const data: ValidationResponse = await response.json();
        return !data.exists;
      } catch (error) {
        console.error("Error checking slug availability:", error);
        return null;
      }
    },
    enabled: validation.isValid && debouncedSlug.length > 0,
    staleTime: 30000, // Cache results for 30 seconds
    retry: false, // Don't retry on failure
  });

  // Combine validation results
  const status: ValidationStatus = {
    ...validation,
    isAvailable: validation.isValid ? availabilityData ?? null : null,
    message:
      validation.message ||
      (availabilityData === false
        ? "This username is already taken"
        : availabilityData === true
        ? "This username is available"
        : ""),
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSlug(value);
  };

  return {
    slug,
    status,
    isChecking: isLoading,
    handleChange,
  };
}
