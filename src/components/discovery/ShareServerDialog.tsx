
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { Copy, Check, Ban, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ServerInstance, ServerDefinition } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ShareServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerInstance | ServerDefinition;
  serverDefinition?: ServerDefinition | null;
}

interface ConfigOption {
  id: string;
  label: string;
  value: string;
}

export function ShareServerDialog({
  open,
  onOpenChange,
  server,
  serverDefinition
}: ShareServerDialogProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<string>("no-config");
  const { toast } = useToast();
  
  // Generate configuration options with additional mock data
  const configOptions: ConfigOption[] = [
    { id: "no-config", label: "No Config", value: "no-config" }
  ];
  
  // If server is an instance (not just a definition), add it as a config option
  if ('definitionId' in server) {
    configOptions.push({
      id: server.id,
      label: server.name,
      value: server.id
    });
    
    // Add some mock options for demonstration
    configOptions.push(
      { 
        id: "config-dev", 
        label: `${server.name} - Dev Environment`, 
        value: "config-dev" 
      },
      { 
        id: "config-prod", 
        label: `${server.name} - Production`, 
        value: "config-prod" 
      }
    );
  } else {
    // Add mock options for definition
    configOptions.push(
      { 
        id: "instance-1", 
        label: `${server.name} - Default Instance`, 
        value: "instance-1" 
      },
      { 
        id: "instance-2", 
        label: `${server.name} - Custom Config`, 
        value: "instance-2" 
      }
    );
  }

  // Determine the correct ID to use for the share URL based on selected config
  const getShareUrl = () => {
    if (selectedConfig === "no-config") {
      // Use the definition ID for sharing without config
      const definitionId = 'definitionId' in server ? server.definitionId : server.id;
      return `https://mcpnow.app/discover/${definitionId || 'server'}`;
    } else if (selectedConfig === "config-dev" || selectedConfig === "config-prod") {
      // Mock URLs for demo configs
      return `https://mcpnow.app/discover/instance/${selectedConfig}`;
    } else if (selectedConfig === "instance-1" || selectedConfig === "instance-2") {
      // Mock URLs for demo instances
      return `https://mcpnow.app/discover/instance/${selectedConfig}`;
    } else {
      // Use the server instance ID for sharing with config
      return `https://mcpnow.app/discover/instance/${selectedConfig}`;
    }
  };
  
  const shareUrl = getShareUrl();
  
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard",
      });
      
      // Close dialog after copying
      setTimeout(() => {
        onOpenChange(false);
        // Reset copied state after dialog closes
        setTimeout(() => setIsCopied(false), 300);
      }, 1000);
    });
  };

  // Reset selected config when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedConfig("no-config");
      setIsCopied(false);
    }
  }, [open]);

  // Use serverDefinition if provided, otherwise check if server itself is a ServerDefinition
  const description = serverDefinition?.description || 
                     ('description' in server ? server.description : "A powerful server that enhances your development workflow");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Share Server</DialogTitle>
          <DialogDescription>
            Share this server with others who might find it useful
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-start gap-4 py-4">
          <ServerLogo name={server.name} className="w-12 h-12 flex-shrink-0" />
          
          <div className="space-y-1 min-w-0">
            <h3 className="font-semibold text-lg">{server.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {description}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium">Sharing with:</span>
            
            <Select
              value={selectedConfig}
              onValueChange={setSelectedConfig}
            >
              <SelectTrigger className="w-[250px] h-9">
                <SelectValue placeholder="Select configuration">
                  {selectedConfig === "no-config" ? (
                    <div className="flex items-center gap-2">
                      <Ban className="h-4 w-4 text-muted-foreground" />
                      <span>No Config</span>
                    </div>
                  ) : (
                    configOptions.find(option => option.value === selectedConfig)?.label || server.name
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {configOptions.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.id === "no-config" ? (
                      <div className="flex items-center gap-2">
                        <Ban className="h-4 w-4 text-muted-foreground" />
                        <span>{option.label}</span>
                      </div>
                    ) : (
                      option.label
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-muted/40 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm truncate mr-2 flex-1 overflow-hidden">
                {shareUrl}
              </div>
              <Button 
                variant="secondary"
                size="sm"
                className="gap-1.5 w-24 flex-shrink-0"
                onClick={handleCopyUrl}
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
