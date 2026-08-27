import { useLocation, useParams } from "@tanstack/react-router";
import { JobHeader } from "./job-header";
import { JobDescription } from "./job-description";
import { JobOverview } from "./job-overview";
import { JobActions } from "./job-actions";
import { JobSkills } from "./job-skills";
import { LoadingSpinner } from "@/components/ui/spinner";
import type { FeedItem } from "@/types";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useJob } from "@/hooks/api/use-feed";

export function JobDetailPage() {
  const { jobId } = useParams({ from: "/_app/dashboard/$jobId" });
  const location = useLocation();
  const navigate = useNavigate();

  const stateItem = (location.state as unknown as Record<string, unknown> | undefined)
    ?.item as FeedItem | undefined;

  const { data: fetchedJob, isLoading } = useJob(
    !stateItem ? jobId : "",
  );

  const job = stateItem?.job ?? fetchedJob;
  const matchScore = stateItem?.score;
  const details = stateItem?.details;

  if (isLoading) {
    return <LoadingSpinner className="min-h-screen" size={40} />;
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Briefcase className="mx-auto mb-4 h-12 w-12 text-[#d9d9d9] dark:text-[#353535]" />
        <h2 className="text-lg font-semibold text-[#353535] dark:text-white">
          Job not found
        </h2>
        <p className="mt-2 text-sm text-[#353535]/70 dark:text-[#d9d9d9]/70">
          This job may have expired or the link is invalid.
        </p>
        <Button
          className="mt-6 gap-2 bg-[#3c6e71] hover:bg-[#284b63]"
          onClick={() => navigate({ to: "/dashboard" })}
        >
          Back to Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
        <div className="space-y-6">
          <JobHeader job={job} matchScore={matchScore} />
          <JobDescription job={job} />
          <JobSkills job={job} />
        </div>

        <div className="space-y-6">
          <JobOverview job={job} />
          <JobActions jobId={job.id} applyUrl={job.applyUrl} />
          {details && (
            <div className="rounded-xl border border-[#d9d9d9]/50 bg-white p-5 dark:border-[#353535] dark:bg-[#353535]">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#353535]/60 dark:text-[#d9d9d9]/60">
                Match Breakdown
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Skills", value: details.skills },
                  { label: "Title", value: details.title },
                  { label: "Seniority", value: details.seniority },
                  { label: "Location", value: details.location },
                  { label: "Recency", value: details.recency },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-[#353535]/70 dark:text-[#d9d9d9]/70">
                      {label}
                    </span>
                    <span className="font-medium text-[#353535] dark:text-white">
                      {value}%
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 border-t border-[#d9d9d9]/50 pt-3 dark:border-[#353535]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#353535] dark:text-white">
                    Overall
                  </span>
                  <span className="text-lg font-bold text-[#3c6e71]">
                    {details.overall}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
