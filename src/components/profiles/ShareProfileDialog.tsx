
import React, { useState } from "react";
import { Copy, ExternalLink, Info, Share2, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Profile, ServerInstance } from "@/data/mockData";

interface ShareProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  serverInstances: ServerInstance[];
}

export function ShareProfileDialog({ open, onOpenChange, profile, serverInstances }: ShareProfileDialogProps) {
  const [activeTab, setActiveTab] = useState<"with-config" | "without-config">("with-config");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const { toast } = useToast();

  // Generate a mock configuration JSON for the profile
  const generateMockConfig = () => {
    const profileServers = serverInstances.filter(server => profile.instances.includes(server.id));
    
    // Create a mock configuration
    const config = {
      mcpServers: {}
    };
    
    profileServers.forEach(server => {
      config.mcpServers[server.name.toLowerCase().replace(/\s+/g, "-")] = {
        command: "npx",
        args: [
          "-y",
          `@modelcontextprotocol/server-${server.name.toLowerCase().replace(/\s+/g, "-")}`
        ]
      };
    });
    
    return JSON.stringify(config, null, 2);
  };

  // Generate a sharing link
  const handleGenerateLink = () => {
    setIsGeneratingLink(true);
    
    // Simulate link generation with a timeout
    setTimeout(() => {
      const baseUrl = window.location.origin;
      const profileId = profile.id;
      const withConfig = activeTab === "with-config" ? "1" : "0";
      const mockShareLink = `${baseUrl}/share/profile/${profileId}?config=${withConfig}`;
      
      setGeneratedLink(mockShareLink);
      setIsGeneratingLink(false);
      
      toast({
        title: "Link generated",
        description: "Share link has been generated successfully.",
      });
    }, 1000);
  };

  // Copy the generated link
  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      
      toast({
        title: "Link copied",
        description: "Share link has been copied to clipboard.",
      });
      
      onOpenChange(false); // Close dialog after copying
    }
  };

  // Reset state when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setGeneratedLink(null);
      setIsConfigExpanded(false);
    }
    onOpenChange(open);
  };

  const configJson = generateMockConfig();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Share Profile</DialogTitle>
          <DialogDescription>
            Share this profile with others. Choose whether to include server configurations.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "with-config" | "without-config")}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="with-config">With Configuration</TabsTrigger>
            <TabsTrigger value="without-config">Configuration-less</TabsTrigger>
          </TabsList>
          
          <TabsContent value="with-config">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share this profile with full server configurations. Recipients will get exact server setup.
              </p>
              
              <Collapsible open={isConfigExpanded} onOpenChange={setIsConfigExpanded}>
                <div className="flex items-center justify-between space-x-4 px-4">
                  <h4 className="text-sm font-semibold">Configuration Preview</h4>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Expand className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <div className="rounded-md bg-muted p-2 mt-2">
                    <pre className="text-xs overflow-auto">{configJson}</pre>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </TabsContent>
          
          <TabsContent value="without-config">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share this profile without server configurations. Recipients will need to configure servers themselves.
              </p>
              
              <div className="flex items-center space-x-2 rounded-md border p-4">
                <Info className="h-5 w-5 text-blue-500" />
                <div className="text-sm">
                  <p>
                    Only profile structure will be shared, not the actual server configurations.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {!generatedLink ? (
          <DialogFooter>
            <Button 
              onClick={handleGenerateLink}
              disabled={isGeneratingLink}
              className="w-full"
            >
              {isGeneratingLink ? "Generating Link..." : "Generate Share Link"}
            </Button>
          </DialogFooter>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-md border p-2">
              <span className="text-sm truncate flex-1">{generatedLink}</span>
              <Button variant="outline" size="icon" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <DialogFooter className="flex-col sm:flex-col gap-2">
              <Button 
                className="w-full"
                onClick={handleCopyLink}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                asChild
              >
                <a href={generatedLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Link
                </a>
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
