import { useState } from "react";
import { PLATFORM } from "@prisma/client";
import { socialPlatformConfigs } from "@/types/social";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SocialWidgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { platform: PLATFORM; url: string }) => void;
}

export function SocialWidgetDialog({
  isOpen,
  onClose,
  onSubmit,
}: SocialWidgetDialogProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<PLATFORM | null>(
    null
  );
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setSelectedPlatform(null);
    setUsername("");
    setError("");
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedPlatform) {
      setError("Please select a platform");
      return;
    }
    if (!username) {
      setError("Please enter your username");
      return;
    }

    const platform = socialPlatformConfigs.find(
      (p) => p.id === selectedPlatform
    );
    if (!platform) {
      setError("Invalid platform selected");
      return;
    }

    // Replace {username} in the urlPattern with the actual username
    const profileUrl = platform.urlPattern.replace(
      "{username}",
      username.replace("@", "")
    );

    onSubmit({ platform: selectedPlatform, url: profileUrl });
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Social Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Platform</Label>
            <ScrollArea className="h-[200px] pr-4">
              <div className="grid grid-cols-4 gap-2">
                {socialPlatformConfigs.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <Button
                      key={platform.id}
                      variant={
                        selectedPlatform === platform.id ? "secondary" : "ghost"
                      }
                      className="flex flex-col items-center gap-1 h-auto py-3"
                      onClick={() => setSelectedPlatform(platform.id)}
                    >
                      <Icon size={24} style={{ color: platform.color }} />
                      <span className="text-xs">{platform.name}</span>
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {selectedPlatform && (
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={
                  socialPlatformConfigs.find((p) => p.id === selectedPlatform)
                    ?.placeholder
                }
              />
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Social Profile</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
