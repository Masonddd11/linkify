"use client";

import { Button } from "@/components/ui/button";
import { Copy, Edit3 } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AddWidgetButton } from "./AddWidgetButton";
import { toast } from "react-hot-toast";
interface EditTooltipProps {
  edit: boolean;
  onSave: () => void;
}

export default function EditTooltip({ edit, onSave }: EditTooltipProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  //when user click on edit button it goes to [slug]/edit page
  const handleToggleEdit = () => {
    if (edit) {
      onSave();

      const url = new URL(window.location.href);

      router.push(url.pathname.split("/edit")[0]);
    } else {
      router.push(`${pathname}/edit?${searchParams.toString()}`);
    }
  };

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-lg px-2 py-2 flex items-center gap-1 border border-gray-200/50">

        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard");
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
          onClick={handleToggleEdit}
        >
          <Edit3 className="h-4 w-4" />
          <span className="font-bold text-sm">
            {edit ? "Save" : "Edit Profile"}
          </span>
        </Button>

        {edit && (
          <>
            {/* Divider */}
            <div className="w-px h-5 bg-gray-200/80 mx-1" />
            <AddWidgetButton />
          </>
        )}
      </div>
    </div>
  );
}
