
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
      typeClasses = "text-blue-500 font-medium";
      break;
    case 'STDIO':
      labelText = 'STDIO';
      typeClasses = "text-purple-500 font-medium";
      break;
    case 'WS':
      labelText = 'WebSocket';
      typeClasses = "text-green-500 font-medium";
      break;
    case 'Custom':
      labelText = 'Custom';
      typeClasses = "text-gray-500 font-medium";
      break;
  }
  
  return (
    <span className={cn("text-sm", typeClasses, className)}>
      {labelText}
    </span>
  );
}
