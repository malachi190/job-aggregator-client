import { Card, CardContent } from "@/components/ui/card";
import type { CoverLetter } from "@/types";

interface CoverLetterPreviewProps {
  coverLetter: CoverLetter;
}

export function CoverLetterPreview({ coverLetter }: CoverLetterPreviewProps) {
  const paragraphs = coverLetter.body
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0);

  return (
    <Card className="rounded-xl border-[#d9d9d9]/50 dark:border-[#353535]">
      <CardContent className="space-y-4 p-6">
        <p className="text-sm text-[#353535]/80 dark:text-[#d9d9d9]/80">
          {coverLetter.greeting}
        </p>

        <div className="space-y-3">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed text-[#353535]/80 dark:text-[#d9d9d9]/80"
            >
              {para}
            </p>
          ))}
        </div>

        <p className="text-sm text-[#353535]/80 dark:text-[#d9d9d9]/80">
          {coverLetter.closing}
        </p>
      </CardContent>
    </Card>
  );
}