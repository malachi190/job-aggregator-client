import { useEffect, useState } from "react";
import { useFeedSearch } from "@/hooks/api/use-feed";
import { useDebounce } from "@/hooks/use-debounce";
import { FeedSearchBar } from "./feed-search-bar";
import { FeedSidebar } from "./feed-sidebar";
import { MobileFilterDrawer } from "./mobile-filter-drawer";
import { JobCardList } from "./job-card-list";
import type { SearchParams } from "@/types";
import type { FeedItem } from "@/types";

export function FeedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<SearchParams>({
    page: 1,
    limit: 20,
  });
  const [visibleJobs, setVisibleJobs] = useState<FeedItem[]>([]);

  const debouncedSearch = useDebounce(searchQuery, 400);
  const hasSearch = debouncedSearch.length > 2;

  const { data, isLoading } = useFeedSearch({
    ...filters,
    q: debouncedSearch,
  });

  const total = data?.pagination.total ?? 0;
  const jobs = (filters.page ?? 1) === 1 ? (data?.items ?? []) : visibleJobs;

  useEffect(() => {
    if (!data) return;
    if ((filters.page ?? 1) === 1) {
      setVisibleJobs(data.items);
      return;
    }
    setVisibleJobs((current) => {
      const byId = new Map(current.map((item) => [item.job.id, item]));
      data.items.forEach((item) => byId.set(item.job.id, item));
      return Array.from(byId.values());
    });
  }, [data, filters.page]);

  useEffect(() => {
    setFilters((current) => ({ ...current, page: 1 }));
    setVisibleJobs([]);
  }, [debouncedSearch]);

  const handleFiltersChange = (next: SearchParams) => {
    setVisibleJobs([]);
    setFilters({ ...next, page: 1 });
  };

  const handleLoadMore = () => {
    setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }));
  };

  return (
    <div>
      <FeedSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onOpenFilters={() => setShowMobileFilters(true)}
      />

      <div className="py-5 sm:py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <FeedSidebar filters={filters} onChange={handleFiltersChange} />

          <MobileFilterDrawer
            open={showMobileFilters}
            onClose={() => setShowMobileFilters(false)}
            filters={filters}
            onChange={handleFiltersChange}
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
