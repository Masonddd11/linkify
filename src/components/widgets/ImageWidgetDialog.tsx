"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageContent } from "@prisma/client";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud } from "lucide-react";
import Image from "next/image";

interface ImageWidgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { url: string; alt?: string }) => void;
  initialData?: ImageContent;
}

export function ImageWidgetDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ImageWidgetDialogProps) {
  const [url, setUrl] = useState(initialData?.url || "");
  const [alt, setAlt] = useState(initialData?.alt || "");
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialData?.url || null);
  const { uploadImage, isUploading } = useImageUpload();

  useEffect(() => {
    if (url) {
      setPreview(url);
    } else {
      setPreview(null);
    }
  }, [url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSubmit({ url, alt });
      onClose();
    } catch (error) {
      console.error("Failed to update image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadedUrl = await uploadImage(file);
      setUrl(uploadedUrl);
      setPreview(uploadedUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData?.url ? "Edit Image" : "Add Image"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="flex items-center justify-center w-full">
                {preview ? (
                  <div className="relative w-full h-64 group">
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="cursor-pointer text-white text-sm hover:underline">
                        Click to change
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploading || isLoading}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading || isLoading}
                    />
                  </label>
                )}
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div>
                <Label htmlFor="url">Image URL</Label>
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter image URL..."
                  disabled={isLoading}
                />
              </div>
              {preview && (
                <div className="relative w-full h-48">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div>
            <Label htmlFor="alt">Alt Text</Label>
            <Input
              id="alt"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Describe the image..."
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading || isUploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!url || isLoading || isUploading}
            >
              {isLoading || isUploading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}