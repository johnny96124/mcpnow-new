
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Server, Settings } from "lucide-react";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { useToast } from "@/hooks/use-toast";

export const MockHostDemo = () => {
  const [hosts, setHosts] = useState([
    {
      id: "host-1",
      name: "Local Development Host",
      icon: "💻",
      configPath: "/Users/dev/.mcp/hosts/local-dev.json",
      configStatus: "configured",
      connectionStatus: "connected" as const
    },
    {
      id: "host-2",
      name: "Claude Desktop",
      icon: "🧠",
      configPath: "/Users/dev/.mcp/hosts/claude.json",
      configStatus: "configured",
      connectionStatus: "disconnected" as const
    },
    {
      id: "host-3",
      name: "VSCode Extension",
      icon: "📝",
      configPath: "/Users/dev/.mcp/hosts/vscode.json",
      configStatus: "misconfigured",
      connectionStatus: "disconnected" as const
    }
  ]);
  
  const [startingHost, setStartingHost] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // 处理启动外部Host应用程序的函数
  const handleStartHost = (hostId: string) => {
    const host = hosts.find(h => h.id === hostId);
    if (!host) return;
    
    setStartingHost(prev => ({ ...prev, [hostId]: true }));
    
    toast({
      title: "启动Host",
      description: `正在启动外部Host应用: ${host.name}`
    });
    
    // 模拟启动外部应用的过程
    setTimeout(() => {
      // 更新Host连接状态
      setHosts(prev => prev.map(h => {
        if (h.id === hostId) {
          return { ...h, connectionStatus: "connected" as const };
        }
        return h;
      }));
      
      setStartingHost(prev => ({ ...prev, [hostId]: false }));
      
      toast({
        title: "Host已启动",
        description: `${host.name}已成功启动并连接`
      });
    }, 2500);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mock Host Demo</h1>
      </div>

      <div className="grid gap-6">
        {hosts.map((host) => (
          <Card key={host.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{host.icon}</div>
                <div>
                  <CardTitle>{host.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <StatusIndicator 
                      status={host.connectionStatus === "connected" ? "active" : "inactive"} 
                      label={host.connectionStatus === "connected" ? "Connected" : "Disconnected"} 
                      size="sm"
                    />
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm text-muted-foreground"
                    >
                      View Config
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {host.connectionStatus !== "connected" && (
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 bg-green-500/10 border-green-500/20 text-green-600 hover:bg-green-500/20 hover:text-green-700"
                    onClick={() => handleStartHost(host.id)}
                    disabled={startingHost[host.id]}
                  >
                    {startingHost[host.id] ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-1">◌</span> 启动中
                      </span>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" /> 开启Host
                      </>
                    )}
                  </Button>
                )}
                <Button variant="outline">
                  {host.connectionStatus === "connected" ? "Current" : "Select"}
                </Button>
              </div>
            </CardHeader>
            
            {host.connectionStatus === "connected" && (
              <CardContent className="pt-2">
                <div className="border-t pt-4 mt-2">
                  <p className="text-sm text-muted-foreground">
                    This host is currently connected. You can manage connected servers and configure profiles.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Server className="h-4 w-4" /> 管理服务器
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Settings className="h-4 w-4" /> 配置设置
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
