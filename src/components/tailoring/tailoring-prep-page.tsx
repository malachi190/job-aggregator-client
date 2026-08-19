import { useState } from "react";
import { useSearch, useNavigate, useLocation } from "@tanstack/react-router";
import { useBaseCVs } from "@/hooks/api/use-base-cvs";
import { useGenerateTailoring } from "@/hooks/api/use-tailoring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Loader2,
  Wand2,
  ArrowLeft,
  FileText,
  Check,
  Briefcase,
} from "lucide-react";
import { useJob } from "@/hooks/api/use-feed";
import { LoadingSpinner } from "../ui/spinner";

export function TailoringPrepPage() {
  const { jobId } = useSearch({ from: "/_app/tailoring/prep" });
  const location = useLocation();
  const navigate = useNavigate();
  const { data: item, isLoading: jobLoading } = useJob(jobId);
  const { data: cvs, isLoading: cvsLoading } = useBaseCVs();
  const generate = useGenerateTailoring();

  const [selectedCvId, setSelectedCvId] = useState<string>("");

  const defaultCV = cvs?.find((cv) => cv.isDefault);
  const effectiveCvId = selectedCvId || defaultCV?.id || "";

  const handleGenerate = () => {
    if (!effectiveCvId) return;
    generate.mutate(
      { jobId, baseCvId: effectiveCvId },
      {
        onSuccess: (data) => {
          navigate({
            to: "/tailoring/$sessionId",
            params: { sessionId: data.sessionId },
            state: {
              content: data.content,
              jobId,
              job: item,
            } as Record<string, unknown>,
          });
        },
      },
    );
  };

  if (jobLoading) {
    return <LoadingSpinner className="min-h-screen" size={40} />;
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <Briefcase className="mx-auto mb-4 h-12 w-12 text-[#d9d9d9] dark:text-[#353535]" />
        <h2 className="text-lg font-semibold text-[#353535] dark:text-white">
          Job data not available
        </h2>
        <p className="mt-2 text-sm text-[#353535]/70 dark:text-[#d9d9d9]/70">
          Return to the feed and select a job to tailor your CV.
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Button
        variant="ghost"
        className="mb-6 gap-2 pl-0 text-[#353535]/70 hover:text-[#353535] dark:text-[#d9d9d9]/70 dark:hover:text-white"
        onClick={() => navigate({ to: "/dashboard" })}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to feed
      </Button>

      <div className="space-y-6">
        {/* Job summary */}
        <Card className="rounded-xl border-[#d9d9d9]/50 dark:border-[#353535]">
          <CardHeader>
            <CardTitle className="text-base">Job</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm font-semibold text-[#3c6e71]">
              {item.company}
            </p>
            <h2 className="text-lg font-bold text-[#353535] dark:text-white">
              {item.title}
            </h2>
            <p className="text-sm text-[#353535]/70 dark:text-[#d9d9d9]/70">
              {item.location}
              {item.isRemote && " • Remote"}
            </p>
          </CardContent>
        </Card>

        {/* CV selection */}
        <Card className="rounded-xl border-[#d9d9d9]/50 dark:border-[#353535]">
          <CardHeader>
            <CardTitle className="text-base">Select Base CV</CardTitle>
          </CardHeader>
          <CardContent>
            {cvsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
              </div>
            ) : cvs && cvs.length > 0 ? (
              <div className="space-y-3">
                {cvs.map((cv) => {
                  const isSelected = effectiveCvId === cv.id;
                  return (
                    <button
                      key={cv.id}
                      onClick={() => setSelectedCvId(cv.id)}
                      className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors ${
                        isSelected
                          ? "border-[#3c6e71] bg-[#3c6e71]/5"
                          : "border-[#d9d9d9]/50 hover:border-[#3c6e71]/30 dark:border-[#353535] dark:hover:border-[#3c6e71]/30"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          isSelected
                            ? "bg-[#3c6e71] text-white"
                            : "bg-[#d9d9d9]/30 text-[#353535]/50 dark:bg-[#353535] dark:text-[#d9d9d9]/50"
                        }`}
                      >
                        {isSelected ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <FileText className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-[#353535] dark:text-white">
                            {cv.name}
                          </p>
                          {cv.isDefault && (
                            <Badge className="bg-[#3c6e71] text-[10px] text-white hover:bg-[#3c6e71]">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-[#353535]/60 dark:text-[#d9d9d9]/60">
                          {cv.fileType === "application/pdf" ? "PDF" : "DOCX"} •{" "}
                          {cv.parsedData.pageCount} pages
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-[#353535]/70 dark:text-[#d9d9d9]/70">
                  No CVs uploaded yet.
                </p>
                <Button
                  variant="link"
                  className="mt-2 text-[#3c6e71]"
                  onClick={() => navigate({ to: "/cvs" })}
                >
                  Upload a CV first
                </Button>
              </div>
            )}

            <Button
              className="mt-6 w-full gap-2 bg-[#3c6e71] hover:bg-[#284b63]"
              disabled={!effectiveCvId || generate.isPending}
              onClick={handleGenerate}
            >
              {generate.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              {generate.isPending ? "Generating..." : "Generate Tailored CV"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
