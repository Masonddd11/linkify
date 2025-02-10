"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ListContent, ListItem } from "@prisma/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { useListWidget } from "@/hooks/useListWidget";

interface ListWidgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: ListContent & {
    items: ListItem[];
  };
}

export function ListWidgetDialog({ isOpen, onClose, content }: ListWidgetDialogProps) {
  const [newItem, setNewItem] = useState("");
  const { addItem, updateItem, removeItem, isLoading } = useListWidget(content.id);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    await addItem({
      content: newItem,
      order: content.items.length,
    });
    setNewItem("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit List Items</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <form onSubmit={handleAddItem} className="flex gap-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add new item..."
              disabled={isLoading}
            />
            <Button type="submit" size="sm" disabled={isLoading || !newItem.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </form>
          
          <div className="space-y-2">
            {content.items
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={item.isCompleted}
                    onCheckedChange={(checked) => 
                      updateItem({ 
                        itemId: item.id, 
                        data: { isCompleted: checked as boolean } 
                      })  
                    }
                    disabled={isLoading}
                  />
                  <span className={`flex-1 ${item.isCompleted ? 'line-through text-gray-400' : ''}`}>
                    {item.content}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 