import { FileText } from "lucide-react";

export function CVEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FileText className="mb-4 h-12 w-12 text-[#d9d9d9] dark:text-[#353535]" />
      <h3 className="text-lg font-semibold text-[#353535] dark:text-white">
        No CVs uploaded yet
      </h3>
      <p className="mt-2 max-w-sm text-sm text-[#353535]/70 dark:text-[#d9d9d9]/70">
        Upload your first CV so our AI can tailor it for job applications.
      </p>
    </div>
  );
}