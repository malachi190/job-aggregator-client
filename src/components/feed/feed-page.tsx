import { useState } from "react";
import { useFeedSearch } from "@/hooks/api/use-feed";
import { useDebounce } from "@/hooks/use-debounce";
import { FeedSearchBar } from "./feed-search-bar";
import { FeedSidebar } from "./feed-sidebar";
import { MobileFilterDrawer } from "./mobile-filter-drawer";
import { JobCardList } from "./job-card-list";
import type { SearchParams } from "@/types";

export function FeedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<SearchParams>({
    page: 1,
    pageSize: 20,
  });

  const debouncedSearch = useDebounce(searchQuery, 400);
  const hasSearch = debouncedSearch.length > 2;

  const { data, isLoading } = useFeedSearch({
    ...filters,
    q: debouncedSearch,
  });

  const jobs = data?.items ?? [];
  const total = data?.pagination.total ?? 0;

  const handleLoadMore = () => {
    setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }));
  };

  return (
    <div className="min-h-screen">
      <FeedSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onOpenFilters={() => setShowMobileFilters(true)}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <FeedSidebar filters={filters} onChange={setFilters} />

          <MobileFilterDrawer
            open={showMobileFilters}
            onClose={() => setShowMobileFilters(false)}
            filters={filters}
            onChange={setFilters}
          />

          <JobCardList
            items={jobs}
            total={total}
            isLoading={isLoading}
            hasSearch={hasSearch}
            onLoadMore={handleLoadMore}
          />
        </div>
      </div>
    </div>
  );
}