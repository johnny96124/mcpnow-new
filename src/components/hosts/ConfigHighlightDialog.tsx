
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ConfigHighlightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  configPath?: string;
}

export function ConfigHighlightDialog({ open, onOpenChange, configPath }: ConfigHighlightDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Complete example config in JSON format
  const configContent = {
    "mcpServers": {
      "mcpnow": {
        "command": "npx",
        "args": [
          "-y", 
          "@modelcontextprotocol/mcpnow", 
          "http://localhost:8008/mcp"
        ]
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
          <DialogTitle>
            Configuration Details
          </DialogTitle>
          {configPath && (
            <p className="text-sm text-muted-foreground">
              Configuration File Path: {configPath}
            </p>
          )}
        </DialogHeader>
        
        <div className="space-y-4">
          {!configPath && (
            <Alert variant="default" className="bg-muted/50 border-muted-foreground/20">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <AlertDescription className="text-muted-foreground">
                No configuration path specified. Please copy this configuration to your host's configuration file manually.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="relative">
            <ScrollArea className="h-[300px] w-full rounded-md border">
              <div className="absolute right-2 top-2 z-10">
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
              <pre className="p-4 text-sm">
                {configString}
              </pre>
            </ScrollArea>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
