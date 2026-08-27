import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FeedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onOpenFilters: () => void;
}

export function FeedSearchBar({
  value,
  onChange,
  onOpenFilters,
}: FeedSearchBarProps) {
  return (
    <div className="sticky top-16 z-30 border-b border-[#d9d9d9]/50 bg-white/80 backdrop-blur dark:border-[#353535]/50 dark:bg-[#353535]/80">
      <div className="flex items-center gap-2 py-3 sm:gap-3 sm:py-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#353535]/40 dark:text-[#d9d9d9]/40" />
          <Input
            placeholder="Search jobs or skills..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border-[#d9d9d9] pl-10 dark:border-[#353535]"
          />
        </div>
        <Button
          variant="outline"
          aria-label="Open job filters"
          className="shrink-0 border-[#d9d9d9] dark:border-[#353535] lg:hidden"
          onClick={onOpenFilters}
        >
          <SlidersHorizontal className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Filters</span>
        </Button>
      </div>
    </div>
  );
}
