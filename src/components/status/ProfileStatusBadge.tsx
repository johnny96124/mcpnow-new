
import React from 'react';
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface ProfileStatusBadgeProps {
  isValid: boolean;
  className?: string;
}

export function ProfileStatusBadge({
  isValid,
  className
}: ProfileStatusBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full",
      isValid 
        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      className
    )}>
      <Clock className="h-3 w-3" />
      {isValid ? "Valid" : "Expired"}
    </div>
  );
}
