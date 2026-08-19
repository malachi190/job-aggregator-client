import { Button } from "@/components/ui/button";
import { Loader2, Check, ExternalLink, Download } from "lucide-react";
import { useAcceptTailoring, useCreateApplication } from "@/hooks/api/use-tailoring";

interface TailoringActionsProps {
  sessionId: string;
  jobId: string;
  jobUrl?: string;
  isAccepted: boolean;
  downloadUrls?: { cvUrl?: string; coverLetterUrl?: string };
  onAccepted: () => void;
}

export function TailoringActions({
  sessionId,
  jobId,
  jobUrl,
  isAccepted,
  downloadUrls,
  onAccepted,
}: TailoringActionsProps) {
  const accept = useAcceptTailoring();
  const apply = useCreateApplication();

  const handleAccept = () => {
    accept.mutate(sessionId, {
      onSuccess: () => onAccepted(),
    });
  };

  const handleApply = () => {
    apply.mutate(
      { jobId, tailoringSessionId: sessionId, status: "applied" },
      {
        onSuccess: () => {
          if (jobUrl) {
            window.open(jobUrl, "_blank", "noopener,noreferrer");
          }
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {!isAccepted ? (
        <Button
          className="flex-1 gap-2 bg-[#3c6e71] hover:bg-[#284b63]"
          onClick={handleAccept}
          disabled={accept.isPending}
        >
          {accept.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          {accept.isPending ? "Saving..." : "Accept & Save"}
        </Button>
      ) : (
        <>
          {downloadUrls?.cvUrl && (
            <Button
              variant="outline"
              className="flex-1 gap-2 border-[#d9d9d9] dark:border-[#353535]"
              onClick={() => window.open(downloadUrls.cvUrl, "_blank")}
            >
              <Download className="h-4 w-4" />
              Download CV
            </Button>
          )}
          {downloadUrls?.coverLetterUrl && (
            <Button
              variant="outline"
              className="flex-1 gap-2 border-[#d9d9d9] dark:border-[#353535]"
              onClick={() => window.open(downloadUrls.coverLetterUrl, "_blank")}
            >
              <Download className="h-4 w-4" />
              Download Cover Letter
            </Button>
          )}
        </>
      )}

      <Button
        variant="outline"
        className="flex-1 gap-2 border-[#d9d9d9] dark:border-[#353535]"
        onClick={handleApply}
        disabled={apply.isPending || !jobUrl}
      >
        {apply.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ExternalLink className="h-4 w-4" />
        )}
        {apply.isPending ? "Recording..." : "Apply to Job"}
      </Button>
    </div>
  );
}