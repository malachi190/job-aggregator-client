import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Globe } from "lucide-react";
import type { TailoredCV } from "@/types";
import LinkedinLogoIcon from "../icons/linked-in";
import GithubLogoIcon from "../icons/github";

interface CVPreviewProps {
  cv: TailoredCV;
}

export function CVPreview({ cv }: CVPreviewProps) {
  // console.log("cv", cv);
  const contact = cv.contact;

  return (
    <Card className="rounded-xl border-[#d9d9d9]/50 dark:border-[#353535]">
      <CardContent className="space-y-5 p-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#353535] dark:text-white">
            {cv.title || "Untitled CV"}
          </h2>
          <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-[#353535]/70 dark:text-[#d9d9d9]/70">
            {contact.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {contact.email}
              </span>
            )}
            {contact.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {contact.phone}
              </span>
            )}
            {contact.linkedin && (
              <span className="flex items-center gap-1">
                <LinkedinLogoIcon />
                LinkedIn
              </span>
            )}
            {contact.github && (
              <span className="flex items-center gap-1">
                <GithubLogoIcon />
                GitHub
              </span>
            )}
            {contact.portfolio && (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Portfolio
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        {cv.summary && (
          <div>
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#3c6e71]">
              Summary
            </h3>
            <p className="text-sm leading-relaxed text-[#353535]/80 dark:text-[#d9d9d9]/80">
              {cv.summary}
            </p>
          </div>
        )}

        {/* Skills */}
        {Object.keys(cv.skills).length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#3c6e71]">
              Skills
            </h3>
            <div className="space-y-2">
              {Object.entries(cv.skills).map(([category, skills]) => {
                // Normalize: backend may return string "a, b, c" or array ["a", "b", "c"]
                const skillList = Array.isArray(skills)
                  ? skills
                  : typeof skills === "string"
                    ? skills
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    : [];

                return (
                  <div key={category}>
                    <p className="text-xs font-medium text-[#353535]/60 dark:text-[#d9d9d9]/60">
                      {category}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {skillList.map((skill: any) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="border-[#d9d9d9] text-xs dark:border-[#353535]"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Experience */}
        {cv.experience.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#3c6e71]">
              Experience
            </h3>
            <div className="space-y-3">
              {cv.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-semibold text-[#353535] dark:text-white">
                      {exp.role}
                    </p>
                    <span className="text-xs text-[#353535]/50 dark:text-[#d9d9d9]/50">
                      {exp.duration}
                    </span>
                  </div>
                  <p className="text-xs text-[#3c6e71]">{exp.company}</p>
                  {exp.bullets && (
                    <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm text-[#353535]/70 dark:text-[#d9d9d9]/70">
                      {exp.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {cv.education.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#3c6e71]">
              Education
            </h3>
            <div className="space-y-2">
              {cv.education.map((edu, i) => (
                <div key={i}>
                  <p className="text-sm font-semibold text-[#353535] dark:text-white">
                    {edu.degree}
                  </p>
                  <p className="text-xs text-[#353535]/60 dark:text-[#d9d9d9]/60">
                    {edu.institution} {edu.year && `• ${edu.year}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {cv.projects.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#3c6e71]">
              Projects
            </h3>
            <div className="space-y-2">
              {cv.projects.map((proj, i) => {
                const techList = Array.isArray(proj.tech)
                  ? proj.tech
                  : typeof proj.tech === "string"
                    ? proj.tech
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                    : [];

                return (
                  <div key={i}>
                    <p className="text-sm font-semibold text-[#353535] dark:text-white">
                      {proj.name}
                    </p>
                    <p className="text-xs text-[#353535]/60 dark:text-[#d9d9d9]/60">
                      {proj.description}
                    </p>
                    {techList.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {techList.map((t: any) => (
                          <Badge
                            key={t}
                            variant="secondary"
                            className="bg-[#3c6e71]/10 text-[10px] text-[#3c6e71]"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
