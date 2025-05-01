
import React, { useState } from "react";
import { Share, Copy, ExternalLink, ChevronDown, ChevronUp, Check, LinkIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Profile, ServerInstance } from "@/data/mockData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ShareProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  servers: ServerInstance[];
}

export function ShareProfileDialog({ open, onOpenChange, profile, servers }: ShareProfileDialogProps) {
  const [shareOption, setShareOption] = useState<"with-config" | "without-config">("with-config");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isJsonExpanded, setIsJsonExpanded] = useState(false);
  
  const { toast } = useToast();
  
  const handleGenerateLink = () => {
    setIsGeneratingLink(true);
    
    // Simulate API call to generate link
    setTimeout(() => {
      const mockProfileId = profile?.id || "unknown";
      const mockShareId = Math.random().toString(36).substring(2, 10);
      
      // Generate a mock link based on the share option
      const link = `https://app.mcp.dev/share/${mockShareId}?type=profile&id=${mockProfileId}&config=${shareOption === "with-config" ? "1" : "0"}`;
      
      setGeneratedLink(link);
      setIsGeneratingLink(false);
      
      toast({
        title: "Link Generated",
        description: "Share link has been created successfully"
      });
    }, 800);
  };
  
  const handleCopyLink = () => {
    if (!generatedLink) return;
    
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "Link has been copied to your clipboard"
    });
    
    // Reset the copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleOpenLink = () => {
    if (!generatedLink) return;
    window.open(generatedLink, "_blank");
  };
  
  // Example JSON configuration
  const mockJsonConfig = {
    "mcpServers": {
      "sequential-thinking": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-sequential-thinking"
        ]
      }
    }
  };

  const configData = JSON.stringify(mockJsonConfig, null, 2);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Profile</DialogTitle>
          <DialogDescription>
            Share this profile with others so they can access the same servers
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Profile information</h3>
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{profile?.name || "Unknown Profile"}</p>
                  <p className="text-sm text-muted-foreground">
                    {servers.length} server{servers.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Share options</h3>
            
            <RadioGroup value={shareOption} onValueChange={(value) => setShareOption(value as "with-config" | "without-config")}>
              <div className="flex items-start space-x-2 mb-3">
                <RadioGroupItem value="with-config" id="with-config" />
                <div className="grid gap-1.5">
                  <Label htmlFor="with-config" className="font-medium">Share with configuration</Label>
                  <p className="text-sm text-muted-foreground">
                    Recipients will receive server configurations and can use them directly
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="without-config" id="without-config" />
                <div className="grid gap-1.5">
                  <Label htmlFor="without-config" className="font-medium">Share without configuration</Label>
                  <p className="text-sm text-muted-foreground">
                    Recipients will only see server names without implementation details
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          {shareOption === "with-config" && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Configuration Data</h3>
              </div>
              
              <Collapsible open={isJsonExpanded} onOpenChange={setIsJsonExpanded} className="w-full">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full flex justify-between">
                    <span>View Configuration</span>
                    {isJsonExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <pre className="bg-muted p-2 rounded-md mt-2 text-xs overflow-auto max-h-[200px]">
                    {configData}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
              
              <p className="text-xs text-muted-foreground">
                This configuration will be shared. It contains server settings that recipients can use.
              </p>
            </div>
          )}
          
          {!generatedLink ? (
            <Button 
              className="w-full" 
              onClick={handleGenerateLink} 
              disabled={isGeneratingLink}
            >
              {isGeneratingLink ? "Generating..." : "Generate Share Link"}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="bg-muted/50 flex-1 p-2 rounded-l-md flex items-center overflow-hidden">
                  <LinkIcon className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                  <span className="text-sm truncate">{generatedLink}</span>
                </div>
                <Button 
                  variant="secondary" 
                  className="rounded-l-none" 
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleOpenLink}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Link
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
