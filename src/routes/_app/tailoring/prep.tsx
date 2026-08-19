import { createFileRoute } from "@tanstack/react-router";
import { TailoringPrepPage } from "@/components/tailoring/tailoring-prep-page";

export const Route = createFileRoute("/_app/tailoring/prep")({
  component: TailoringPrepPage,
  validateSearch: (search: Record<string, unknown>) => ({
    jobId: (search.jobId as string) || "",
  }),
});