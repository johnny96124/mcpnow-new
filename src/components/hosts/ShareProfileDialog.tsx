import React, { useState, useEffect } from "react";
import { Copy, ChevronDown, ChevronUp, Server, Share2, Upload, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Profile, ServerInstance } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { EndpointLabel } from "@/components/status/EndpointLabel";

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
  const {
    toast
  } = useToast();

  // Reset generated link when share mode changes
  useEffect(() => {
    setGeneratedLink(null);
  }, [shareMode]);

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
      // Generate a shortened mock share URL with the profile ID and share mode
      const shareData = {
        pid: profile.id,
        m: shareMode === "with-config" ? "wc" : "nc",
        t: Date.now().toString().slice(-6)
      };

      // Generate a mock shareable link - limited to 20 characters
      const shortCode = btoa(JSON.stringify(shareData)).substring(0, 14);
      const shareLink = `sh.io/${shortCode}`;
      setGeneratedLink(shareLink);
      setIsGeneratingLink(false);
      toast({
        title: "Share link generated",
        description: "You can now copy the link",
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

  const getServerConfigDetails = (server: ServerInstance): ServerConfigDetail[] => {
    const details: ServerConfigDetail[] = [];
    if (server.connectionDetails?.includes('http')) {
      if ('url' in server) {
        details.push({
          name: "URL",
          value: server.url as string
        });
      }
    }
    if ('headers' in server && server.headers) {
      details.push({
        name: "HTTP Headers",
        value: server.headers as Record<string, string>
      });
    }
    if ('arguments' in server && server.arguments && server.arguments.length > 0) {
      details.push({
        name: "Command Arguments",
        value: server.arguments
      });
    }
    if ('environment' in server && server.environment && Object.keys(server.environment).length > 0) {
      details.push({
        name: "Environment Variables",
        value: server.environment as Record<string, string>
      });
    }
    return details;
  };

  const renderConfigValue = (value: string | string[] | Record<string, string> | undefined) => {
    if (!value) return null;
    if (typeof value === 'string') {
      return <span className="font-mono text-sm bg-muted p-1 rounded">{value}</span>;
    }
    if (Array.isArray(value)) {
      // Modified section - render Command Arguments in a single line
      return <div className="font-mono text-sm bg-muted p-1 rounded">
          {value.join(' ')}
        </div>;
    }
    return <div className="space-y-1">
        {Object.entries(value).map(([key, val]) => <div key={key} className="font-mono text-sm">
            <span className="font-semibold">{key}:</span> <span className="bg-muted p-1 rounded">{val}</span>
          </div>)}
      </div>;
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" /> Share Profile
          </DialogTitle>
          <DialogDescription>
            Share your profile with others
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 pt-2">
          {/* Profile name display */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h3 className="font-medium text-lg flex items-center gap-2">
              <span className="text-primary">{profile.name}</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{profile.description}</p>
          </div>
          
          {/* Share Mode Selection - Simplified Radio Group */}
          <div className="space-y-4">
            <h3 className="font-medium mb-2">Sharing Options</h3>
            <RadioGroup value={shareMode} onValueChange={(value) => setShareMode(value as "with-config" | "without-config")} className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3 rounded-md border p-3 cursor-pointer hover:bg-muted/30" onClick={() => setShareMode("with-config")}>
                <RadioGroupItem value="with-config" id="with-config" />
                <Label htmlFor="with-config" className="flex-1 cursor-pointer">
                  <div className="font-medium">Complete Configuration (Recommended)</div>
                  <div className="text-sm text-muted-foreground">Includes all profile variables and dependent servers</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 rounded-md border p-3 cursor-pointer hover:bg-muted/30" onClick={() => setShareMode("without-config")}>
                <RadioGroupItem value="without-config" id="without-config" />
                <Label htmlFor="without-config" className="flex-1 cursor-pointer">
                  <div className="font-medium">No Configuration</div>
                  <div className="text-sm text-muted-foreground">Share server configurations without profile parameters</div>
                </Label>
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
              {servers.map(server => (
                <Collapsible 
                  key={server.id} 
                  open={openConfigs[server.id]} 
                  onOpenChange={() => toggleServerConfig(server.id)} 
                  className={`${shareMode === "with-config" ? "" : "pointer-events-none"}`}
                >
                  <div className="p-3 flex justify-between items-center min-h-[40px]">
                    <div className="flex items-center gap-3">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{server.name}</span>
                      <EndpointLabel 
                        type={server.connectionDetails?.includes('http') ? 'HTTP_SSE' : 'STDIO'}
                      />
                    </div>
                    
                    {(shareMode === "with-config" && getServerConfigDetails(server).length > 0) ? (
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          {openConfigs[server.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </CollapsibleTrigger>
                    ) : (
                      <div className="w-7 h-7"></div> /* Placeholder to maintain consistent spacing */
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
          </div>
          
          <Separator />
          
          {/* Generate Link and Share Actions */}
          <div className="space-y-4">
            {!generatedLink ? <Button onClick={handleGenerateLink} className="w-full" disabled={isGeneratingLink}>
                <Upload className="h-4 w-4 mr-2" />
                {isGeneratingLink ? "Generating Link..." : "Generate Share Link"}
              </Button> : <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Shareable Link:</h4>
                  <div className="flex items-center gap-2">
                    <div className="bg-muted p-2 rounded text-sm font-mono flex-1 truncate overflow-hidden">
                      {generatedLink}
                    </div>
                  </div>
                </div>
                
                {/* Link expiration notice */}
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                  <Clock className="h-5 w-5" />
                  <p className="text-sm">This link will expire in 10 minutes</p>
                </div>
                
                <Button onClick={handleCopyLink} className="w-full" style={{
                backgroundColor: "white"
              }}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                </Button>
              </div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
