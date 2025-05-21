
import { cn } from "@/lib/utils";
import type { EndpointType } from "@/data/mockData";

interface EndpointLabelProps {
  type: EndpointType | 'Custom' | 'Combined';
  className?: string;
  types?: EndpointType[]; // New prop for combined types
}

export function EndpointLabel({ type, types, className }: EndpointLabelProps) {
  // If it's a combined type with provided types array
  if (type === 'Combined' && types && types.length > 0) {
    return (
      <div className="flex items-center gap-1">
        {types.map((connectionType, index) => (
          <span 
            key={index}
            className={cn(
              "text-xs px-1.5 py-0.5 rounded-full border flex items-center",
              connectionType === 'HTTP_SSE' && "text-blue-500 bg-blue-50 border-blue-100 dark:bg-blue-950/30 dark:border-blue-800",
              connectionType === 'STDIO' && "text-purple-500 bg-purple-50 border-purple-100 dark:bg-purple-950/30 dark:border-purple-800",
              connectionType === 'WS' && "text-green-500 bg-green-50 border-green-100 dark:bg-green-950/30 dark:border-green-800"
            )}
          >
            {connectionType === 'HTTP_SSE' ? 'HTTP' : 
              connectionType === 'STDIO' ? 'STDIO' : 
              connectionType === 'WS' ? 'WS' : ''}
          </span>
        ))}
      </div>
    );
  }
  
  // Original single type label logic
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
