import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FeedFilters } from "./feed-filters";
import type { SearchParams } from "@/types";

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: SearchParams;
  onChange: (filters: SearchParams) => void;
}

export function MobileFilterDrawer({
  open,
  onClose,
  filters,
  onChange,
}: MobileFilterDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="absolute left-0 top-0 h-full w-80 overflow-y-auto bg-white p-6 dark:bg-[#353535]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#353535] dark:text-white">
            Filters
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <FeedFilters filters={filters} onChange={onChange} />
      </div>
    </div>
  );
}