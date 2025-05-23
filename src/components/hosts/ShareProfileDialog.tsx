
import React, { useState, useEffect } from "react";
import { Copy, ChevronDown, Server, Share2, Upload, Clock, Eye, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Profile, ServerInstance } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileImportPreviewDialog } from "./ProfileImportPreviewDialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const { toast } = useToast();

  // Initialize selected servers with all servers when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedServers(servers.map(server => server.id));
    }
  }, [open, servers]);

  // Reset generated link when share mode or selected servers change
  useEffect(() => {
    setGeneratedLink(null);
  }, [shareMode, selectedServers]);

  const handleServerSelection = (serverId: string, checked: boolean) => {
    setSelectedServers(prev => {
      if (checked) {
        return [...prev, serverId];
      } else {
        return prev.filter(id => id !== serverId);
      }
    });
    // Reset generated link when server selection changes
    setGeneratedLink(null);
  };

  const toggleAllServers = (checked: boolean) => {
    if (checked) {
      setSelectedServers(servers.map(server => server.id));
    } else {
      setSelectedServers([]);
    }
    // Reset generated link when server selection changes
    setGeneratedLink(null);
  };

  const filteredServers = servers.filter(server => selectedServers.includes(server.id));

  const handleGenerateLink = () => {
    setIsGeneratingLink(true);

    // Simulate generating a link
    setTimeout(() => {
      // Generate a shortened mock share URL with the profile ID, share mode, and selected servers
      const shareData = {
        pid: profile.id,
        m: shareMode === "with-config" ? "wc" : "nc",
        s: selectedServers,
        t: Date.now().toString().slice(-6)
      };

      // Generate a mock shareable link - limited to 20 characters
      const shortCode = btoa(JSON.stringify(shareData)).substring(0, 14);
      const shareLink = `sh.io/${shortCode}`;
      
      // Set the generated link in state
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

  const handleShowImportPreview = () => {
    setShowImportPreview(true);
  };

  const handleImportConfirm = () => {
    // This would typically implement the actual import logic
    toast({
      title: "Profile imported",
      description: `Successfully imported ${profile.name} profile`,
      type: "success"
    });
  };

  const renderConfigValue = (value: string | string[] | Record<string, string> | undefined) => {
    if (!value) return null;
    if (typeof value === 'string') {
      return <span className="font-mono text-sm bg-muted/80 p-1.5 rounded">{value}</span>;
    }
    if (Array.isArray(value)) {
      return <div className="font-mono text-sm bg-muted/80 p-1.5 rounded">
          {value.join(' ')}
        </div>;
    }
    return <div className="space-y-2">
        {Object.entries(value).map(([key, val]) => <div key={key} className="font-mono text-sm">
            <span className="font-semibold text-foreground">{key}:</span> <span className="bg-muted/80 p-1 rounded">{val}</span>
          </div>)}
      </div>;
  };

  return <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle className="flex items-center gap-2 text-xl text-foreground">
              <Share2 className="h-5 w-5" /> Share Profile
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Share your profile configuration with others
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 pt-3 flex-1 overflow-hidden">
            {/* Share Mode Selection - Enhanced Radio Group */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground capitalize">Sharing Options</h3>
              <RadioGroup value={shareMode} onValueChange={value => setShareMode(value as "with-config" | "without-config")} className="flex flex-col space-y-3">
                <div className={`flex items-center space-x-3 rounded-md border p-3 cursor-pointer hover:bg-muted/30 transition-colors ${shareMode === "with-config" ? "border-primary/50 bg-primary/5" : ""}`} onClick={() => setShareMode("with-config")}>
                  <RadioGroupItem value="with-config" id="with-config" className="border-primary/70" />
                  <Label htmlFor="with-config" className="flex-1 cursor-pointer">
                    <div className="font-medium text-foreground">Complete Configuration <Badge variant="outline" className="ml-2 bg-primary/10 text-xs font-normal">Recommended</Badge></div>
                    <div className="text-sm text-muted-foreground mt-1">Includes all profile variables and dependent servers</div>
                  </Label>
                </div>
                
                <div className={`flex items-center space-x-3 rounded-md border p-3 cursor-pointer hover:bg-muted/30 transition-colors ${shareMode === "without-config" ? "border-primary/50 bg-primary/5" : ""}`} onClick={() => setShareMode("without-config")}>
                  <RadioGroupItem value="without-config" id="without-config" className="border-primary/70" />
                  <Label htmlFor="without-config" className="flex-1 cursor-pointer">
                    <div className="font-medium text-foreground">Basic Profile</div>
                    <div className="text-sm text-muted-foreground mt-1">Share server configurations without detailed parameters</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Combined Server Selection and Content View Section */}
            <div className="flex flex-col space-y-2 flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Profile Details</h3>
                <div className="flex items-center gap-2">
                  
                  <Checkbox id="select-all" checked={selectedServers.length === servers.length} onCheckedChange={checked => toggleAllServers(!!checked)} />
                  <Label htmlFor="select-all" className="text-sm cursor-pointer">
                    Select All
                  </Label>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden flex-1 flex flex-col">
                {/* Profile header */}
                <div className="bg-muted/30 p-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-lg text-foreground">{profile.name}</div>
                    <Badge variant="outline" className="bg-secondary/50">{selectedServers.length} Server{selectedServers.length !== 1 ? 's' : ''}</Badge>
                  </div>
                </div>
                
                {/* Servers list with integrated selection */}
                <ScrollArea className="flex-1">
                  <div className="divide-y divide-border">
                    {servers.map(server => <Accordion type="single" collapsible key={server.id} className="border-b last:border-b-0">
                        <AccordionItem value={server.id} className="border-0">
                          <div className="flex items-center">
                            <Checkbox id={`server-${server.id}`} checked={selectedServers.includes(server.id)} onCheckedChange={checked => handleServerSelection(server.id, !!checked)} className="ml-3 mr-2" />
                            <AccordionTrigger className="flex-1 py-3 px-2 hover:bg-muted/30 transition-colors hover:no-underline">
                              <div className="flex items-center gap-3 text-left">
                                <Server className="h-4 w-4 text-foreground" />
                                <span className="font-medium text-foreground">{server.name}</span>
                                <EndpointLabel type={server.connectionDetails?.includes('http') ? 'HTTP_SSE' : 'STDIO'} />
                              </div>
                            </AccordionTrigger>
                          </div>
                          
                          {selectedServers.includes(server.id) && <AccordionContent className="pt-0 pb-5 px-4 pl-10 bg-muted/10">
                              {/* Server description */}
                              {server.description && <p className="text-muted-foreground mb-4">
                                  {server.description}
                                </p>}
                              
                              <div className="space-y-5">
                                {/* Command Arguments section - only for STDIO */}
                                {!server.connectionDetails?.includes('http') && 'arguments' in server && server.arguments && server.arguments.length > 0 && <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Command Arguments</h4>
                                    {/* Always show the complete command arguments regardless of share mode */}
                                    <pre className="bg-muted/40 p-3 rounded-md overflow-x-auto font-mono text-sm whitespace-pre-wrap">
                                      {server.arguments.join(' ')}
                                    </pre>
                                  </div>}
                                
                                {/* URL section - only for HTTP_SSE */}
                                {server.connectionDetails?.includes('http') && 'url' in server && <div className="space-y-2">
                                    <h4 className="font-medium text-sm">URL</h4>
                                    {shareMode === "with-config" ? <div className="bg-muted/40 p-3 rounded-md overflow-x-auto font-mono text-sm">
                                        {server.url as string}
                                      </div> : <div className="bg-muted/40 p-3 rounded-md overflow-x-auto">
                                        <div className="font-mono text-sm opacity-60">URL defined</div>
                                      </div>}
                                  </div>}
                                
                                {/* HTTP Headers - only for HTTP_SSE */}
                                {server.connectionDetails?.includes('http') && 'headers' in server && server.headers && Object.keys(server.headers).length > 0 && <div className="space-y-2">
                                    <h4 className="font-medium text-sm">HTTP Headers</h4>
                                    {shareMode === "with-config" ? <div className="bg-muted/40 p-3 rounded-md overflow-hidden">
                                        {Object.entries(server.headers).map(([key, value]) => <div key={key} className="font-mono text-sm flex items-start mb-1 last:mb-0">
                                            <span className="font-medium min-w-[120px] inline-block">{key}:</span>
                                            <span className="text-muted-foreground break-all">{value}</span>
                                          </div>)}
                                      </div> : <div className="bg-muted/40 p-3 rounded-md overflow-hidden">
                                        <div className="space-y-1">
                                          {Object.keys(server.headers).map(key => <div key={key} className="font-mono text-sm flex items-center">
                                              <span className="font-medium">{key}</span>
                                            </div>)}
                                        </div>
                                      </div>}
                                  </div>}
                                
                                {/* Environment Variables section - for both types */}
                                {'environment' in server && server.environment && Object.keys(server.environment).length > 0 && <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Environment Variables</h4>
                                    
                                    {shareMode === "with-config" ? <div className="bg-muted/40 p-3 rounded-md overflow-hidden">
                                        <div className="grid grid-cols-2 gap-2">
                                          {/* Keys column */}
                                          <div className="space-y-2">
                                            {Object.keys(server.environment).map(key => <div key={`key-${key}`} className="font-mono text-sm bg-muted/50 p-2 rounded flex items-center h-8">
                                                <span className="font-medium text-foreground truncate">{key}</span>
                                              </div>)}
                                          </div>
                                          
                                          {/* Values column */}
                                          <div className="space-y-2">
                                            {Object.values(server.environment).map((value, index) => {
                                    const key = Object.keys(server.environment!)[index];
                                    return <div key={`value-${key}`} className="font-mono text-sm bg-muted/50 p-2 rounded flex items-center h-8">
                                                  <span className="text-muted-foreground truncate">{value}</span>
                                                </div>;
                                  })}
                                          </div>
                                        </div>
                                      </div> : <div className="bg-muted/40 p-3 rounded-md overflow-hidden">
                                        <div className="space-y-2">
                                          {Object.keys(server.environment).map(key => <div key={`key-${key}`} className="font-mono text-sm bg-muted/50 p-2 rounded flex items-center h-8">
                                              <span className="font-medium text-foreground truncate">{key}</span>
                                            </div>)}
                                        </div>
                                      </div>}
                                  </div>}
                              </div>
                            </AccordionContent>}
                        </AccordionItem>
                      </Accordion>)}
                  </div>
                </ScrollArea>
              </div>
            </div>
            
            <Separator className="my-1" />
            
            {/* Generate Link and Share Actions */}
            <div className="space-y-4">
              {!generatedLink ? (
                <Button 
                  onClick={handleGenerateLink} 
                  className="w-full py-5 font-medium transition-all"
                  disabled={isGeneratingLink || selectedServers.length === 0}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isGeneratingLink ? "Generating Link..." : "Generate Share Link"}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-foreground">Shareable Link 
                        <span className="inline-flex items-center ml-3 text-amber-600 text-xs">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>Expires in 10 minutes</span>
                        </span>
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-md border">
                      <div className="bg-muted/90 p-2.5 rounded text-sm font-mono flex-1 truncate overflow-hidden">
                        {generatedLink}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={handleCopyLink} 
                      variant="default" 
                      className="flex-1 py-5 font-medium hover:shadow-md transition-all"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                    
                    <Button 
                      onClick={handleShowImportPreview} 
                      variant="outline" 
                      className="flex-1 py-5 font-medium hover:shadow-md transition-all"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Import
                    </Button>
                  </div>
                </div>
              )}

              {selectedServers.length === 0 && (
                <div className="text-center p-2 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-600 text-sm">
                  Please select at least one server to generate a share link
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Import Preview Dialog */}
      <ProfileImportPreviewDialog 
        open={showImportPreview} 
        onOpenChange={setShowImportPreview} 
        profile={profile} 
        servers={filteredServers} 
        onConfirmImport={handleImportConfirm} 
      />
    </>;
};
