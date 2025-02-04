"use client";

import Spinner from "@/app/(auth)/register/_components/Spinner";

interface ContinueButtonProps {
  onClick: () => void;
  isDisabled: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

export function ContinueButton({
  onClick,
  isDisabled,
  isLoading = false,
  loadingText = "Loading..."
}: ContinueButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full py-3 px-4 rounded-lg text-white font-medium
        ${
          !isLoading && !isDisabled
            ? "bg-primary-600 hover:bg-primary-700"
            : "bg-gray-300 cursor-not-allowed"
        }
        transition-all duration-200 flex items-center justify-center gap-2
      `}
      disabled={isDisabled || isLoading}
    >
      {isLoading ? (
        <>
          <Spinner />
          {loadingText}
        </>
      ) : (
        "Continue"
      )}
    </button>
  );
}
