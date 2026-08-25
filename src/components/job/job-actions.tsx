import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, ExternalLink, Upload, Loader2, Bookmark } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useBaseCVs } from "@/hooks/api/use-base-cvs";
import { useCreateApplication } from "@/hooks/api/use-applications";
import { useSavedJobs, useToggleSavedJob } from '@/hooks/api/use-saved-jobs';

interface JobActionsProps {
  jobId: string;
  applyUrl?: string | null;
}

export function JobActions({ jobId, applyUrl }: JobActionsProps) {
  const navigate = useNavigate();
  const { data: cvs, isLoading: cvsLoading } = useBaseCVs();
  const createApplication = useCreateApplication();
  const { data: savedJobs } = useSavedJobs();
  const toggleSaved = useToggleSavedJob();
  const isSaved = savedJobs?.some((saved) => saved.jobId === jobId) ?? false;

  if (cvsLoading) {
    return (
      <Card className="rounded-xl border-[#d9d9d9]/50 dark:border-[#353535]">
        <CardContent className="flex h-32 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-[#3c6e71]" />
        </CardContent>
      </Card>
    );
  }

  const hasCVs = (cvs?.length ?? 0) > 0;

  return (
    <Card className="rounded-xl border-[#d9d9d9]/50 dark:border-[#353535]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-[#353535] dark:text-white">
          Ready to apply?
        </CardTitle>
        <p className="text-xs text-[#353535]/60 dark:text-[#d9d9d9]/60">
          Choose how you'd like to submit your application.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Apply online */}
        {applyUrl && (
          <Button
            className="w-full gap-2 bg-[#3c6e71] hover:bg-[#284b63]"
            onClick={() => {
              window.open(applyUrl, "_blank", "noopener,noreferrer");
              createApplication.mutate(jobId);
            }}
          >
            <ExternalLink className="h-4 w-4" />
            Apply online
          </Button>
        )}

        {/* Tailor CV */}
        {hasCVs ? (
          <Button
            variant="outline"
            className="w-full gap-2 border-[#d9d9d9] dark:border-[#353535]"
            onClick={() =>
              navigate({
                to: "/tailoring/prep",
                search: { jobId },
                state: { item: { job: { id: jobId } } } as Record<string, unknown>,
              })
            }
          >
            <Wand2 className="h-4 w-4" />
            Tailor my CV for this job
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full gap-2 border-[#d9d9d9] dark:border-[#353535]"
            onClick={() => navigate({ to: "/cvs" })}
          >
            <Upload className="h-4 w-4" />
            Upload a CV to Tailor
          </Button>
        )}

        <Button
          variant="ghost"
          className="w-full gap-2 text-[#353535]/70 hover:text-[#353535] dark:text-[#d9d9d9]/70 dark:hover:text-white"
          onClick={() => toggleSaved.mutate({ jobId, saved: isSaved })}
          disabled={toggleSaved.isPending}
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          {isSaved ? 'Saved' : 'Save for later'}
        </Button>
      </CardContent>
    </Card>
  );
}
