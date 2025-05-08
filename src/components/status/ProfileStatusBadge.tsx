
import React from 'react';
import { cn } from "@/lib/utils";
import { Clock, CheckCircle } from "lucide-react";

interface ProfileStatusBadgeProps {
  isValid: boolean;
  className?: string;
}

export function ProfileStatusBadge({
  isValid,
  className
}: ProfileStatusBadgeProps) {
  return (
    <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", 
      isValid 
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      className
    )}>
      {isValid ? (
        <>
          <CheckCircle className="h-3 w-3" />
          <span>Valid</span>
        </>
      ) : (
        <>
          <Clock className="h-3 w-3" />
          <span>Expired</span>
        </>
      )}
    </div>
  );
}
