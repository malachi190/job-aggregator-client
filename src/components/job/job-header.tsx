import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, Building2 } from "lucide-react";
import type { Job } from "@/types";

function timeAgo(date: string): string {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000,
  );
  const intervals = [
    { label: "y", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "w", seconds: 604800 },
    { label: "d", seconds: 86400 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count}${interval.label} ago`;
  }
  return "Just now";
}

function companyInitial(name: string | undefined): string {
  return name?.charAt(0).toUpperCase() ?? "?";
}

interface JobHeaderProps {
  job: Job;
  matchScore?: number;
}

export function JobHeader({ job, matchScore }: JobHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        className="gap-2 pl-0 text-sm text-[#353535]/70 hover:text-[#353535] dark:text-[#d9d9d9]/70 dark:hover:text-white"
        onClick={() => navigate({ to: "/dashboard" })}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </Button>

      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#3c6e71] text-xl font-bold text-white">
          {companyInitial(job.company)}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <h1 className="text-xl font-bold leading-tight text-[#353535] dark:text-white sm:text-2xl">
            {job.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#353535]/70 dark:text-[#d9d9d9]/70">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              {job.company}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {timeAgo(job.postedAt)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {job.isRemote && (
              <Badge className="bg-[#3c6e71]/10 text-[10px] text-[#3c6e71] hover:bg-[#3c6e71]/20">
                Remote
              </Badge>
            )}
            {matchScore !== undefined && (
              <Badge className="bg-[#284b63]/10 text-[10px] text-[#284b63] hover:bg-[#284b63]/20">
                {Math.round(matchScore * 100)}% match
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
