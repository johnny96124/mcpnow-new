
import React, { useState } from "react";
import { FileText, Server, AlertTriangle, CheckCircle, Info, Plus, ChevronDown, ExternalLink, ArrowRight, Settings, MoreHorizontal, Trash2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { useToast } from "@/hooks/use-toast";
import { Host, Profile, ServerInstance, ConnectionStatus, serverDefinitions, EndpointType } from "@/data/mockData";
import { ConfigHighlightDialog } from "./ConfigHighlightDialog";
import { ProfileDropdown } from "./ProfileDropdown";
import { ServerListEmpty } from "./ServerListEmpty";
import { ServerItem } from "./ServerItem";
import { ServerSelectionDialog } from "./ServerSelectionDialog";
import { ServerRecommendations } from "./ServerRecommendations";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { ShareProfileDialog } from "./ShareProfileDialog";
import { ServerActivityMonitor } from "./ServerActivityMonitor";

interface HostDetailViewProps {
  host: Host;
  profiles: Profile[];
  serverInstances: ServerInstance[];
  selectedProfileId: string;
  onCreateConfig: (hostId: string) => void;
  onProfileChange: (profileId: string) => void;
  onAddServersToHost: () => void;
  onDeleteHost: (hostId: string) => void;
  onServerStatusChange: (serverId: string, status: 'running' | 'stopped' | 'error' | 'connecting') => void;
  onSaveProfileChanges: (serverId?: string) => void;
  onCreateProfile: (name: string) => string;
  onDeleteProfile: (profileId: string) => void;
  onAddServersToProfile?: (servers: ServerInstance[]) => void;
  onImportProfile?: (profile: Profile) => void;
}

export const HostDetailView: React.FC<HostDetailViewProps> = ({
  host,
  profiles,
  serverInstances,
  selectedProfileId,
  onCreateConfig,
  onProfileChange,
  onAddServersToHost,
  onDeleteHost,
  onServerStatusChange,
  onSaveProfileChanges,
  onCreateProfile,
  onDeleteProfile,
  onAddServersToProfile,
  onImportProfile
}) => {
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [serverSelectionDialogOpen, setServerSelectionDialogOpen] = useState(false);
  const [deleteHostDialogOpen, setDeleteHostDialogOpen] = useState(false);
  const [shareProfileDialogOpen, setShareProfileDialogOpen] = useState(false);
  
  const {
    toast
  } = useToast();
  
  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  const profileServers = serverInstances.filter(server => selectedProfile?.instances.includes(server.id));
  
  // Generate recommendations when profile is empty
  const getRecommendations = () => {
    // Filter popular and official servers for recommendations
    return serverDefinitions
      .filter(def => def.isOfficial || (def.downloads && def.downloads > 1000))
      .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
      .slice(0, 6); // Show top 6 recommendations
  };
  
  const handleServerStatusChange = (serverId: string, enabled: boolean) => {
    onServerStatusChange(serverId, enabled ? host.connectionStatus === "connected" ? 'connecting' : 'stopped' : 'stopped');
    if (enabled) {
      toast({
        title: "Connecting to server",
        description: "Attempting to establish connection"
      });
      setTimeout(() => {
        const success = Math.random() > 0.3;
        if (success) {
          onServerStatusChange(serverId, 'running');
          toast({
            title: "Server connected",
            description: "Successfully connected to server",
            type: "success"
          });
        } else {
          onServerStatusChange(serverId, 'error');
          toast({
            title: "Connection error",
            description: "Failed to connect to server",
            type: "error"
          });
        }
      }, 2000);
    }
  };
  
  const getServerLoad = (serverId: string) => {
    return Math.floor(Math.random() * 90) + 10;
  };
  
  const showConfigFile = () => {
    setConfigDialogOpen(true);
  };
  
  const handleAddServers = (servers: ServerInstance[]) => {
    if (selectedProfile && servers.length > 0) {
      if (onAddServersToProfile) {
        onAddServersToProfile(servers);
      } else {
        toast({
          title: "Servers added",
          description: `${servers.length} server(s) added to ${selectedProfile.name}`,
          type: "success"
        });
        onSaveProfileChanges();
      }
    }
  };
  
  const handleConfirmDeleteHost = () => {
    onDeleteHost(host.id);
    setDeleteHostDialogOpen(false);
  };

  const handleShareProfile = () => {
    if (selectedProfile) {
      setShareProfileDialogOpen(true);
    } else {
      toast({
        title: "No profile selected",
        description: "Please select a profile to share",
        type: "error"
      });
    }
  };
  
  const handleRemoveServerFromProfile = (serverId: string) => {
    // Find the selected profile
    const selectedProfile = profiles.find(p => p.id === selectedProfileId);
    
    if (selectedProfile) {
      // Update the profile by removing the server ID
      const updatedInstances = selectedProfile.instances.filter(id => id !== serverId);
      
      // Call the save changes function to persist the update
      onSaveProfileChanges(serverId);
      
      // For now, show a toast (the actual profiles list update is handled in the parent component)
      toast({
        title: "Server removed",
        description: `Server has been removed from ${selectedProfile.name}`
      });
    }
  };
  
  // Always show the normal host view, even if configStatus is "unknown"
  return <div className="space-y-6">
      <Card className="bg-white">
        <CardContent className="p-6">
          {/* Host header section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-muted/30 p-3 rounded-full">
                <span className="text-2xl">{host.icon || '🖥️'}</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{host.name}</h2>
                <div className="flex items-center gap-2">
                  <StatusIndicator status={host.connectionStatus === "connected" ? "active" : host.connectionStatus === "misconfigured" ? "error" : "inactive"} label={host.connectionStatus === "connected" ? "Connected" : host.connectionStatus === "misconfigured" ? "Misconfigured" : "Disconnected"} />
                </div>
              </div>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer" onClick={showConfigFile}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Config
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => setDeleteHostDialogOpen(true)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Host
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Profile and servers section - Improved Design */}
          <div>
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Server Profile</h3>
                
                {profileServers.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareProfile}
                    className="gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share Profile
                  </Button>
                )}
              </div>
              
              <div className="flex items-center">
                <div className="p-1.5 bg-primary/5 border rounded-lg flex-1 flex items-center">
                  <ProfileDropdown 
                    profiles={profiles}
                    currentProfileId={selectedProfileId}
                    onProfileChange={onProfileChange}
                    onCreateProfile={onCreateProfile}
                    onDeleteProfile={onDeleteProfile}
                    onImportProfile={onImportProfile}
                  />
                </div>
              </div>
            </div>
            
            <Separator className="mb-6" />
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Connected Servers</h3>
              
              {/* Only show the Add Servers button in the header when there are servers */}
              {profileServers.length > 0 && (
                <Button 
                  id="add-servers-button" 
                  onClick={() => setServerSelectionDialogOpen(true)} 
                  variant="outline" 
                  size="sm" 
                  className="whitespace-nowrap"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Servers
                </Button>
              )}
            </div>
            
            {profileServers.length > 0 ? <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">Server</th>
                      <th className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">Type</th>
                      <th className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="h-10 px-4 text-center text-sm font-medium text-muted-foreground">Active</th>
                      <th className="h-10 px-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profileServers.map(server => <ServerItem 
                      key={server.id} 
                      server={server} 
                      hostConnectionStatus={host.connectionStatus} 
                      onStatusChange={handleServerStatusChange} 
                      load={getServerLoad(server.id)} 
                      onRemoveFromProfile={handleRemoveServerFromProfile}
                    />)}
                  </tbody>
                </table>
              </div> : <div className="mt-4">
                <ServerRecommendations 
                  recommendations={getRecommendations()}
                  onAddServers={handleAddServers}
                  onShowAllServers={() => setServerSelectionDialogOpen(true)}
                />
              </div>}
          </div>
        </CardContent>
      </Card>
      
      {/* Server Activity Monitor */}
      <ServerActivityMonitor 
        hostName={host.name}
        connectedServers={profileServers.map(server => ({
          id: server.id,
          name: server.name,
          status: server.status,
          enabled: server.enabled
        }))}
        isHostConnected={host.connectionStatus === "connected"}
      />
      
      <ServerSelectionDialog open={serverSelectionDialogOpen} onOpenChange={setServerSelectionDialogOpen} onAddServers={handleAddServers} />
      
      <ConfigHighlightDialog open={configDialogOpen} onOpenChange={setConfigDialogOpen} configPath={host.configPath} />

      {/* Delete Host Confirmation Dialog */}
      <Dialog open={deleteHostDialogOpen} onOpenChange={setDeleteHostDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Host</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{host.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleConfirmDeleteHost}>
              Delete Host
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share Profile Dialog */}
      {selectedProfile && (
        <ShareProfileDialog
          open={shareProfileDialogOpen}
          onOpenChange={setShareProfileDialogOpen}
          profile={selectedProfile}
          servers={profileServers}
        />
      )}
    </div>;
};

function Search(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>;
}
