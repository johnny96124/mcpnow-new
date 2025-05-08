
import React from 'react';
import { cn } from "@/lib/utils";

interface ProfileStatusBadgeProps {
  isValid: boolean;
  className?: string;
}

export function ProfileStatusBadge({ isValid, className }: ProfileStatusBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium",
      isValid 
        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800"
        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800",
      className
    )}>
      {isValid ? "Valid" : "Expired"}
    </div>
  );
}
