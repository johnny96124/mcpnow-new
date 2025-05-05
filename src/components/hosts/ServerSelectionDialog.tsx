
import React, { useState, useEffect, useRef } from "react";
import { Search, Clock, ExternalLink, Plus, X, Server, CheckCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { serverDefinitions, type ServerInstance, type ServerDefinition } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { AddInstanceDialog } from "@/components/servers/AddInstanceDialog";
import { AddServerDialog } from "@/components/new-layout/AddServerDialog";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ServerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServers: (servers: ServerInstance[]) => void;
}

// Enhanced instance type with additional metadata
interface EnhancedServerInstance extends ServerInstance {
  description?: string;
  addedAt?: Date;
}

const existingInstances: EnhancedServerInstance[] = [
  {
    id: "instance-1",
    name: "Local PostgreSQL",
    definitionId: "def-http-sse",
    status: "stopped",
    connectionDetails: "https://localhost:5432",
    enabled: false,
    description: "Local PostgreSQL database server instance",
    addedAt: new Date(2025, 3, 20) // April 20, 2025
  },
  {
    id: "instance-2",
    name: "Development Redis",
    definitionId: "def-stdio",
    status: "stopped",
    connectionDetails: "redis://localhost:6379",
    enabled: false,
    description: "Development Redis cache server",
    addedAt: new Date(2025, 3, 25) // April 25, 2025
  }
];

