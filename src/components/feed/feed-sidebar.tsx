import { FeedFilters } from "./feed-filters";
import type { SearchParams } from "@/types";

interface FeedSidebarProps {
  filters: SearchParams;
  onChange: (filters: SearchParams) => void;
}

export function FeedSidebar({ filters, onChange }: FeedSidebarProps) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-32 rounded-xl border border-[#d9d9d9]/50 bg-white p-5 dark:border-[#353535] dark:bg-[#353535]">
        <FeedFilters filters={filters} onChange={onChange} />
      </div>
    </aside>
  );
}