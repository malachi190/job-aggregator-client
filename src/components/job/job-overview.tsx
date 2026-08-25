import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Briefcase, DollarSign, Calendar, Shield } from "lucide-react";
import type { Job } from "@/types";
import { formatSalaryAmount } from "@/lib/currency";

interface JobOverviewProps {
  job: Job;
}

export function JobOverview({ job }: JobOverviewProps) {
  const sourceName =
    ({ remotive: "Remotive", jobberman: "Jobberman", myjobmag: "MyJobMag" }[
      job.source?.name.toLowerCase() || ""
    ] ??
      job.source?.name) ||
    "verified job board";
  const items = [
    {
      icon: MapPin,
      label: "Location",
      value: job.location,
    },
    {
      icon: Briefcase,
      label: "Work Arrangement",
      value: job.isRemote
        ? "Remote"
        : job.employmentType
          ? job.employmentType
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())
          : "On-site",
    },
    {
      icon: DollarSign,
      label: "Salary",
      value:
        job.salaryMin != null
          ? `${formatSalaryAmount(job.salaryMin, job.salaryCurrency)}${job.salaryMax != null ? ` – ${formatSalaryAmount(job.salaryMax, job.salaryCurrency)}` : ""}`
          : "Not specified",
    },
    {
      icon: Calendar,
      label: "Posted",
      value: new Date(job.postedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="rounded-xl border-[#d9d9d9]/50 dark:border-[#353535]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#353535] dark:text-white">
            Job Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3c6e71]/10">
                <Icon className="h-4 w-4 text-[#3c6e71]" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#353535]/50 dark:text-[#d9d9d9]/50">
                  {label}
                </p>
                <p className="text-sm font-semibold text-[#353535] dark:text-white">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Trust info */}
      <div className="flex items-start gap-3 rounded-xl border border-[#d9d9d9]/50 bg-white p-4 dark:border-[#353535] dark:bg-[#353535]">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#3c6e71]" />
        <p className="text-xs leading-relaxed text-[#353535]/70 dark:text-[#d9d9d9]/70">
          Source: {sourceName}. Applications open on the original listing.
        </p>
      </div>
    </div>
  );
}
