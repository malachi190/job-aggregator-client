import { createFileRoute } from "@tanstack/react-router";
import { FeedPage } from "@/components/feed/feed-page";

export const Route = createFileRoute("/_app/dashboard/")({
  component: FeedPage,
});