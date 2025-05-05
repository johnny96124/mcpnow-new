import { useState, useEffect } from "react";
import { 
  ExternalLink, 
  ChevronDown, 
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { profiles, hosts, serverInstances, serverDefinitions } from "@/data/mockData";
import { NoSearchResults } from "@/components/servers/NoSearchResults";
import { HostRefreshHint } from "@/components/hosts/HostRefreshHint";

interface InstanceStatus {
  id: string;
  definitionId: string;
  name: string;
  status: 'running' | 'connecting' | 'error' | 'stopped';
  enabled: boolean;
}

const TrayPopup = () => {
  const displayHosts = [
    ...hosts, 
    {
      id: "cline-host",
      name: "Cline",
      icon: "🔄",
      connectionStatus: 'disconnected' as const,
      configStatus: 'configured' as const,
      configPath: "/path/to/config.json",
      profileId: ""
    }
  ];

  const [selectedProfileIds, setSelectedProfileIds] = useState<Record<string, string>>(
    displayHosts.reduce((acc, host) => {
      if (host.profileId) {
        acc[host.id] = host.profileId;
      }
      return acc;
    }, {} as Record<string, string>)
  );

  const [instanceStatuses, setInstanceStatuses] = useState<Record<string, InstanceStatus[]>>({});
  
  const [activeInstances, setActiveInstances] = useState<Record<string, Record<string, string>>>({});

  const [showHostRefreshHint, setShowHostRefreshHint] = useState(false);

  const handleProfileChange = (hostId: string, profileId: string) => {
    setSelectedProfileIds(prev => ({
      ...prev,
      [hostId]: profileId
    }));
    
    initializeProfileInstances(hostId, profileId);
    
    const profile = profiles.find(p => p.id === profileId);
    toast.success(`Profile changed to ${profile?.name}`);

    setShowHostRefreshHint(true);
    const timer = setTimeout(() => {
      setShowHostRefreshHint(false);
    }, 3000);

    return () => clearTimeout(timer);
  };

  const initializeProfileInstances = (hostId: string, profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;
    
    const profileInstanceIds = profile.instances;
    
    const initialInstances: InstanceStatus[] = profileInstanceIds
      .map(instanceId => {
        const instance = serverInstances.find(s => s.id === instanceId);
        return instance ? {
          id: instance.id,
          definitionId: instance.definitionId,
          name: instance.name,
          status: 'connecting',
          enabled: instance.enabled
        } : null;
      })
      .filter(Boolean) as InstanceStatus[];
    
    setInstanceStatuses(prev => ({
      ...prev,
      [hostId]: initialInstances
    }));
    
    initialInstances.forEach((instance, index) => {
      setTimeout(() => {
        setInstanceStatuses(prev => {
          const hostInstances = [...(prev[hostId] || [])];
          const instanceIndex = hostInstances.findIndex(i => i.id === instance.id);
          
          if (instanceIndex !== -1) {
            const originalInstance = serverInstances.find(s => s.id === instance.id);
            hostInstances[instanceIndex] = {
              ...hostInstances[instanceIndex],
              status: originalInstance?.status || 'stopped'
            };
          }
          
          return {
            ...prev,
            [hostId]: hostInstances
          };
        });
      }, 1000 + (index * 500));
    });
  };

  const toggleInstanceEnabled = (hostId: string, instanceId: string) => {
    setInstanceStatuses(prev => {
      const hostInstances = [...(prev[hostId] || [])];
      const instanceIndex = hostInstances.findIndex(i => i.id === instanceId);
      
      if (instanceIndex !== -1) {
        hostInstances[instanceIndex] = {
          ...hostInstances[instanceIndex],
          enabled: !hostInstances[instanceIndex].enabled,
          status: !hostInstances[instanceIndex].enabled ? 'connecting' : 'stopped'
        };
        
        if (!hostInstances[instanceIndex].enabled) {
          setTimeout(() => {
            setInstanceStatuses(prevState => {
              const updatedHostInstances = [...(prevState[hostId] || [])];
              const idx = updatedHostInstances.findIndex(i => i.id === instanceId);
              
              if (idx !== -1 && updatedHostInstances[idx].status === 'connecting') {
                updatedHostInstances[idx] = {
                  ...updatedHostInstances[idx],
                  status: Math.random() > 0.2 ? 'running' : 'error'
                };
              }
              
              return {
                ...prevState,
                [hostId]: updatedHostInstances
              };
            });
          }, 1500);
        }
      }
      
      return {
        ...prev,
        [hostId]: hostInstances
      };
    });
    
    toast.success(`Server instance ${instanceStatuses[hostId]?.find(i => i.id === instanceId)?.enabled ? 'disabled' : 'enabled'}`);
  };

  const getInstancesForHost = (hostId: string) => {
    const profileId = selectedProfileIds[hostId];
    if (!profileId) return [];
    
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return [];
    
    const profileInstances = serverInstances.filter(instance => 
      profile.instances.includes(instance.id)
    );
    
    const groupedInstances: Record<string, typeof serverInstances> = {};
    profileInstances.forEach(instance => {
      if (!groupedInstances[instance.definitionId]) {
        groupedInstances[instance.definitionId] = [];
      }
      groupedInstances[instance.definitionId].push(instance);
    });
    
    return Object.entries(groupedInstances).map(([defId, instances]) => {
      const definition = serverDefinitions.find(d => d.id === defId);
      const activeInstanceId = activeInstances[hostId]?.[defId] || instances[0]?.id;
      const status = instanceStatuses[hostId]?.find(s => s.id === activeInstanceId);
      
      return {
        definition,
        instances,
        activeInstanceId,
        status
      };
    });
  };

  const getInstanceStatusCounts = (hostId: string) => {
    if (!instanceStatuses[hostId]) return { active: 0, connecting: 0, error: 0, total: 0 };
    
    const instances = instanceStatuses[hostId].filter(instance => instance.enabled);
    
    return {
      active: instances.filter(i => i.status === 'running').length,
      connecting: instances.filter(i => i.status === 'connecting').length,
      error: instances.filter(i => i.status === 'error').length,
      total: instances.length
    };
  };

  useEffect(() => {
    displayHosts.forEach(host => {
      const profileId = selectedProfileIds[host.id];
      if (profileId) {
        initializeProfileInstances(host.id, profileId);
      }
    });
  }, []);
  
  const openDashboard = () => {
    window.open("/", "_blank");
  };

  return (
    <div className="w-[420px] p-2 bg-background rounded-lg shadow-lg animate-fade-in max-h-[53vh]">
      <div className="flex items-center justify-between p-2 mb-2">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/0ad4c791-4d08-4e94-bbeb-3ac78aae67ef.png" 
            alt="MCP Now Logo" 
            className="h-6 w-6" 
          />
          <h2 className="font-medium">MCP Now</h2>
        </div>
        <Button 
          size="sm" 
          variant="ghost"
          className="text-xs flex items-center gap-1"
          onClick={openDashboard}
        >
          <span>Open Dashboard</span>
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
      
      <ScrollArea className="h-full max-h-[calc(53vh-60px)]">
        <div className="pr-3">
          <div className="space-y-3">
            {displayHosts.map(host => {
              const profileId = selectedProfileIds[host.id] || '';
              const profile = profiles.find(p => p.id === profileId);
              const isConnected = host.connectionStatus === 'connected';
              const instanceGroups = getInstancesForHost(host.id);
              const statusCounts = getInstanceStatusCounts(host.id);
              
              return (
                <Card key={host.id} className="overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between p-3 bg-card">
                    <div className="flex items-center gap-2">
                      <div className="bg-slate-900 text-white p-1 rounded w-8 h-8 flex items-center justify-center">
                        {host.icon || host.name.substring(0, 1)}
                      </div>
                      <h3 className="font-medium">{host.name}</h3>
                    </div>
                    <StatusIndicator 
                      status={isConnected ? 'active' : 'inactive'} 
                      label={isConnected ? 'Connected' : 'Disconnected'}
                    />
                  </div>
                  
                  <div className="p-3 pt-2">
                    {showHostRefreshHint && profileId && (
                      <HostRefreshHint className="mb-3" />
                    )}
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Profile:</span>
                      <Select
                        value={profileId}
                        onValueChange={(value) => handleProfileChange(host.id, value)}
                      >
                        <SelectTrigger className="h-8 flex-1">
                          <SelectValue placeholder="Select profile">
                            {profile && (
                              <div className="flex items-center gap-2">
                                <StatusIndicator 
                                  status={profile.enabled ? 'active' : 'inactive'} 
                                />
                                <span>{profile.name}</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {profiles.map(profile => (
                            <SelectItem key={profile.id} value={profile.id}>
                              <div className="flex items-center gap-2">
                                <StatusIndicator 
                                  status={profile.enabled ? 'active' : 'inactive'} 
                                />
                                <span>{profile.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {profileId && instanceGroups.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-muted-foreground">Active server instances:</p>
                          <div className="flex items-center gap-2 text-xs">
                            {statusCounts.active > 0 && (
                              <div className="flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span>{statusCounts.active} active</span>
                              </div>
                            )}
                            {statusCounts.connecting > 0 && (
                              <div className="flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                <span>{statusCounts.connecting} connecting</span>
                              </div>
                            )}
                            {statusCounts.error > 0 && (
                              <div className="flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                <span>{statusCounts.error} error</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {instanceGroups.map(({ definition, instances, activeInstanceId, status }) => (
                            <div key={definition?.id} className="flex items-center justify-between">
                              <div className="flex-1 min-w-0 mr-2">
                                <span className="text-xs font-medium truncate block">{definition?.name}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Select
                                  value={activeInstanceId}
                                  onValueChange={(value) => {
                                    setActiveInstances(prev => ({
                                      ...prev,
                                      [host.id]: {
                                        ...(prev[host.id] || {}),
                                        [definition?.id || ""]: value
                                      }
                                    }));
                                  }}
                                >
                                  <SelectTrigger className="h-8 text-xs px-2 py-1 flex items-center gap-1 w-[120px]">
                                    <StatusIndicator 
                                      status={
                                        !status?.enabled ? 'inactive' :
                                        status.status === 'running' ? 'active' : 
                                        status.status === 'connecting' ? 'warning' :
                                        status.status === 'error' ? 'error' : 'inactive'
                                      } 
                                    />
                                    <SelectValue className="truncate">
                                      {instances.find(i => i.id === activeInstanceId)?.name.split('-').pop()}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {instances.map(instance => (
                                      <SelectItem key={instance.id} value={instance.id}>
                                        {instance.name.split('-').pop()}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                
                                <Switch 
                                  checked={status?.enabled || false} 
                                  onCheckedChange={() => toggleInstanceEnabled(host.id, activeInstanceId)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {!profileId && (
                      <div className="mt-3">
                        <NoSearchResults 
                          entityName="profile"
                          title="Select a profile"
                          message="Select a profile to connect mcp server to host"
                          icon={<User className="h-12 w-12 text-muted-foreground mb-4" />}
                        />
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TrayPopup;