export const ServerSelectionDialog: React.FC<ServerSelectionDialogProps> = ({
  open,
  onOpenChange,
  onAddServers,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerDefinition | null>(null);
  const [showInstanceDialog, setShowInstanceDialog] = useState(false);
  const [showCustomServerDialog, setShowCustomServerDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"installed" | "discovery">("installed");
  const { toast } = useToast();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Filtered results based on search query for existing instances
  const filteredExistingInstances = searchQuery 
    ? existingInstances.filter(server => 
        server.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : existingInstances; // Show all when no search query
    
  // Filtered results for discoverable servers
  const filteredServerDefinitions = searchQuery
    ? serverDefinitions.filter(server => 
        server.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : []; // Only show when searching
    
  const hasSearchResults = filteredExistingInstances.length > 0 || filteredServerDefinitions.length > 0;
  const showNoResults = isSearching && !hasSearchResults;
  
  // Mock data for installed servers tracking 
  const [installedServers, setInstalledServers] = useState<Record<string, boolean>>({
    "instance-1": true, 
    "instance-2": true,
    "def-http-sse": true
  });
  
  // Clear state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setIsSearching(false);
      setSelectedServer(null);
      setShowInstanceDialog(false);
      setShowCustomServerDialog(false);
      setActiveTab("installed");
    } else {
      // Focus search input when dialog opens
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  }, [open]);

  // Handle existing instance selection
  const handleAddExistingInstance = (instance: EnhancedServerInstance) => {
    onAddServers([instance]);
    
    // Mark as installed
    setInstalledServers(prev => ({
      ...prev,
      [instance.id]: true
    }));
    
    toast({
      title: "Server added",
      description: `${instance.name} has been added to your profile`
    });
    onOpenChange(false);
  };

  // Handle discovery server setup
  const handleSetupServer = (server: ServerDefinition) => {
    setSelectedServer(server);
    setShowInstanceDialog(true);
  };

  // Handle instance creation
  const handleCreateInstance = (data: any) => {
    const newInstance: ServerInstance = {
      id: `instance-${Date.now()}`,
      name: data.name,
      definitionId: selectedServer?.id || "",
      status: "stopped",
      connectionDetails: data.url || data.args || "",
      enabled: false
    };

    // Mark the server definition as installed
    if (selectedServer) {
      setInstalledServers(prev => ({
        ...prev,
        [selectedServer.id]: true
      }));
    }

    onAddServers([newInstance]);
    toast({
      title: "Server instance created",
      description: `${newInstance.name} has been added to your profile`
    });
    setShowInstanceDialog(false);
    onOpenChange(false);
  };

  // Handle custom server addition
  const handleAddCustomServer = (server: ServerInstance) => {
    onAddServers([server]);
    
    // Mark as installed
    setInstalledServers(prev => ({
      ...prev,
      [server.id]: true
    }));
    
    toast({
      title: "Custom server added",
      description: `${server.name} has been added to your profile`
    });
    setShowCustomServerDialog(false);
    onOpenChange(false);
  };

  // Navigate to Discovery page
  const handleNavigateToDiscovery = () => {
    onOpenChange(false);
    navigate("/discovery");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Search and Add Server</DialogTitle>
            <DialogDescription>
              Browse your installed servers or discover new ones
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search by server name, tag, or description"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearching(e.target.value.length > 0);
                }}
                className="pl-8 text-sm"
              />
            </div>
            
            {/* Tabs to switch between installed and discovery servers */}
            <Tabs defaultValue="installed" value={activeTab} onValueChange={(value) => setActiveTab(value as "installed" | "discovery")} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="installed" className="flex items-center gap-1">
                  <Server className="h-4 w-4" />
                  <span>Installed Servers</span>
                  <Badge variant="outline" className="ml-1 text-xs">{existingInstances.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="discovery" className="flex items-center gap-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>Discovery</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="installed" className="mt-4 space-y-4">
                {isSearching && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Showing results for "{searchQuery}"
                  </p>
                )}
                
                {filteredExistingInstances.length > 0 ? (
                  <ScrollArea className="max-h-[350px] overflow-auto pr-2">
                    <div className="space-y-2">
                      {filteredExistingInstances.map((instance) => (
                        <div
                          key={instance.id}
                          className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="relative">
                              <ServerLogo name={instance.name} className="flex-shrink-0" />
                              {installedServers[instance.id] && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="absolute -top-1 -right-1 bg-blue-100 border border-blue-200 rounded-full p-0.5 shadow-sm">
                                        <CheckCircle className="h-4 w-4 text-blue-600" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Server already added</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm truncate">{instance.name}</h4>
                                <EndpointLabel 
                                  type={serverDefinitions.find(def => def.id === instance.definitionId)?.type || 'Custom'} 
                                />
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                <div className="flex flex-col space-y-1">
                                  {instance.description && (
                                    <span>{instance.description}</span>
                                  )}
                                  {instance.addedAt && (
                                    <span className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" /> 
                                      Added on {format(instance.addedAt, "MMM dd, yyyy")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant={installedServers[instance.id] ? "outline" : "secondary"}
                            onClick={() => handleAddExistingInstance(instance)}
                          >
                            {installedServers[instance.id] ? "Re-add" : "Add"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 border border-dashed rounded-md">
                    <p className="text-sm text-muted-foreground mb-2">
                      {isSearching 
                        ? `No installed servers found matching "${searchQuery}"` 
                        : "No installed servers found"}
                    </p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary"
                      onClick={() => setActiveTab("discovery")}
                    >
                      Switch to Discovery to find new servers
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="discovery" className="mt-4 space-y-4">
                {isSearching ? (
                  <>
                    {filteredServerDefinitions.length > 0 ? (
                      <ScrollArea className="max-h-[350px] overflow-auto pr-2">
                        <div className="space-y-2">
                          {filteredServerDefinitions.map((server) => (
                            <div
                              key={server.id}
                              className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex items-start space-x-4">
                                <div className="relative">
                                  <ServerLogo name={server.name} className="flex-shrink-0" />
                                  {installedServers[server.id] && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="absolute -top-1 -right-1 bg-blue-100 border border-blue-200 rounded-full p-0.5 shadow-sm">
                                            <CheckCircle className="h-4 w-4 text-blue-600" />
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Server already added</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-sm truncate">{server.name}</h4>
                                    <EndpointLabel type={server.type} />
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {server.description}
                                  </p>
                                </div>
                              </div>
                              <Button 
                                size="sm"
                                onClick={() => handleSetupServer(server)}
                              >
                                Setup
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-8 border border-dashed rounded-md">
                        <p className="text-sm text-muted-foreground mb-2">No servers found matching "{searchQuery}"</p>
                        <p className="text-sm text-muted-foreground">
                          Try searching with different keywords or{" "}
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-primary"
                            onClick={() => setShowCustomServerDialog(true)}
                          >
                            add a custom server
                          </Button>
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-6 border border-dashed rounded-md text-center space-y-4">
                    <div className="mx-auto bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                      <Search className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Search for servers to discover</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Type in the search box above to find servers in our discovery catalog
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleNavigateToDiscovery}
                      className="mt-2"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Browse Discovery
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="flex items-center justify-between pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                Can't find what you need?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary font-medium"
                  onClick={() => setShowCustomServerDialog(true)}
                >
                  Add Custom Server
                </Button>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddInstanceDialog
        open={showInstanceDialog}
        onOpenChange={setShowInstanceDialog}
        serverDefinition={selectedServer}
        onCreateInstance={handleCreateInstance}
      />

      <AddServerDialog
        open={showCustomServerDialog}
        onOpenChange={setShowCustomServerDialog}
        onAddServer={handleAddCustomServer}
      />
    </>
  );
};
