import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/spinner';
import { useProfile, useUpdateProfile } from '@/hooks/api/use-profile';
import { toast } from 'sonner';

export const Route = createFileRoute("/_app/settings/")({
  component: SettingsPage,
});

function SettingsPage() {
  const { data: profile, isLoading } = useProfile();
  const update = useUpdateProfile();
  const [form, setForm] = useState({ fullName: '', role: '', seniority: '', location: '', skills: '', jobTitles: '', remotePref: true, salaryMin: '', salaryMax: '' });

  useEffect(() => {
    if (!profile) return;
    setForm({
      fullName: profile.fullName,
      role: profile.role,
      seniority: profile.seniority,
      location: profile.location,
      skills: profile.skills.join(', '),
      jobTitles: profile.jobTitles.join(', '),
      remotePref: profile.remotePref,
      salaryMin: profile.salaryMin?.toString() ?? '',
      salaryMax: profile.salaryMax?.toString() ?? '',
    });
  }, [profile]);

  if (isLoading) return <LoadingSpinner className="min-h-[50vh]" size={36} />;

  const set = (key: keyof typeof form, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    update.mutate({
      fullName: form.fullName,
      role: form.role,
      seniority: form.seniority,
      location: form.location,
      skills: form.skills.split(',').map((value) => value.trim()).filter(Boolean),
      jobTitles: form.jobTitles.split(',').map((value) => value.trim()).filter(Boolean),
      remotePref: form.remotePref,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
    }, { onSuccess: () => toast.success('Profile updated') });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Update the profile used to rank your job feed.</p>
      <Card className="mt-5 sm:mt-6"><CardHeader className="p-5 sm:p-6"><CardTitle>Job preferences</CardTitle></CardHeader><CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          {([['fullName', 'Full name'], ['role', 'Current role'], ['seniority', 'Seniority'], ['location', 'Location']] as const).map(([key, label]) => <div key={key} className="space-y-2"><Label>{label}</Label><Input value={form[key]} onChange={(event) => set(key, event.target.value)} required /></div>)}
          <div className="space-y-2 sm:col-span-2"><Label>Skills (comma separated)</Label><Input value={form.skills} onChange={(event) => set('skills', event.target.value)} required /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Target job titles (comma separated)</Label><Input value={form.jobTitles} onChange={(event) => set('jobTitles', event.target.value)} required /></div>
          <div className="space-y-2"><Label>Minimum salary</Label><Input type="number" min="0" value={form.salaryMin} onChange={(event) => set('salaryMin', event.target.value)} /></div>
          <div className="space-y-2"><Label>Maximum salary</Label><Input type="number" min="0" value={form.salaryMax} onChange={(event) => set('salaryMax', event.target.value)} /></div>
          <label className="flex items-center gap-2 sm:col-span-2"><input type="checkbox" checked={form.remotePref} onChange={(event) => set('remotePref', event.target.checked)} /> Prefer remote roles</label>
          <Button className="sm:col-span-2" disabled={update.isPending}>{update.isPending ? 'Saving…' : 'Save settings'}</Button>
        </form>
      </CardContent></Card>
    </div>
  );
}
