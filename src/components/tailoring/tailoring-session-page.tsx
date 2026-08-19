import { useState } from "react";
import { useParams, useLocation, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Briefcase } from "lucide-react";
import { CVPreview } from "./cv-preview";
import { CoverLetterPreview } from "./cover-letter-preview";
import { RefineForm } from "./refine-form";
import { TailoringActions } from "./tailoring-actions";
import type { TailoringContent, Job } from "@/types";

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

  const job = state?.job;
  const jobId = state?.jobId || "";

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

  const handleAccepted = () => {
    setIsAccepted(true);
    // If your accept endpoint returns URLs, capture them:
    // setDownloadUrls({ cvUrl: data.cvUrl, coverLetterUrl: data.coverLetterUrl });
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
          <div className="mt-1 flex flex-wrap gap-2 text-sm text-[#353535]/60 dark:text-[#d9d9d9]/60">
            <span>{job.location}</span>
            {job.isRemote && (
              <Badge className="bg-[#3c6e71]/10 text-[10px] text-[#3c6e71] hover:bg-[#3c6e71]/20">
                Remote
              </Badge>
            )}
          </div>
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
          jobUrl={job?.url}
          isAccepted={isAccepted}
          downloadUrls={downloadUrls}
          onAccepted={handleAccepted}
        />
      </div>
    </div>
  );
}