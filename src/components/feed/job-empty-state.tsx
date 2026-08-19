import { Briefcase } from "lucide-react";

interface JobEmptyStateProps {
  hasSearch: boolean;
}

export function JobEmptyState({ hasSearch }: JobEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Briefcase className="mb-4 h-12 w-12 text-[#d9d9d9] dark:text-[#353535]" />
      <h3 className="text-lg font-semibold text-[#353535] dark:text-white">
        {hasSearch ? "No jobs found" : "Your feed is empty"}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-[#353535]/70 dark:text-[#d9d9d9]/70">
        {hasSearch
          ? "Try adjusting your search terms or filters to find more opportunities."
          : "We're scanning the web for jobs that match your profile. Check back soon!"}
      </p>
    </div>
  );
}