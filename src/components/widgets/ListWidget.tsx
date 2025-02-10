"use client";

import { ListContent, ListItem } from "@prisma/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { useListWidget } from "@/hooks/useListWidget";

interface ListWidgetProps {
  content: ListContent & {
    items: ListItem[];
  };
  edit?: boolean;
}

export function ListWidget({ content, edit }: ListWidgetProps) {
  const [newItem, setNewItem] = useState("");
  const { updateItem, addItem, removeItem, isLoading } = useListWidget(content.id);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    await addItem({
      content: newItem,
      order: content.items.length,
    });
    setNewItem("");
  };

  const handleToggleItem = async (itemId: string, isCompleted: boolean) => {
    await updateItem(itemId, { isCompleted });
  };

  return (
    <div className="w-full h-full p-4 space-y-4">
      {edit && (
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
      )}
      
      <div className="space-y-2">
        {content.items
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Checkbox
                checked={item.isCompleted}
                onCheckedChange={(checked) => 
                  handleToggleItem(item.id, checked as boolean)
                }
                disabled={!edit || isLoading}
              />
              <span className={`flex-1 ${item.isCompleted ? 'line-through text-gray-400' : ''}`}>
                {item.content}
              </span>
              {edit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
} 