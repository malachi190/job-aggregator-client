import { Badge } from "@/components/ui/badge";
import type { Job } from "@/types";

interface JobSkillsProps {
  job: Job;
}

export function JobSkills({ job }: JobSkillsProps) {
  if (!job.skills?.length) return null;
  const skills = job.skills.filter(
    (skill, index, all) =>
      all.findIndex(
        (candidate) => candidate.toLowerCase() === skill.toLowerCase(),
      ) === index,
  );

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-[#353535] dark:text-white">
        Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge
            key={skill}
            variant="outline"
            className="border-[#d9d9d9] px-3 py-1 text-sm dark:border-[#353535]"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}
