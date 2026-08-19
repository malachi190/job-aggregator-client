import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/settings/")({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Profile & CV management coming in the next step.
      </p>
    </div>
  )
}