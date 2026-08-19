import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-[#d9d9d9] bg-white px-3 py-2 text-sm text-[#353535] placeholder:text-[#353535]/40 focus:border-[#3c6e71] focus:outline-none focus:ring-1 focus:ring-[#3c6e71] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#353535] dark:bg-[#353535] dark:text-[#d9d9d9] dark:placeholder:text-[#d9d9d9]/40",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
export { Textarea };