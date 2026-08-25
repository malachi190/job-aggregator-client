import { useEffect, useState } from "react";
import { useParams, useLocation } from "@tanstack/react-router";
import { CVPreview } from "./cv-preview";
import { CoverLetterPreview } from "./cover-letter-preview";
import { RefineForm } from "./refine-form";
import { TailoringActions } from "./tailoring-actions";
import type { TailoringContent, Job } from "@/types";
import { Briefcase, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useTailoringSession } from '@/hooks/api/use-tailoring';
import { LoadingSpinner } from '@/components/ui/spinner';

export function TailoringSessionPage() {
  const { sessionId } = useParams({ from: "/_app/tailoring/$sessionId" });
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as
    | {
        content?: TailoringContent;
        jobId?: string;
        job?: Job;
      }
    | undefined;

  const [content, setContent] = useState<TailoringContent | undefined>(
    state?.content,
  );
  const [isAccepted, setIsAccepted] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState<{
    cvUrl?: string;
    coverLetterUrl?: string;
  }>({});

  const { data: restored, isLoading } = useTailoringSession(sessionId, !state?.content);

  useEffect(() => {
    if (restored?.content) setContent(restored.content);
  }, [restored]);

  const job = state?.job ?? restored?.job ?? undefined;
  const jobId = state?.jobId || restored?.jobId || "";

  if (isLoading) return <LoadingSpinner className="min-h-[50vh]" size={36} />;

  if (!content) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <Briefcase className="mx-auto mb-4 h-12 w-12 text-[#d9d9d9] dark:text-[#353535]" />
        <h2 className="text-lg font-semibold text-[#353535] dark:text-white">
          Session not found
        </h2>
        <p className="mt-2 text-sm text-[#353535]/70 dark:text-[#d9d9d9]/70">
          Return to the feed and start a new tailoring session.
        </p>
        <Button
          className="mt-6 gap-2 bg-[#3c6e71] hover:bg-[#284b63]"
          onClick={() => navigate({ to: "/dashboard" })}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Feed
        </Button>
      </div>
    );
  }

  const handleRefined = (newContent: TailoringContent) => {
    setContent(newContent);
  };

  const handleAccepted = (urls: { cvUrl: string; coverLetterUrl: string }) => {
    setIsAccepted(true);
    setDownloadUrls(urls);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Button
        variant="ghost"
        className="mb-6 gap-2 pl-0 text-[#353535]/70 hover:text-[#353535] dark:text-[#d9d9d9]/70 dark:hover:text-white"
        onClick={() => navigate({ to: "/dashboard" })}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to feed
      </Button>

      {/* Job header */}
      {job && (
        <div className="mb-6">
          <p className="text-sm font-semibold text-[#3c6e71]">{job.company}</p>
          <h1 className="mt-1 text-xl font-bold text-[#353535] dark:text-white">
            {job.title}
          </h1>
          <p className="mt-1 text-sm text-[#353535]/60 dark:text-[#d9d9d9]/60">
            {job.location}
            {job.isRemote && " • Remote"}
          </p>
        </div>
      )}

      {/* Split view */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#353535]/60 dark:text-[#d9d9d9]/60">
            Tailored CV
          </h2>
          <CVPreview cv={content.cv} />
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#353535]/60 dark:text-[#d9d9d9]/60">
            Cover Letter
          </h2>
          <CoverLetterPreview coverLetter={content.coverLetter} />
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 space-y-6 rounded-xl border border-[#d9d9d9]/50 bg-white p-6 dark:border-[#353535] dark:bg-[#353535]">
        {!isAccepted && (
          <RefineForm sessionId={sessionId} onRefined={handleRefined} />
        )}

        <TailoringActions
          sessionId={sessionId}
          jobId={jobId}
          applyUrl={job?.applyUrl}
          isAccepted={isAccepted}
          downloadUrls={downloadUrls}
          onAccepted={handleAccepted}
        />
      </div>
    </div>
  );
}
