
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Server } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Profile, ServerInstance } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ProfileImportPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  servers: ServerInstance[];
  onConfirmImport: () => void;
}

export const ProfileImportPreviewDialog: React.FC<ProfileImportPreviewDialogProps> = ({
  open,
  onOpenChange,
  profile,
  servers,
  onConfirmImport
}) => {
  const { toast } = useToast();
  const [openConfigs, setOpenConfigs] = useState<Record<string, boolean>>({});

  const toggleServerConfig = (serverId: string) => {
    setOpenConfigs(prev => ({
      ...prev,
      [serverId]: !prev[serverId]
    }));
  };

  const handleConfirmImport = () => {
    onConfirmImport();
    onOpenChange(false);
    toast({
      title: "Profile imported successfully",
      description: `${profile.name} and its servers have been added to your profiles`,
      type: "success"
    });
  };

  const getServerConfigDetails = (server: ServerInstance) => {
    const details = [];
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl text-foreground">
            <Server className="h-5 w-5" /> Import Profile
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Review and confirm the profile you're about to import
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 pt-3">
          {/* Profile Preview - Reusing styles from ShareProfileDialog */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground capitalize">
              Profile Details
            </h3>
            
            <div className="rounded-lg border overflow-hidden shadow-sm">
              {/* Profile name header */}
              <div className="bg-muted/30 p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-lg text-foreground">{profile.name}</div>
                  <Badge variant="outline" className="bg-secondary/50">{servers.length} Server{servers.length !== 1 ? 's' : ''}</Badge>
                </div>
              </div>
              
              {/* Servers list with ScrollArea */}
              <ScrollArea className="h-[240px]">
                <div className="divide-y divide-border">
                  {servers.map((server) => (
                    <Collapsible 
                      key={server.id} 
                      open={openConfigs[server.id]} 
                      onOpenChange={() => toggleServerConfig(server.id)}
                    >
                      <div className="p-3.5 flex justify-between items-center bg-card hover:bg-muted/30 transition-colors">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                            <Server className="h-4 w-4 text-foreground" />
                            <span className="font-medium text-foreground">{server.name}</span>
                            <EndpointLabel type={server.connectionDetails?.includes('http') ? 'HTTP_SSE' : 'STDIO'} />
                          </div>
                          {server.description && (
                            <p className="text-xs text-muted-foreground pl-7 pr-4">
                              {server.description}
                            </p>
                          )}
                        </div>
                        
                        {getServerConfigDetails(server).length > 0 && (
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-muted">
                              {openConfigs[server.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </CollapsibleTrigger>
                        )}
                      </div>
                      
                      <CollapsibleContent>
                        <div className="p-4 pt-2 pl-10 space-y-4 bg-muted/20 border-t">
                          {getServerConfigDetails(server).map((detail, index) => (
                            <div key={index} className="grid gap-1.5">
                              <div className="font-medium text-xs text-foreground capitalize">{detail.name}</div>
                              {renderConfigValue(detail.value)}
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleConfirmImport} className="px-8">
              Import Profile
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
