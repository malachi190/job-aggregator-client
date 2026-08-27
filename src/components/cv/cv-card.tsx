import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, FileText, Loader2 } from "lucide-react";
import type { BaseCV } from "@/types";

interface CVCardProps {
  cv: BaseCV;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
  isSettingDefault: boolean;
  isDeleting: boolean;
}

export function CVCard({
  cv,
  onSetDefault,
  onDelete,
  isSettingDefault,
  isDeleting,
}: CVCardProps) {
  const fileExt = cv.fileType?.toUpperCase() || "PDF";

  return (
    <Card className="rounded-xl border-[#d9d9d9]/50 dark:border-[#353535]">
      <CardContent className="flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap sm:gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#3c6e71]/10">
          <FileText className="h-6 w-6 text-[#3c6e71]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-[#353535] dark:text-white">
              {cv.name}
            </h3>
            {cv.isDefault && (
              <Badge className="bg-[#3c6e71] text-[10px] text-white hover:bg-[#3c6e71]">
                Default
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-xs text-[#353535]/60 dark:text-[#d9d9d9]/60">
            {fileExt} • {cv.parsedData.pageCount} pages •{" "}
            {(cv.fileSize / 1024).toFixed(0)} KB
          </p>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          {!cv.isDefault && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#353535]/50 hover:text-[#3c6e71]"
              onClick={() => onSetDefault(cv.id)}
              disabled={isSettingDefault}
            >
              {isSettingDefault ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Star className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#353535]/50 hover:text-red-500"
            onClick={() => onDelete(cv.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
