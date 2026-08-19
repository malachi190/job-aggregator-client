import type { Job } from "@/types";

interface JobDescriptionProps {
  job: Job;
}

export function JobDescription({ job }: JobDescriptionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#353535] dark:text-white">
        About this role
      </h2>
      <div
        className="prose prose-sm max-w-none text-[#353535]/80 dark:prose-invert dark:text-[#d9d9d9]/80"
        dangerouslySetInnerHTML={{ __html: job.description }}
      />
    </div>
  );
}