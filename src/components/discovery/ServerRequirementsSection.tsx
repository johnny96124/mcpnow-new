
import { Database, Terminal, HardDrive } from "lucide-react";

interface Requirement {
  type: 'llm' | 'tool' | 'memory';
  value: string;
}

interface ServerRequirementsSectionProps {
  requirements?: Requirement[];
}

export function ServerRequirementsSection({ requirements }: ServerRequirementsSectionProps) {
  if (!requirements || requirements.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
        REQUIREMENTS
      </h3>
      
      <div className="space-y-3">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center text-sm">
            {req.type === 'llm' && (
              <Database className="h-5 w-5 mr-2 text-gray-500" />
            )}
            {req.type === 'tool' && (
              <Terminal className="h-5 w-5 mr-2 text-gray-500" />
            )}
            {req.type === 'memory' && (
              <HardDrive className="h-5 w-5 mr-2 text-gray-500" />
            )}
            <span>
              {req.type === 'llm' && 'LLM invocation'}
              {req.type === 'tool' && 'Tool invocation'}
              {req.type === 'memory' && `Maximum memory ${req.value}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
