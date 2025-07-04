import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Star, Download, ExternalLink, Check, X } from "lucide-react";
import { ServerDefinition, ServerInstance } from "@/data/mockData";
import { EndpointLabel } from "@/components/status/EndpointLabel";

interface ServerRecommendationsProps {
  recommendations: ServerDefinition[];
  onAddServers: (servers: ServerInstance[]) => void;
  onShowAllServers: () => void;
}

export const ServerRecommendations: React.FC<ServerRecommendationsProps> = ({
  recommendations,
  onAddServers,
  onShowAllServers
}) => {
  const [selectedServers, setSelectedServers] = useState<string[]>([]);

  const handleToggleServer = (serverId: string) => {
    setSelectedServers(prev => 
      prev.includes(serverId) 
        ? prev.filter(id => id !== serverId)
        : [...prev, serverId]
    );
  };

  const handleSelectAll = () => {
    if (selectedServers.length === recommendations.length) {
      setSelectedServers([]);
    } else {
      setSelectedServers(recommendations.map(server => server.id));
    }
  };

  const handleAddSelected = () => {
    const selectedRecommendations = recommendations.filter(server => 
      selectedServers.includes(server.id)
    );

    const serverInstances: ServerInstance[] = selectedRecommendations.map(server => ({
      id: `instance-${server.id}-${Date.now()}`,
      definitionId: server.id,
      name: server.name,
      status: "stopped",
      enabled: true,
      connectionDetails: server.type === 'HTTP_SSE' ? server.url || 'http://localhost:8008' : server.commandArgs || 'stdio',
      environment: server.environment
    }));

    onAddServers(serverInstances);
    setSelectedServers([]);
  };

  const isAllSelected = selectedServers.length === recommendations.length && recommendations.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium">推荐的服务器</h3>
        <p className="text-muted-foreground">
          根据您的主机配置，我们为您推荐以下热门服务器
        </p>
      </div>

      {recommendations.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              {isAllSelected ? '取消全选' : '全选'}
            </Button>
            {selectedServers.length > 0 && (
              <span className="text-sm text-muted-foreground">
                已选择 {selectedServers.length} 个服务器
              </span>
            )}
          </div>
          
          {selectedServers.length > 0 && (
            <Button onClick={handleAddSelected} className="gap-2">
              <Plus className="h-4 w-4" />
              添加选中的服务器 ({selectedServers.length})
            </Button>
          )}
        </div>
      )}

      <ScrollArea className="h-[400px]">
        <div className="grid gap-4">
          {recommendations.map((server) => {
            const isSelected = selectedServers.includes(server.id);
            
            return (
              <Card 
                key={server.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' : ''
                }`}
                onClick={() => handleToggleServer(server.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={isSelected}
                        onChange={() => handleToggleServer(server.id)}
                        className="mt-1"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{server.icon}</span>
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {server.name}
                            {server.isOfficial && (
                              <Badge variant="secondary" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                官方
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <EndpointLabel type={server.type} />
                            {server.downloads && (
                              <Badge variant="outline" className="text-xs">
                                <Download className="h-3 w-3 mr-1" />
                                {server.downloads.toLocaleString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="mb-3">
                    {server.description}
                  </CardDescription>
                  
                  {server.categories && server.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {server.categories.slice(0, 3).map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                      {server.categories.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{server.categories.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {server.features && server.features.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground">主要功能:</span>
                      <ul className="text-xs text-muted-foreground space-y-0.5">
                        {server.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={onShowAllServers}
          className="flex-1 gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          浏览所有可用服务器
        </Button>
        
        {selectedServers.length === 0 && (
          <Button 
            onClick={onShowAllServers}
            className="flex-1 gap-2"
          >
            <Plus className="h-4 w-4" />
            手动添加服务器
          </Button>
        )}
      </div>
    </div>
  );
};