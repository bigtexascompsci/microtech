import * as React from "react";
import { cn } from "@/lib/utils";

const EmptyState = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "relative w-full inline-flex items-center justify-center rounded-lg border-2 p-12 text-center hover:border-opacity-50",
      "border-dashed border-border bg-card text-card-foreground",
      "dark:border-dashed dark:border-border dark:bg-card dark:text-card-foreground",
      className
    )}
    {...props}
  >
    {children}
  </button>
));
EmptyState.displayName = "EmptyState";

export default EmptyState;
