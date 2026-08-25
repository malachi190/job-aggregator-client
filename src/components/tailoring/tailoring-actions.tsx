import { Button } from "@/components/ui/button";
import { Loader2, Check, ExternalLink, Download } from "lucide-react";
import { useAcceptTailoring } from "@/hooks/api/use-tailoring";

interface TailoringActionsProps {
  sessionId: string;
  jobId: string;
  applyUrl?: string | null;
  isAccepted: boolean;
  downloadUrls?: { cvUrl?: string; coverLetterUrl?: string };
  onAccepted: (urls: { cvUrl: string; coverLetterUrl: string }) => void;
}

export function TailoringActions({
  sessionId,
  jobId,
  applyUrl,
  isAccepted,
  downloadUrls,
  onAccepted,
}: TailoringActionsProps) {
  const accept = useAcceptTailoring();

  const handleAccept = () => {
    accept.mutate(sessionId, {
      onSuccess: (data) => onAccepted(data),
    });
  };

  const handleApply = () => {
    if (applyUrl) window.open(applyUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-3">
      {!isAccepted ? (
        <Button
          className="w-full gap-2 bg-[#3c6e71] hover:bg-[#284b63]"
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
        <div className="grid grid-cols-2 gap-3">
          {downloadUrls?.cvUrl && (
            <Button
              variant="outline"
              className="gap-2 border-[#d9d9d9] dark:border-[#353535]"
              onClick={() => window.open(downloadUrls.cvUrl, "_blank")}
            >
              <Download className="h-4 w-4" />
              Download CV
            </Button>
          )}
          {downloadUrls?.coverLetterUrl && (
            <Button
              variant="outline"
              className="gap-2 border-[#d9d9d9] dark:border-[#353535]"
              onClick={() => window.open(downloadUrls.coverLetterUrl, "_blank")}
            >
              <Download className="h-4 w-4" />
              Cover Letter
            </Button>
          )}
        </div>
      )}

      <Button
        variant="outline"
        className="w-full gap-2 border-[#d9d9d9] dark:border-[#353535]"
        onClick={handleApply}
        disabled={!applyUrl}
      >
        <ExternalLink className="h-4 w-4" />
        Apply to Job
      </Button>
    </div>
  );
}
