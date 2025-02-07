"use client";

import { Button } from "@/components/ui/button";
import { Copy, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddWidgetButton } from "./AddWidgetButton";

export default function EditTooltip({ edit }: { edit: boolean }) {
  const router = useRouter();

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-lg px-2 py-2 flex items-center gap-1 border border-gray-200/50">
        {/* Back Button */}
        {/* <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button> */}
        {/* Divider
        <div className="w-px h-5 bg-gray-200/80 mx-1" /> */}
        {/* Share Profile Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            // TODO: Show toast
          }}
        >
          <Copy className="h-4 w-4" />
          <span className="text-sm font-bold">Copy Link</span>
        </Button>
        {/* Divider */}
        <div className="w-px h-5 bg-gray-200/80 mx-1" />
        {/* Edit Profile Button */}
        <Button
          variant={edit ? "default" : "ghost"}
          size="sm"
          className={`h-8 gap-2 ${
            edit
              ? "bg-primary-500 text-white hover:bg-primary-600"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
          }`}
          onClick={() => {
            const url = new URL(window.location.href);
            if (edit) {
              router.push(url.pathname.replace("/edit", ""));
            } else {
              router.push(url.pathname + "/edit");
            }
          }}
        >
          <Edit3 className="h-4 w-4" />
          <span className="font-bold text-sm">
            {edit ? "Done" : "Edit Profile"}
          </span>
        </Button>
        {/* Divider */}
        <div className="w-px h-5 bg-gray-200/80 mx-1" />
        <AddWidgetButton />
      </div>
    </div>
  );
}
