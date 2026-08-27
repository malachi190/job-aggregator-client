import { useBaseCVs, useDeleteCV, useSetDefaultCV } from "@/hooks/api/use-base-cvs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CVCard } from "./cv-card";
import { CVUploadForm } from "./cv-upload-form";
import { CVEmptyState } from "./cv-empty-state";

export function CVPage() {
  const { data: cvs, isLoading } = useBaseCVs();
  const deleteCV = useDeleteCV();
  const setDefault = useSetDefaultCV();

  const defaultCV = cvs?.find((cv) => cv.isDefault);
  const cvCount = cvs?.length ?? 0;
  const maxCVs = 3; // free tier

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#353535] dark:text-white">
          My CVs
        </h1>
        <p className="mt-1 text-sm text-[#353535]/60 dark:text-[#d9d9d9]/60">
          {cvCount} of {maxCVs} uploads used
          {defaultCV && ` • Default: ${defaultCV.name}`}
        </p>
      </div>

      <div className="space-y-6">
        {/* Upload form — hide if at max */}
        {cvCount < maxCVs && (
          <Card className="rounded-xl border-[#d9d9d9]/50 dark:border-[#353535]">
            <CardHeader>
              <CardTitle className="text-base">Upload New CV</CardTitle>
            </CardHeader>
            <CardContent>
              <CVUploadForm />
            </CardContent>
          </Card>
        )}

        {/* CV list */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : cvs && cvs.length > 0 ? (
          <div className="space-y-3">
            {cvs.map((cv) => (
              <CVCard
                key={cv.id}
                cv={cv}
                onSetDefault={(id) => setDefault.mutate(id)}
                onDelete={(id) => deleteCV.mutate(id)}
                isSettingDefault={setDefault.isPending}
                isDeleting={deleteCV.isPending}
              />
            ))}
          </div>
        ) : (
          <CVEmptyState />
        )}
      </div>
    </div>
  );
}
