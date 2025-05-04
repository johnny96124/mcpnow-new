
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
import { Copy, Check, Ban, Share, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ServerInstance, ServerDefinition } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VersionHistoryDialog, VersionInfo } from "./VersionHistoryDialog";

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
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const { toast } = useToast();
  
  // Mock version history data
  const versionHistory: VersionInfo[] = [
    {
      version: "0.9.5", 
      releaseDate: new Date(2025, 3, 3), // April 3, 2025
      author: "API Team",
      changes: [
        "Added Kubernetes 1.28 support",
        "Improved cluster monitoring with real-time metrics",
        "Fixed pod visualization in dark mode"
      ]
    },
    {
      version: "0.9.0", 
      releaseDate: new Date(2025, 2, 15), // March 15, 2025
      author: "API Team",
      changes: [
        "Launched deployment automation features",
        "Added support for custom namespaces",
        "Fixed several stability issues with long-running operations"
      ]
    },
    {
      version: "0.8.5", 
      releaseDate: new Date(2025, 1, 20), // February 20, 2025
      author: "API Team",
      changes: [
        "Beta release of resource monitoring dashboard",
        "Initial implementation of pod visualization",
        "Added basic cluster management functionality"
      ]
    }
  ];
  
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
  const generateShareUrl = () => {
    // Simulate a network request with a brief delay
    setIsGeneratingLink(true);
    
    setTimeout(() => {
      if (selectedConfig === "no-config") {
        // Use the definition ID for sharing without config
        const definitionId = 'definitionId' in server ? server.definitionId : server.id;
        setShareUrl(`https://mcpnow.app/discover/${definitionId || 'server'}`);
      } else if (selectedConfig === "config-dev" || selectedConfig === "config-prod") {
        // Mock URLs for demo configs
        setShareUrl(`https://mcpnow.app/discover/instance/${selectedConfig}`);
      } else if (selectedConfig === "instance-1" || selectedConfig === "instance-2") {
        // Mock URLs for demo instances
        setShareUrl(`https://mcpnow.app/discover/instance/${selectedConfig}`);
      } else {
        // Use the server instance ID for sharing with config
        setShareUrl(`https://mcpnow.app/discover/instance/${selectedConfig}`);
      }
      setIsGeneratingLink(false);
      
      toast({
        title: "Link generated!",
        description: "Your share link is ready to copy",
      });
    }, 500); // Simulate a brief delay
  };
  
  const handleCopyUrl = () => {
    if (!shareUrl) return;
    
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
  
  const handleInstallVersion = (version: string) => {
    // Here you would typically trigger the installation process for the selected version
    setShowVersionHistory(false);
    toast({
      title: "Installation started",
      description: `Installing version ${version} of ${server.name}`,
    });
  };

  // Reset selected config and share URL when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedConfig("no-config");
      setIsCopied(false);
      setShareUrl(null);
    }
  }, [open]);

  // Reset the share URL when configuration changes
  useEffect(() => {
    setShareUrl(null);
    setIsCopied(false);
  }, [selectedConfig]);

  // Use serverDefinition if provided, otherwise check if server itself is a ServerDefinition
  const description = serverDefinition?.description || 
                     ('description' in server ? server.description : "A powerful server that enhances your development workflow");

  // Access version and requirements from the server data
  const version = 'version' in server ? server.version : '0.9.5';

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl">Share Server</DialogTitle>
            <DialogDescription>
              Share this server with others who might find it useful
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col sm:flex-row items-start gap-4 py-4">
            <ServerLogo name={server.name} className="w-12 h-12 flex-shrink-0" />
            
            <div className="space-y-1 min-w-0 flex-grow">
              <h3 className="font-semibold text-lg">{server.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
              
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Version</span>
                <span>{version}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-600 px-1.5 h-6 gap-1"
                  onClick={() => setShowVersionHistory(true)}
                >
                  <History className="h-3.5 w-3.5" />
                  Version history
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-5 mt-2 border-t pt-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="config-select" className="text-sm font-medium">
                Share with configuration:
              </label>
              
              <Select
                value={selectedConfig}
                onValueChange={setSelectedConfig}
              >
                <SelectTrigger id="config-select" className="w-full h-10">
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
            
            {shareUrl ? (
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Shareable Link:</h4>
                  <div className="bg-muted/40 border rounded-md p-3 flex items-center">
                    <div className="text-sm truncate mr-3 flex-1 overflow-hidden font-mono">
                      {shareUrl}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="outline"
                    size="sm"
                    className={`gap-1.5 ${isCopied ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800' : ''}`}
                    onClick={handleCopyUrl}
                    style={{ backgroundColor: "white" }}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
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
            ) : (
              <div className="flex justify-end">
                <Button 
                  variant="default"
                  size="sm"
                  className="gap-1.5"
                  onClick={generateShareUrl}
                  disabled={isGeneratingLink}
                >
                  <Share className="h-4 w-4 mr-2" />
                  {isGeneratingLink ? "Generating Link..." : "Generate Share Link"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <VersionHistoryDialog
        open={showVersionHistory}
        onOpenChange={setShowVersionHistory}
        serverName={server.name}
        versions={versionHistory}
        onInstallVersion={handleInstallVersion}
      />
    </>
  );
}
