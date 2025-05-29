
import { cn } from "@/lib/utils";
import type { EndpointType } from "@/data/mockData";

interface EndpointLabelProps {
  type: EndpointType | 'Custom';
  className?: string;
}

export function EndpointLabel({ type, className }: EndpointLabelProps) {
  let labelText = '';
  let typeClasses = '';
  
  switch(type) {
    case 'HTTP_SSE':
      labelText = 'HTTP SSE';
      typeClasses = "text-blue-500 font-medium bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded";
      break;
    case 'STDIO':
      labelText = 'STDIO';
      typeClasses = "text-purple-500 font-medium bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded";
      break;
    case 'WS':
      labelText = 'WebSocket';
      typeClasses = "text-green-500 font-medium bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded";
      break;
    case 'Custom':
      labelText = 'Custom';
      typeClasses = "text-gray-500 font-medium bg-gray-50 dark:bg-gray-800/30 px-2 py-0.5 rounded";
      break;
  }
  
  return (
    <span className={cn("text-sm", typeClasses, className)}>
      {labelText}
    </span>
  );
}
