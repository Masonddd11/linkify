"use client";

import { Share2, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditTooltip({ edit }: { edit: boolean }) {
  const router = useRouter();

  return (
    <div className="bg-white shadow-lg rounded-full px-6 py-3 flex items-center gap-4 border border-gray-100">
      {/* Share Profile Button */}
      <button
        onClick={() => {
          // Copy current URL to clipboard
          navigator.clipboard.writeText(window.location.href);
          // You could add a toast notification here
        }}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-400 transition-colors duration-200"
      >
        <Share2 className="w-5 h-5" />
        <span className="text-sm font-bold">Share Profile</span>
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Edit Profile Button */}
      <button
        onClick={() => {
          const url = new URL(window.location.href);

          console.log(url.pathname);

          if (edit) {
            router.push(url.pathname.replace("/edit", ""));
          } else {
            router.push(url.pathname + "/edit");
          }
        }}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-400 transition-colors duration-200"
      >
        <Edit3 className="w-5 h-5" />
        <span className="text-sm font-bold">Edit Profile</span>
      </button>
    </div>
  );
}
