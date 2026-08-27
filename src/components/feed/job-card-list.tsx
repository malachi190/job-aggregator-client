import { Button } from "@/components/ui/button";
import { JobCard } from "./job-card";
import { JobSkeleton } from "./job-skeleton";
import { JobEmptyState } from "./job-empty-state";
import type { FeedItem } from "@/types";

interface JobCardListProps {
  items: FeedItem[];
  total: number;
  isLoading: boolean;
  hasSearch: boolean;
  onLoadMore: () => void;
}

export function JobCardList({
  items,
  total,
  isLoading,
  hasSearch,
  onLoadMore,
}: JobCardListProps) {
  return (
    <main>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[#353535]/60 dark:text-[#d9d9d9]/60">
          {isLoading
            ? "Loading..."
            : `${total} job${total !== 1 ? "s" : ""} found`}
        </p>
      </div>

      {isLoading ? (
        <JobSkeleton />
      ) : items.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <JobCard key={item.job.id} item={item} />
            ))}
          </div>
          {total > items.length && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                className="border-[#d9d9d9] dark:border-[#353535]"
                onClick={onLoadMore}
              >
                Load more
              </Button>
            </div>
          )}
        </>
      ) : (
        <JobEmptyState hasSearch={hasSearch} />
      )}
    </main>
  );
}
