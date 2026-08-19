import { TailoringSessionPage } from "@/components/tailoring/tailoring-session-page";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/_app/tailoring/$sessionId")({
  component: TailoringSessionPage,
});