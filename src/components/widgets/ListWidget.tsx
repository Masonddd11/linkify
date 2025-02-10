"use client";

import { ListContent, ListItem } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { useListWidget } from "@/hooks/useListWidget";
import { useRouter } from "next/navigation";

interface ListWidgetProps {
  content: ListContent & {
    items: ListItem[];
  } | null;
  edit?: boolean;
}

export function ListWidget({ content, edit }: ListWidgetProps) {
  const { updateItem } = useListWidget(content?.id || "");
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Prevent grid drag
    const gridItem = e.currentTarget.closest('.react-grid-item');
    if (gridItem) {
      setTimeout(() => {
        if (gridItem) {
          const element = gridItem as HTMLElement;
          element.style.pointerEvents = 'auto';
        }
      }, 0);
    }
  };
  
  return (
    <div className="w-full h-full p-4 space-y-2">
      {content?.items
        .sort((a, b) => a.order - b.order)
        .map((item) => (
          <div key={item.id} className="flex items-center gap-3 group hover:bg-gray-50 rounded-lg p-2 transition-colors">
            <Checkbox
              checked={item.isCompleted}
              onCheckedChange={(checked) => 
                updateItem({ 
                  itemId: item.id, 
                  data: { isCompleted: checked as boolean } 
                })
              }
              disabled={!edit}
              onMouseDown={handleCheckboxClick}
              className={`${!edit ? 'cursor-default' : 'cursor-pointer'}`}
            />
            <span className={`flex-1 transition-colors ${
              item.isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'
            }`}>
              {item.content}
            </span>
          </div>
        ))}
    </div>
  );
} 