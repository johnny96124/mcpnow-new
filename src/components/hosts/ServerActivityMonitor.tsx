import { useState, useEffect } from "react";
import { Activity, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ServerRequest {
  id: string;
  serverName: string;
  method: string;
  timestamp: Date;
  status: 'success' | 'error' | 'pending';
  responseTime?: number;
  errorMessage?: string;
}

interface RequestStats {
  total: number;
  success: number;
  error: number;
  avgResponseTime: number;
}

interface ServerActivityMonitorProps {
  hostName: string;
  connectedServers: Array<{
    id: string;
    name: string;
    status: string;
    enabled: boolean;
  }>;
  isHostConnected: boolean;
}

export function ServerActivityMonitor({ hostName, connectedServers, isHostConnected }: ServerActivityMonitorProps) {
  const [serverRequests, setServerRequests] = useState<ServerRequest[]>([]);
  const [requestStats, setRequestStats] = useState<RequestStats>({ total: 0, success: 0, error: 0, avgResponseTime: 0 });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // 模拟Server调用监控数据
  useEffect(() => {
    if (!isHostConnected) {
      setServerRequests([]);
      return;
    }

    const activeServers = connectedServers.filter(s => s.enabled && s.status === 'running');
    
    if (activeServers.length === 0) {
      setServerRequests([]);
      return;
    }

    const interval = setInterval(() => {
      // 随机生成Server调用请求
      if (Math.random() > 0.6) { // 40%概率生成请求
        const randomServer = activeServers[Math.floor(Math.random() * activeServers.length)];
        const methods = ['get_data', 'process_file', 'search', 'analyze', 'generate_response', 'list_files', 'read_resource'];
        const method = methods[Math.floor(Math.random() * methods.length)];
        
        const newRequest: ServerRequest = {
          id: Date.now().toString(),
          serverName: randomServer.name,
          method,
          timestamp: new Date(),
          status: 'pending',
        };
        
        setServerRequests(prev => [newRequest, ...prev.slice(0, 199)]); // 保留最近200条记录
        
        // 模拟请求完成
        setTimeout(() => {
          const success = Math.random() > 0.12; // 88%成功率
          const responseTime = 30 + Math.random() * 800; // 30-830ms
          
          setServerRequests(prev => 
            prev.map(req => 
              req.id === newRequest.id 
                ? {
                    ...req,
                    status: success ? 'success' : 'error',
                    responseTime: success ? responseTime : undefined,
                    errorMessage: success ? undefined : 'Server timeout or connection error'
                  }
                : req
            )
          );
        }, 200 + Math.random() * 1500);
      }
    }, 3000 + Math.random() * 4000); // 3-7秒间隔

    return () => clearInterval(interval);
  }, [isHostConnected, connectedServers]);

  // 计算请求统计数据
  useEffect(() => {
    const recentRequests = serverRequests.filter(req => 
      Date.now() - req.timestamp.getTime() < 10 * 60 * 1000 // 最近10分钟
    );
    
    const stats = {
      total: recentRequests.length,
      success: recentRequests.filter(req => req.status === 'success').length,
      error: recentRequests.filter(req => req.status === 'error').length,
      avgResponseTime: recentRequests.filter(req => req.responseTime).length > 0 
        ? Math.round(recentRequests.filter(req => req.responseTime).reduce((sum, req) => sum + (req.responseTime || 0), 0) / recentRequests.filter(req => req.responseTime).length)
        : 0
    };
    
    setRequestStats(stats);
  }, [serverRequests]);

  if (!isHostConnected || connectedServers.length === 0) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Server Activity (10 min)
            </CardTitle>
            {requestStats.total > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsHistoryOpen(true)}
                className="h-7 px-2 text-xs"
              >
                View History
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {requestStats.total === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No server requests yet
            </div>
          ) : (
            <div className="space-y-4">
              {/* 统计概览 */}
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-2 bg-muted/30 rounded">
                  <div className="text-lg font-semibold">{requestStats.total}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="text-center p-2 bg-green-50 dark:bg-green-950/20 rounded">
                  <div className="text-lg font-semibold text-green-600">{requestStats.success}</div>
                  <div className="text-xs text-muted-foreground">Success</div>
                </div>
                <div className="text-center p-2 bg-red-50 dark:bg-red-950/20 rounded">
                  <div className="text-lg font-semibold text-red-600">{requestStats.error}</div>
                  <div className="text-xs text-muted-foreground">Error</div>
                </div>
                <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                  <div className="text-lg font-semibold text-blue-600">{requestStats.avgResponseTime}ms</div>
                  <div className="text-xs text-muted-foreground">Avg Time</div>
                </div>
              </div>
              
              {/* 最近5个请求的实时显示 */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Recent Requests</h4>
                <div className="space-y-1">
                  {serverRequests.slice(0, 5).map(request => (
                    <div key={request.id} className={cn(
                      "flex items-center justify-between p-2 rounded text-xs",
                      request.status === 'success' ? "bg-green-50 dark:bg-green-950/10" :
                      request.status === 'error' ? "bg-red-50 dark:bg-red-950/10" :
                      "bg-yellow-50 dark:bg-yellow-950/10"
                    )}>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <StatusIndicator 
                          status={
                            request.status === 'success' ? 'active' :
                            request.status === 'error' ? 'error' : 'warning'
                          }
                        />
                        <span className="font-medium truncate max-w-[80px]">{request.serverName}</span>
                        <span className="text-muted-foreground truncate">{request.method}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                        <Clock className="h-3 w-3" />
                        <span>{request.timestamp.toLocaleTimeString().slice(0, 5)}</span>
                        {request.responseTime && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            {Math.round(request.responseTime)}ms
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 历史记录对话框 */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Server Request History - {hostName}
            </DialogTitle>
            <DialogDescription>
              Complete history of server requests and responses from this host
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* 详细统计概览 */}
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{serverRequests.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {serverRequests.filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-muted-foreground">Success</div>
              </div>
              <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {serverRequests.filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {serverRequests.filter(r => r.responseTime).length > 0 
                    ? Math.round(serverRequests.filter(r => r.responseTime).reduce((sum, r) => sum + (r.responseTime || 0), 0) / serverRequests.filter(r => r.responseTime).length)
                    : 0}ms
                </div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {serverRequests.filter(r => r.status === 'success').length > 0 
                    ? Math.round((serverRequests.filter(r => r.status === 'success').length / serverRequests.length) * 100)
                    : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
            
            {/* 请求列表 */}
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {serverRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No requests recorded yet
                  </div>
                ) : (
                  serverRequests.map(request => (
                    <div 
                      key={request.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border",
                        request.status === 'success' ? "bg-green-50 dark:bg-green-950/10 border-green-200 dark:border-green-800" :
                        request.status === 'error' ? "bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-800" :
                        "bg-yellow-50 dark:bg-yellow-950/10 border-yellow-200 dark:border-yellow-800"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <StatusIndicator 
                          status={
                            request.status === 'success' ? 'active' :
                            request.status === 'error' ? 'error' : 'warning'
                          }
                        />
                        <div>
                          <div className="font-medium">{request.serverName}</div>
                          <div className="text-sm text-muted-foreground">{request.method}</div>
                          {request.status === 'error' && request.errorMessage && (
                            <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {request.errorMessage}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="flex items-center gap-2 justify-end">
                          <Clock className="h-3 w-3" />
                          <span>{request.timestamp.toLocaleString()}</span>
                        </div>
                        {request.responseTime && (
                          <div className="text-muted-foreground mt-1">
                            <TrendingUp className="h-3 w-3 inline mr-1" />
                            {Math.round(request.responseTime)}ms
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsHistoryOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}