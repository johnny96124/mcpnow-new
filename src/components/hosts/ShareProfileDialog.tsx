
import React, { useState } from "react";
import { Copy, ChevronDown, ChevronUp, Server, Upload, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
    
    // Simulate generating a link with max 15 characters
    setTimeout(() => {
      // Generate a short mock share URL with exactly 15 chars
      const mockShareLink = "ab1cd2ef3gh4ij5";
      setGeneratedLink(mockShareLink);
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

  const hasHttpSseDetails = (server: ServerInstance): boolean => {
    return server.connectionDetails.includes('http') && 
           ((server.url !== undefined) || 
            (server.headers !== undefined && Object.keys(server.headers || {}).length > 0));
  };
  
  const hasStdioDetails = (server: ServerInstance): boolean => {
    return !server.connectionDetails.includes('http') && 
           ((server.arguments !== undefined && server.arguments.length > 0) || 
            (server.environment !== undefined && Object.keys(server.environment || {}).length > 0));
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
                  open={openConfigs[server.id] || false} 
                  onOpenChange={() => toggleServerConfig(server.id)}
                  className="w-full"
                >
                  <div className="p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{server.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {server.connectionDetails.includes('http') ? 'HTTP SSE' : 'STDIO'}
                      </Badge>
                    </div>
                    
                    {shareMode === "with-config" && (
                      (server.connectionDetails.includes('http') && 
                       ((server.url !== undefined) || 
                        (server.headers !== undefined && Object.keys(server.headers || {}).length > 0))) || 
                      (!server.connectionDetails.includes('http') && 
                       ((server.arguments !== undefined && server.arguments.length > 0) || 
                        (server.environment !== undefined && Object.keys(server.environment || {}).length > 0)))
                    ) && (
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
                        {/* HTTP SSE specific details */}
                        {server.connectionDetails.includes('http') && (
                          <>
                            {/* URL Section */}
                            {server.url && (
                              <div className="grid gap-1">
                                <div className="font-medium text-xs text-muted-foreground">URL</div>
                                <div className="font-mono text-sm bg-muted p-1 rounded">{server.url}</div>
                              </div>
                            )}
                            
                            {/* HTTP Headers Section */}
                            {server.headers && Object.keys(server.headers).length > 0 && (
                              <div className="grid gap-1">
                                <div className="font-medium text-xs text-muted-foreground">HTTP Headers</div>
                                <div className="space-y-1">
                                  {Object.entries(server.headers).map(([key, val]) => (
                                    <div key={key} className="font-mono text-sm">
                                      <span className="font-semibold">{key}:</span> <span className="bg-muted p-1 rounded">{val}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        
                        {/* STDIO specific details */}
                        {!server.connectionDetails.includes('http') && (
                          <>
                            {/* Command Arguments Section */}
                            {server.arguments && server.arguments.length > 0 && (
                              <div className="grid gap-1">
                                <div className="font-medium text-xs text-muted-foreground">Command Arguments</div>
                                <div className="space-y-1">
                                  {server.arguments.map((arg, index) => (
                                    <div key={index} className="font-mono text-sm bg-muted p-1 rounded">{arg}</div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Environment Variables Section */}
                            {server.environment && Object.keys(server.environment).length > 0 && (
                              <div className="grid gap-1">
                                <div className="font-medium text-xs text-muted-foreground">Environment Variables</div>
                                <div className="space-y-1">
                                  {Object.entries(server.environment).map(([key, val]) => (
                                    <div key={key} className="font-mono text-sm">
                                      <span className="font-semibold">{key}:</span> <span className="bg-muted p-1 rounded">{val}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
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
                <div className="bg-muted p-2 rounded text-sm font-mono flex-1 truncate overflow-hidden">
                  {generatedLink}
                </div>
                
                <Button 
                  onClick={handleCopyLink}
                  className="w-full"
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
