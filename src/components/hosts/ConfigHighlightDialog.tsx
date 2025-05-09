
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConfigHighlightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configPath?: string;
}

export function ConfigHighlightDialog({ open, onOpenChange, configPath }: ConfigHighlightDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Example config in JSON format
  const configContent = {
    "mcpServers": {
      "mcpnow": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/mcpnow", "http://localhost:8008/mcp"]
      }
    }
  };
  
  const configString = JSON.stringify(configContent, null, 2);

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(configString);
    setCopied(true);
    toast({
      title: "Configuration copied",
      description: "Configuration details have been copied to clipboard"
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Configuration File</DialogTitle>
          {configPath ? (
            <DialogDescription>
              Configuration File Path: {configPath}
            </DialogDescription>
          ) : (
            <DialogDescription className="text-amber-500">
              No configuration file path specified. You'll need to create a configuration file for this host.
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="space-y-4">
          {!configPath && (
            <div className="rounded-md bg-amber-50 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Configuration Required</h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      This host doesn't have a configuration file path specified. 
                      To use this host, you'll need to create a configuration file with the details below.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Configuration Details</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleCopyConfig}
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            
            <div className="relative">
              <ScrollArea className="h-[300px] w-full rounded-md border">
                <pre className="p-4 text-sm">
                  {configString}
                </pre>
              </ScrollArea>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
