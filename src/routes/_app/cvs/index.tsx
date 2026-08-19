import { createFileRoute } from "@tanstack/react-router";
import { CVPage } from "@/components/cv/cv-page";

export const Route = createFileRoute("/_app/cvs/")({
  component: CVPage,
});