import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/applications/")({
  component: ApplicationsPage,
})

function ApplicationsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Tracker coming in the next step.
      </p>
    </div>
  )
}