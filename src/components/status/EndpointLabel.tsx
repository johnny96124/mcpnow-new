
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
      typeClasses = "text-blue-600";
      break;
    case 'STDIO':
      labelText = 'STDIO';
      typeClasses = "text-purple-600";
      break;
    case 'WS':
      labelText = 'WebSocket';
      typeClasses = "text-green-600";
      break;
    case 'Custom':
      labelText = 'Custom';
      typeClasses = "text-gray-600";
      break;
  }
  
  const baseClasses = "px-2 py-0.5 text-xs font-medium rounded-md";
  
  return (
    <span className={cn(baseClasses, typeClasses, className)}>
      {labelText}
    </span>
  );
}
