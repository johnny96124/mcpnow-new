
import React, { useState } from "react";
import { Copy, ExternalLink, ChevronDown, ChevronUp, Server, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Profile, ServerInstance } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ServerConfigDetail {
  name: string;
  value: string | string[] | Record<string, string> | undefined;
}

interface ShareProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  servers: ServerInstance[];
}

export const ShareProfileDialog: React.FC<ShareProfileDialogProps> = ({
  open,
  onOpenChange,
  profile,
  servers
}) => {
  const [shareMode, setShareMode] = useState<"with-config" | "without-config">("with-config");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [openConfigs, setOpenConfigs] = useState<Record<string, boolean>>({});
  
  const { toast } = useToast();

  const toggleServerConfig = (serverId: string) => {
    setOpenConfigs(prev => ({
      ...prev,
      [serverId]: !prev[serverId]
    }));
  };

  const handleGenerateLink = () => {
    setIsGeneratingLink(true);
    
    // Simulate generating a link
    setTimeout(() => {
      // Generate a mock share URL with the profile ID and share mode
      const baseUrl = window.location.origin;
      const shareData = {
        profileId: profile.id,
        mode: shareMode,
        timestamp: Date.now()
      };
      
      // Generate a mock shareable link
      const shareLink = `${baseUrl}/share/profile/${btoa(JSON.stringify(shareData))}`;
      setGeneratedLink(shareLink);
      setIsGeneratingLink(false);
      
      toast({
        title: "Share link generated",
        description: "You can now copy or open the link",
        type: "success"
      });
    }, 1000);
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      toast({
        title: "Link copied",
        description: "The share link has been copied to your clipboard",
        type: "success"
      });
    }
  };

  const handleOpenLink = () => {
    if (generatedLink) {
      window.open(generatedLink, '_blank');
    }
  };

  const getServerConfigDetails = (server: ServerInstance): ServerConfigDetail[] => {
    const details: ServerConfigDetail[] = [];
    
    if (server.connectionDetails?.includes('http') && 'url' in server) {
      details.push({ name: "URL", value: server.url });
    }
    
    if ('headers' in server && server.headers && Object.keys(server.headers).length > 0) {
      details.push({ name: "HTTP Headers", value: server.headers });
    }
    
    if ('arguments' in server && server.arguments && server.arguments.length > 0) {
      details.push({ name: "Command Arguments", value: server.arguments });
    }
    
    if ('environment' in server && server.environment && Object.keys(server.environment).length > 0) {
      details.push({ name: "Environment Variables", value: server.environment });
    }
    
    return details;
  };

  const renderConfigValue = (value: string | string[] | Record<string, string> | undefined) => {
    if (!value) return null;
    
    if (typeof value === 'string') {
      return <span className="font-mono text-sm bg-muted p-1 rounded">{value}</span>;
    }
    
    if (Array.isArray(value)) {
      return (
        <div className="space-y-1">
          {value.map((item, index) => (
            <div key={index} className="font-mono text-sm bg-muted p-1 rounded">{item}</div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="space-y-1">
        {Object.entries(value).map(([key, val]) => (
          <div key={key} className="font-mono text-sm">
            <span className="font-semibold">{key}:</span> <span className="bg-muted p-1 rounded">{val}</span>
          </div>
        ))}
      </div>
    );
  };

  // Format JSON for display
  const getProfileConfigJSON = () => {
    const serversConfig: Record<string, any> = {};
    
    servers.forEach(server => {
      const serverConfig: Record<string, any> = {};
      
      if ('url' in server && server.url) {
        // For HTTP_SSE servers
        serverConfig.url = server.url;
        if ('headers' in server && server.headers) {
          serverConfig.headers = server.headers;
        }
      } else {
        // For STDIO servers
        serverConfig.command = "npx";
        if ('arguments' in server && server.arguments) {
          serverConfig.args = server.arguments;
        }
        if ('environment' in server && server.environment) {
          serverConfig.env = server.environment;
        }
      }
      
      serversConfig[server.name.toLowerCase().replace(/\s+/g, "-")] = serverConfig;
    });
    
    const config = {
      mcpServers: serversConfig
    };
    
    return JSON.stringify(config, null, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" /> Share Profile
          </DialogTitle>
          <DialogDescription>
            Share your "{profile.name}" profile with others
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Share Mode Selection */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">Share Mode</h3>
            
            <RadioGroup
              value={shareMode}
              onValueChange={(value) => setShareMode(value as "with-config" | "without-config")}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="with-config" id="with-config" />
                <div className="grid gap-1.5">
                  <Label htmlFor="with-config" className="font-medium">Share with configuration</Label>
                  <p className="text-sm text-muted-foreground">
                    Include all server configuration details like URLs, headers, environment variables, etc.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="without-config" id="without-config" />
                <div className="grid gap-1.5">
                  <Label htmlFor="without-config" className="font-medium">Share without configuration</Label>
                  <p className="text-sm text-muted-foreground">
                    Only include server names without any sensitive configuration details
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          {/* Profile Content Preview */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Profile Content Preview</h3>
              <Badge variant="outline">{servers.length} Server(s)</Badge>
            </div>
            
            <div className="border rounded-md divide-y">
              {servers.map((server) => (
                <Collapsible 
                  key={server.id}
                  open={openConfigs[server.id]} 
                  onOpenChange={() => toggleServerConfig(server.id)}
                  className={`${shareMode === "with-config" ? "" : "pointer-events-none"}`}
                >
                  <div className="p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{server.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {server.connectionDetails.includes('http') ? 'HTTP SSE' : 'STDIO'}
                      </Badge>
                    </div>
                    
                    {shareMode === "with-config" && getServerConfigDetails(server).length > 0 && (
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          {openConfigs[server.id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    )}
                  </div>
                  
                  {shareMode === "with-config" && (
                    <CollapsibleContent>
                      <div className="p-3 pt-0 pl-10 space-y-3 text-sm bg-muted/30">
                        {getServerConfigDetails(server).map((detail, index) => (
                          <div key={index} className="grid gap-1">
                            <div className="font-medium text-xs text-muted-foreground">{detail.name}</div>
                            {renderConfigValue(detail.value)}
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              ))}
            </div>
            
            {shareMode === "with-config" && (
              <Collapsible className="border rounded-md">
                <CollapsibleTrigger asChild>
                  <div className="p-3 flex justify-between items-center cursor-pointer hover:bg-muted/30">
                    <div className="font-medium text-sm">Configuration JSON</div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-3 overflow-x-auto">
                    <pre className="text-xs font-mono bg-muted p-2 rounded-md whitespace-pre-wrap">
                      {getProfileConfigJSON()}
                    </pre>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
          
          <Separator />
          
          {/* Generate Link and Share Actions */}
          <div className="space-y-4">
            {!generatedLink ? (
              <Button 
                onClick={handleGenerateLink}
                className="w-full"
                disabled={isGeneratingLink}
              >
                {isGeneratingLink ? "Generating Link..." : "Generate Share Link"}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="bg-muted p-2 rounded text-sm font-mono flex-1 truncate overflow-hidden">
                    {generatedLink}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCopyLink}
                    className="flex-1"
                    variant="outline"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  
                  <Button 
                    onClick={handleOpenLink}
                    className="flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Link
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
