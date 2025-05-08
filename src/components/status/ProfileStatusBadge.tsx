
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
    <div className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium",
      isValid 
        ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800" 
        : "bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800",
      className
    )}>
      {isValid ? (
        <CheckCircle className="h-3 w-3" />
      ) : (
        <Clock className="h-3 w-3" />
      )}
      <span>{isValid ? 'Active' : 'Expired'}</span>
    </div>
  );
}
