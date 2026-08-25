import { useNavigate } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowRight } from "lucide-react";
import type { FeedItem } from "@/types";
import { formatSalaryAmount } from "@/lib/currency";

interface JobCardProps {
  item: FeedItem;
}

function timeAgo(date: string): string {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000,
  );
  const intervals = [
    { label: "y", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "w", seconds: 604800 },
    { label: "d", seconds: 86400 },
    { label: "h", seconds: 3600 },
    { label: "m", seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count}${interval.label} ago`;
  }
  return "Just now";
}

export function JobCard({ item }: JobCardProps) {
  const navigate = useNavigate();
  const { job, score } = item;
  const matchPercent = Math.round(score * 100);

  const scoreColor =
    matchPercent >= 80
      ? "bg-[#3c6e71] text-white"
      : matchPercent >= 50
        ? "bg-[#284b63] text-white"
        : "bg-[#d9d9d9] text-[#353535]";

  const handleViewDetails = () => {
    navigate({
      to: "/dashboard/$jobId",
      params: { jobId: job.id },
      state: { item } as Record<string, unknown>,
    });
  };

  return (
    <Card className="group relative overflow-hidden rounded-xl transition-shadow hover:shadow-md">
      <Badge className={`absolute right-4 top-4 z-10 ${scoreColor}`}>
        {matchPercent}% match
      </Badge>

      <CardContent className="p-5">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#3c6e71]">{job.company}</p>
          <h3 className="mt-1 text-lg font-bold text-[#353535] dark:text-white">
            {job.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#353535]/70 dark:text-[#d9d9d9]/70">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{job.location}</span>
            {job.isRemote && (
              <Badge
                variant="secondary"
                className="bg-[#3c6e71]/10 text-[#3c6e71] hover:bg-[#3c6e71]/20"
              >
                Remote
              </Badge>
            )}
          </div>

          {job.salaryMin !== null && (
            <p className="mt-2 text-sm font-medium text-[#353535] dark:text-[#d9d9d9]">
              {formatSalaryAmount(job.salaryMin, job.salaryCurrency)}
              {job.salaryMax !== null &&
                ` – ${formatSalaryAmount(job.salaryMax, job.salaryCurrency)}`}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.skills.slice(0, 4).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="border-[#d9d9d9] text-xs dark:border-[#353535]"
              >
                {skill}
              </Badge>
            ))}
            {job.skills.length > 4 && (
              <Badge
                variant="outline"
                className="border-[#d9d9d9] text-xs dark:border-[#353535]"
              >
                +{job.skills.length - 4}
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#d9d9d9]/50 pt-3 text-xs text-[#353535]/50 dark:border-[#353535]/50 dark:text-[#d9d9d9]/50">
          <span>{timeAgo(job.postedAt)}</span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-white/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 dark:bg-[#353535]/60">
          <Button
            className="gap-2 bg-[#3c6e71] hover:bg-[#284b63]"
            onClick={handleViewDetails}
          >
            View Job
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
