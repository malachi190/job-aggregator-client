import { JobDetailPage } from "@/components/job/job-detail-page";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/_app/dashboard/$jobId")({
  component: JobDetailPage,
});