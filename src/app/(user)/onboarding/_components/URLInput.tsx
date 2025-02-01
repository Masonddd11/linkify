"use client";

import Spinner from "@/app/(auth)/register/_components/Spinner";

interface URLInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  prefix?: string;
  placeholder?: string;
  label?: string;
  isValid?: boolean;
  isAvailable: boolean | null;
  isChecking?: boolean;
  message?: string;
  className?: string;
}

export function URLInput({
  id,
  value,
  onChange,
  prefix = "",
  placeholder = "",
  label,
  isValid = true,
  isAvailable = true,
  isChecking = false,
  message,
  className = "",
}: URLInputProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="mt-1 relative rounded-md shadow-sm">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          type="text"
          id={id}
          value={value}
          onChange={onChange}
          className={`
            block w-full ${
              prefix ? "pl-16" : "pl-3"
            } pr-10 py-3 rounded-lg text-sm text-gray-900 placeholder-gray-400
            border ${
              !isValid
                ? "border-gray-300 focus:ring-primary-500"
                : isAvailable === false
                ? "border-red-300 focus:ring-red-500"
                : isAvailable
                ? "border-green-300 focus:ring-green-500"
                : "border-gray-300 focus:ring-primary-500"
            } 
            focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent
            transition-colors
          `}
          placeholder={placeholder}
        />
        {/* Validation Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isChecking ? (
            <Spinner />
          ) : isAvailable && isValid ? (
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
      {message && (
        <p
          className={`text-sm ${
            isAvailable && isValid
              ? "text-green-600"
              : isAvailable === false
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
