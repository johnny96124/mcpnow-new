
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Profile, ServerInstance } from "@/data/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { EndpointLabel } from "@/components/status/EndpointLabel";

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
  const [shareType, setShareType] = useState<"basic" | "detailed">("basic");
  const [copied, setCopied] = useState(false);
  const [expandedServers, setExpandedServers] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  const toggleServerExpansion = (serverId: string) => {
    setExpandedServers(prev => ({
      ...prev,
      [serverId]: !prev[serverId]
    }));
  };
  
  const basicProfileJson = JSON.stringify(
    {
      profile: {
        name: profile.name,
        endpoint: profile.endpoint,
        endpointType: profile.endpointType,
        serverCount: servers.length
      }
    },
    null,
    2
  );
  
  const detailedProfileJson = JSON.stringify(
    {
      profile: {
        name: profile.name,
        endpoint: profile.endpoint,
        endpointType: profile.endpointType,
        servers: servers.map(server => ({
          name: server.name,
          definitionId: server.definitionId,
          connectionDetails: server.connectionDetails
        }))
      }
    },
    null,
    2
  );
  
  const handleCopy = () => {
    const textToCopy = shareType === "basic" ? basicProfileJson : detailedProfileJson;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    
    toast({
      title: "Copied to clipboard",
      description: "Profile details have been copied to your clipboard."
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share Profile</DialogTitle>
          <DialogDescription>
            Share your profile configuration with others to help them get set up quickly.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>
          
          <TabsContent value="export" className="space-y-4">
            <div className="space-y-4">
              <RadioGroup
                defaultValue="basic"
                value={shareType}
                onValueChange={(value) => setShareType(value as "basic" | "detailed")}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="basic" id="basic" />
                  <Label htmlFor="basic" className="font-medium">Basic Profile</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="detailed" id="detailed" />
                  <Label htmlFor="detailed" className="font-medium">Detailed Profile with Servers</Label>
                </div>
              </RadioGroup>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Profile Details</h3>
                
                {shareType === "basic" ? (
                  <>
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Name:</span>
                        <span className="text-sm font-medium">{profile.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Endpoint:</span>
                        <span className="text-sm font-medium">{profile.endpoint}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Endpoint Type:</span>
                        <span className="text-sm font-medium">{profile.endpointType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Servers:</span>
                        <span className="text-sm font-medium">{servers.length}</span>
                      </div>
                    </div>
                    
                    {servers.length > 0 && (
                      <div className="space-y-2 mt-3">
                        <h3 className="text-sm font-medium">Server List</h3>
                        <ScrollArea className="h-[160px]">
                          <div className="space-y-2">
                            {servers.map(server => (
                              <Collapsible
                                key={server.id}
                                open={expandedServers[server.id]}
                                onOpenChange={() => toggleServerExpansion(server.id)}
                                className="border rounded-md p-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <ServerLogo name={server.name} />
                                    <span className="text-sm font-medium">{server.name}</span>
                                  </div>
                                  <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                      {expandedServers[server.id] ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className="pt-2">
                                  <div className="space-y-1 pl-8 text-sm">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-muted-foreground">Type:</span>
                                      <EndpointLabel type="HTTP_SSE" />
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span className="text-muted-foreground">Connection:</span>
                                      <span className="font-mono text-xs">{server.connectionDetails}</span>
                                    </div>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </>
                ) : (
                  <ScrollArea className="h-[300px]">
                    <pre className="text-xs overflow-auto p-2 bg-muted rounded-md">
                      {detailedProfileJson}
                    </pre>
                  </ScrollArea>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="import" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-2">
                Import functionality will be implemented in a future update.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center sm:justify-between">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCopy} className="gap-2">
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
