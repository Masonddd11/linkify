"use client";

import { useValidateSlug } from "../_hooks/useValidateSlug";
import LogoComponent from "@/components/LogoComponent";
import { claimSlug } from "../_actions";
import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "@/app/(auth)/register/_components/Spinner";

export function ClaimYourRouteComponent({
  setOnBoardStep,
}: {
  setOnBoardStep: (step: number) => void;
}) {
  const { slug, status, isChecking, handleChange } = useValidateSlug();

  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClaimRoute = async () => {
    try {
      setError(null);
      setIsClaiming(true);

      const [data, apiError] = await claimSlug({ slug });

      if (apiError) {
        setError("Failed to claim route. Please try again.");
        toast.error("Failed to claim route");
        return;
      }

      const { success, message } = data;

      if (!success) {
        setError(message);
        toast.error(message);
        return;
      }

      // Success! Show toast and redirect
      toast.success("Successfully claimed your route!");
      setOnBoardStep(2); // Adjust this number to your next onboarding step
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Left Side - Input Form */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="mb-8">
          <LogoComponent size="lg" />
          <h1 className="mt-6 text-2xl font-semibold text-gray-900">
            Claim your unique link
          </h1>
          <p className="mt-2 text-gray-600 text-sm">
            Choose a custom URL for your Linkify profile
          </p>
        </div>

        <div className="space-y-6">
          {/* Input Field */}
          <div className="space-y-2">
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700"
            >
              Choose your profile URL
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">linkify.io/</span>
              </div>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={handleChange}
                className={`
                  block w-full pl-16 pr-10 py-3 rounded-lg text-sm text-gray-900 placeholder-gray-400
                  border ${
                    !status.isValid
                      ? "border-gray-300 focus:ring-primary-500"
                      : status.isAvailable === false
                      ? "border-red-300 focus:ring-red-500"
                      : status.isAvailable
                      ? "border-green-300 focus:ring-green-500"
                      : "border-gray-300 focus:ring-primary-500"
                  } 
                  focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent
                  transition-colors
                `}
                placeholder="yourname"
              />
              {/* Validation Icon */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {isChecking ? (
                  <Spinner />
                ) : status.isAvailable && status.isValid ? (
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : null}
              </div>
            </div>
            {/* Validation Message */}
            {status.message && (
              <p
                className={`text-sm ${
                  status.isAvailable && status.isValid
                    ? "text-green-600"
                    : status.isAvailable === false
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {status.message}
              </p>
            )}
          </div>

          {/* Guidelines */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-medium text-gray-900">
              URL Guidelines:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center space-x-2">
                <span className="text-xs">•</span>
                <span>Only lowercase letters, numbers, and hyphens</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-xs">•</span>
                <span>Minimum 3 characters</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-xs">•</span>
                <span>No spaces or special characters</span>
              </li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleClaimRoute}
            className={`
              w-full py-3 px-4 rounded-lg text-white font-medium
              ${
                !isClaiming && status.isAvailable && status.isValid
                  ? "bg-primary-600 hover:bg-primary-700"
                  : "bg-gray-300 cursor-not-allowed"
              }
              transition-all duration-200 flex items-center justify-center gap-2
            `}
            disabled={!status.isAvailable || !status.isValid || isClaiming}
          >
            {isClaiming ? (
              <>
                <Spinner />
                Claiming...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>

      {/* Right Side - Browser Preview */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Browser Chrome */}
        <div className="bg-gray-100 border-b border-gray-200 p-4">
          {/* Browser Controls */}
          <div className="flex space-x-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          {/* URL Bar */}
          <div className="bg-white rounded-lg p-3 flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
              />
            </svg>
            <span className="text-gray-800 flex-1 font-mono text-sm">
              linkify.io/{slug || "yourname"}
            </span>
          </div>
        </div>
        {/* Browser Content */}
        <div className="p-8 min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4"></div>
            <div className="h-4 w-48 bg-gray-100 rounded mx-auto mb-2"></div>
            <div className="h-3 w-32 bg-gray-100 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
