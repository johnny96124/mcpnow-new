
import React, { useState } from "react";
import { Copy, ChevronDown, ChevronUp, Server, Share2, Upload } from "lucide-react";
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
        details.push({ name: "URL", value: server.url as string });
      }
    }
    
    if ('headers' in server && server.headers) {
      details.push({ name: "HTTP Headers", value: server.headers as Record<string, string> });
    }
    
    if ('arguments' in server && server.arguments && server.arguments.length > 0) {
      details.push({ name: "Command Arguments", value: server.arguments });
    }
    
    if ('environment' in server && server.environment && Object.keys(server.environment).length > 0) {
      details.push({ name: "Environment Variables", value: server.environment as Record<string, string> });
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
      return (
        <div className="font-mono text-sm bg-muted p-1 rounded">
          {value.join(' ')}
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
          {/* Share Mode Selection - Updated UI based on the provided image */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`border rounded-lg p-6 flex flex-col items-center text-center cursor-pointer transition-all hover:bg-muted/20 ${shareMode === "with-config" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted"}`}
                onClick={() => setShareMode("with-config")}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-base mb-2">分享完整配置 (推荐)</h3>
                <p className="text-sm text-muted-foreground">
                  包含所有 Profile 变量和依赖的 Server
                </p>
              </div>
              
              <div 
                className={`border rounded-lg p-6 flex flex-col items-center text-center cursor-pointer transition-all hover:bg-muted/20 ${shareMode === "without-config" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted"}`}
                onClick={() => setShareMode("without-config")}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Server className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-base mb-2">仅分享 Server</h3>
                <p className="text-sm text-muted-foreground">
                  只分享服务器配置，不包含 Profile 参数
                </p>
              </div>
            </div>
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
                    className="w-full"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
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
