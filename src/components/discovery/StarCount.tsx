
import React from "react";
import { Star } from "lucide-react";

interface StarCountProps {
  count: number;
  className?: string;
}

export const StarCount = ({ count, className = "" }: StarCountProps) => {
  const formattedCount = count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count;
  
  return (
    <div className={`flex items-center text-xs text-muted-foreground ${className}`}>
      <Star className="h-3.5 w-3.5 mr-1 text-amber-400 fill-amber-400" />
      <span>{formattedCount}</span>
    </div>
  );
};
