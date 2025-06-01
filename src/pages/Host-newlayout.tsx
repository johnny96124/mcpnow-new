import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Server, Settings, AlertTriangle, ChevronDown, MoreHorizontal, Share, Edit, Trash, RefreshCw } from "lucide-react";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { UnifiedHostDialog } from "@/components/hosts/UnifiedHostDialog";
import { ManualHostDialog } from "@/components/hosts/ManualHostDialog";
import { ConfigHighlightDialog } from "@/components/hosts/ConfigHighlightDialog";
import { ServerListEmpty } from "@/components/hosts/ServerListEmpty";
import { ProfileSelector } from "@/components/hosts/new-layout/ProfileSelector";
import { ServerSelectionDialog } from "@/components/hosts/new-layout/ServerSelectionDialog";
import { ServerDebugDialog } from "@/components/new-layout/ServerDebugDialog";
import { ServerHistoryDialog } from "@/components/new-layout/ServerHistoryDialog";
import { ServerErrorDialog } from "@/components/hosts/new-layout/ServerErrorDialog";
import { ServerDetailsDialog } from "@/components/hosts/new-layout/ServerDetailsDialog";
import { useHostProfiles } from "@/hooks/useHostProfiles";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function HostNewLayout() {
  const [hosts, setHosts] = useState<any[]>([]);
  const [selectedHost, setSelectedHost] = useState<any | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [servers, setServers] = useState<any[]>([]);
  const [isAddHostDialogOpen, setIsAddHostDialogOpen] = useState(false);
  const [isManualHostDialogOpen, setIsManualHostDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [configPath, setConfigPath] = useState("");
  const [isServerSelectionOpen, setIsServerSelectionOpen] = useState(false);
  const [isServerDebugOpen, setIsServerDebugOpen] = useState(false);
  const [isServerHistoryOpen, setIsServerHistoryOpen] = useState(false);
  const [isServerErrorOpen, setIsServerErrorOpen] = useState(false);
  const [isServerDetailsOpen, setIsServerDetailsOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<any | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>("");
  const { toast } = useToast();

  // Mock hosts data for demo - includes the layout from screenshot
  useEffect(() => {
    const mockHosts = [
      {
        id: "host-1",
        name: "Claude Desktop",
        icon: "🌟",
        configPath: "/Users/dev/.mcp/hosts/claude.json",
        configStatus: "configured",
        connectionStatus: "connected"
      },
      {
        id: "host-2", 
        name: "Cursor",
        icon: "📦",
        configPath: "/Users/dev/.mcp/hosts/cursor.json",
        configStatus: "configured",
        connectionStatus: "connected"
      },
      {
        id: "host-3",
        name: "VS Code", 
        icon: "💙",
        configPath: "/Users/dev/.mcp/hosts/vscode.json",
        configStatus: "configured",
        connectionStatus: "disconnected"
      },
      {
        id: "host-4",
        name: "Windsurf",
        icon: "🏄",
        configPath: "/Users/dev/.mcp/hosts/windsurf.json", 
        configStatus: "configured",
        connectionStatus: "connected"
      }
    ];
    
    setHosts(mockHosts);
    setSelectedHost(mockHosts[0]); // Select Claude Desktop by default
    
    // Mock profiles
    const defaultProfiles = [
      { id: "profile-1", name: "Default", description: "Default profile" },
      { id: "profile-2", name: "Development", description: "Development profile" },
      { id: "profile-3", name: "Production", description: "Production profile" }
    ];
    setProfiles(defaultProfiles);
    setSelectedProfile(defaultProfiles[0]);

    // Mock servers for the selected host
    const mockServers = [
      {
        id: "server-1",
        name: "Playwright Mcp",
        type: "STDIO",
        status: "running",
        enabled: true,
        icon: "🎭"
      },
      {
        id: "server-2", 
        name: "Figma",
        type: "STDIO",
        status: "running", 
        enabled: true,
        icon: "🎨"
      },
      {
        id: "server-3",
        name: "Time MCP Server",
        type: "STDIO",
        status: "error",
        enabled: false,
        icon: "⏰"
      },
      {
        id: "server-4",
        name: "Everything MCP Server", 
        type: "STDIO",
        status: "running",
        enabled: true,
        icon: "🔍"
      },
      {
        id: "server-5",
        name: "Sequential Thinking Server",
        type: "STDIO", 
        status: "error",
        enabled: false,
        icon: "🧠"
      },
      {
        id: "server-6",
        name: "Sequential Thinking Server",
        type: "SSE",
        status: "running",
        enabled: true,
        icon: "🧠"
      }
    ];
    setServers(mockServers);
  }, []);

  const handleAddHosts = (newHosts: any[]) => {
    const updatedHosts = [...hosts, ...newHosts];
    setHosts(updatedHosts);
    
    if (updatedHosts.length === 1) {
      setSelectedHost(updatedHosts[0]);
    }
    
    toast({
      title: "Host Added",
      description: `Successfully added ${newHosts.length} host${newHosts.length > 1 ? 's' : ''}`
    });
  };

  const handleServerToggle = (serverId: string, enabled: boolean) => {
    setServers(current => 
      current.map(server => 
        server.id === serverId 
          ? { 
              ...server, 
              enabled,
              status: enabled ? "connecting" : "stopped" 
            } 
          : server
      )
    );
    
    if (enabled) {
      toast({
        title: "Connecting to server...",
        description: "Attempting to establish connection"
      });
      
      setTimeout(() => {
        const success = Math.random() > 0.3;
        
        setServers(current => 
          current.map(server => 
            server.id === serverId 
              ? { 
                  ...server, 
                  status: success ? "running" : "error" 
                } 
              : server
          )
        );
        
        if (!success) {
          setErrorDetails("Could not connect to server: Connection refused");
          toast({
            title: "Connection Failed",
            description: "Failed to connect to server. Click on error for details.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Connection Established",
            description: "Successfully connected to server"
          });
        }
      }, 2000);
    } else {
      toast({
        title: "Server Stopped",
        description: "Server connection has been terminated"
      });
    }
  };

  const handleAddServer = (instancesData: any[]) => {
    const newServers = instancesData.map(instance => ({
      ...instance,
      status: selectedHost?.connectionStatus === "connected" ? "connecting" : "stopped",
      enabled: selectedHost?.connectionStatus === "connected"
    }));
    
    setServers([...servers, ...newServers]);
    
    toast({
      title: "Server Added",
      description: `Added ${newServers.length} server${newServers.length > 1 ? 's' : ''} to profile`
    });
  };

  const handleRemoveServer = (serverId: string) => {
    setServers(current => current.filter(server => server.id !== serverId));
    
    toast({
      title: "Server Removed",
      description: "Server has been removed from the profile"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "connecting":
        return "text-yellow-600";
      default:
        return "text-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "running":
        return "Connected";
      case "error":
        return "Error";
      case "connecting":
        return "Connecting";
      default:
        return "Stopped";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your MCP hosts, servers, and profiles to efficiently set up your MCP environment</p>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Host List */}
        <div className="w-80 bg-white border-r min-h-screen p-4">
          <div className="space-y-3">
            {hosts.map(host => (
              <Card 
                key={host.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedHost?.id === host.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedHost(host)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{host.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{host.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${
                          host.connectionStatus === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-sm text-gray-600">
                          {host.connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setIsAddHostDialogOpen(true)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Scan for MCP Hosts
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setIsManualHostDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add MCP Host Manually
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {selectedHost ? (
            <div className="space-y-6">
              {/* Host Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <span className="text-2xl">{selectedHost.icon}</span>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                          {selectedHost.name}
                          {selectedHost.connectionStatus === 'connected' && (
                            <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center gap-1">
                              <RefreshCw className="h-3 w-3" />
                              Restart or refresh the host to apply the changes
                            </span>
                          )}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${
                            selectedHost.connectionStatus === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                          <span className="text-sm text-gray-600">
                            {selectedHost.connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Profile Section */}
                  <div className="mt-6 flex items-center gap-4">
                    <span className="text-sm font-medium">Profile:</span>
                    <Select value={selectedProfile?.id} onValueChange={(value) => {
                      const profile = profiles.find(p => p.id === value);
                      setSelectedProfile(profile);
                    }}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map(profile => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Servers Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>MCP Servers</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Import Server
                    </Button>
                    <Button onClick={() => setIsServerSelectionOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Servers
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-600">
                      <div className="col-span-4">Server</div>
                      <div className="col-span-2">Type</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Enable</div>
                      <div className="col-span-2">Actions</div>
                    </div>
                    
                    {/* Server Rows */}
                    {servers.map(server => (
                      <div key={server.id} className="grid grid-cols-12 gap-4 p-3 border rounded-lg hover:bg-gray-50">
                        <div className="col-span-4 flex items-center gap-3">
                          <div className="p-1 bg-gray-100 rounded">
                            <Server className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="font-medium">{server.name}</span>
                          {server.status === 'error' && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="col-span-2 flex items-center">
                          <EndpointLabel type={server.type} />
                        </div>
                        <div className="col-span-2 flex items-center">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              server.status === 'running' ? 'bg-green-500' : 
                              server.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                            }`} />
                            <span className={`text-sm ${getStatusColor(server.status)}`}>
                              {getStatusLabel(server.status)}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center">
                          <Switch 
                            checked={server.enabled} 
                            onCheckedChange={(enabled) => handleServerToggle(server.id, enabled)}
                            disabled={selectedHost.connectionStatus !== "connected"}
                          />
                        </div>
                        <div className="col-span-2 flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Share className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                            onClick={() => handleRemoveServer(server.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">No Host Selected</h3>
              <p className="text-gray-600 mt-2">Select a host from the sidebar to view its details</p>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <UnifiedHostDialog 
        open={isAddHostDialogOpen} 
        onOpenChange={setIsAddHostDialogOpen}
        onAddHosts={handleAddHosts}
      />
      
      <ManualHostDialog
        open={isManualHostDialogOpen}
        onOpenChange={setIsManualHostDialogOpen}
        onAddHost={(host) => handleAddHosts([host])}
      />
      
      <ServerSelectionDialog
        open={isServerSelectionOpen}
        onOpenChange={setIsServerSelectionOpen}
        onAddServers={handleAddServer}
      />
    </div>
  );
}
