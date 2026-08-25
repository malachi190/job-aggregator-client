import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Download, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/spinner';
import {
  type ApplicationStatus,
  useApplications,
  useDeleteApplication,
  useUpdateApplicationStatus,
} from '@/hooks/api/use-applications';

export const Route = createFileRoute("/_app/applications/")({
  component: ApplicationsPage,
});

const statuses: ApplicationStatus[] = ['PENDING', 'APPLIED', 'INTERVIEW', 'REJECTED'];

function ApplicationsPage() {
  const navigate = useNavigate();
  const { data: applications, isLoading } = useApplications();
  const updateStatus = useUpdateApplicationStatus();
  const remove = useDeleteApplication();

  if (isLoading) return <LoadingSpinner className="min-h-[50vh]" size={36} />;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
      <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track every role and keep your application status current.</p>
      </div>

      {!applications?.length ? (
        <Card><CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No applications recorded yet.</p>
          <Button className="mt-4" onClick={() => navigate({ to: '/dashboard' })}>Browse jobs</Button>
        </CardContent></Card>
      ) : applications.map((application) => (
        <Card key={application.id}>
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{application.job.title}</p>
              <p className="text-sm text-[#3c6e71]">{application.job.company}</p>
              <p className="mt-1 text-xs text-muted-foreground">Added {new Date(application.createdAt).toLocaleDateString()}</p>
            </div>
            <select
              value={application.status}
              onChange={(event) => updateStatus.mutate({ id: application.id, status: event.target.value as ApplicationStatus })}
              className="h-10 rounded-lg border bg-background px-3 text-sm"
            >
              {statuses.map((status) => <option key={status} value={status}>{status[0] + status.slice(1).toLowerCase()}</option>)}
            </select>
            <div className="flex gap-1">
              {application.cvDocUrl && <Button variant="ghost" size="icon" onClick={() => window.open(application.cvDocUrl!, '_blank')}><Download className="h-4 w-4" /></Button>}
              {application.job.applyUrl && <Button variant="ghost" size="icon" onClick={() => window.open(application.job.applyUrl!, '_blank', 'noopener,noreferrer')}><ExternalLink className="h-4 w-4" /></Button>}
              <Button variant="ghost" size="icon" onClick={() => remove.mutate(application.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
