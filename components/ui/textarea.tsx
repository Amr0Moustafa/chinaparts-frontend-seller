import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      
      className={cn(
        "border border-gray-300 bg-gray-100 placeholder:text-muted-foreground",
        "flex field-sizing-content min-h-16 w-full rounded-md px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none",
        "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50",
        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "resize-none h-32",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
