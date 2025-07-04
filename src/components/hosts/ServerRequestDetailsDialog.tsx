import { useState } from "react";
import { Clock, Activity, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface ServerRequestDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ServerRequest | null;
}

export function ServerRequestDetailsDialog({
  open,
  onOpenChange,
  request
}: ServerRequestDetailsDialogProps) {
  if (!request) return null;

  // Mock detailed request/response data based on the request
  const mockRequestData = {
    jsonrpc: "2.0",
    id: parseInt(request.id),
    method: request.method,
    params: {
      path: request.method === 'list_files' ? "/documents" : undefined,
      query: request.method === 'search' ? "React components" : undefined,
      file: request.method === 'process_file' ? "/data/example.txt" : undefined,
      resource: request.method === 'read_resource' ? "file://documents/readme.md" : undefined,
      data: request.method === 'analyze' ? { content: "Sample content for analysis" } : undefined
    }
  };

  const mockResponseData = request.status === 'success' ? {
    jsonrpc: "2.0",
    id: parseInt(request.id),
    result: request.method === 'list_files' ? {
      files: [
        { name: "document1.txt", size: 1024, modified: "2024-12-01T10:30:00Z" },
        { name: "document2.pdf", size: 2048, modified: "2024-12-01T11:15:00Z" }
      ]
    } : request.method === 'search' ? {
      results: [
        { title: "React Components Guide", url: "https://react.dev/components", relevance: 0.95 },
        { title: "Building Components", url: "https://example.com/guide", relevance: 0.87 }
      ]
    } : request.method === 'process_file' ? {
      processed: true,
      output: "/processed/example_processed.txt",
      lines_processed: 150
    } : request.method === 'read_resource' ? {
      content: "# README\n\nThis is a sample readme file content...",
      encoding: "utf-8",
      size: 256
    } : request.method === 'analyze' ? {
      analysis: {
        sentiment: "positive",
        keywords: ["react", "components", "modern"],
        confidence: 0.92
      }
    } : {
      message: "Operation completed successfully",
      timestamp: request.timestamp.toISOString()
    }
  } : {
    jsonrpc: "2.0",
    id: parseInt(request.id),
    error: {
      code: -32601,
      message: request.errorMessage || "Method not found",
      data: {
        method: request.method,
        timestamp: request.timestamp.toISOString()
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]" size="xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5" />
            Request Details - {request.serverName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Request overview */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-3 h-3 rounded-full",
                request.status === 'success' ? "bg-green-500" :
                request.status === 'error' ? "bg-red-500" : "bg-yellow-500"
              )} />
              <div>
                <div className="font-medium">{request.method}</div>
                <div className="text-sm text-muted-foreground">
                  {request.timestamp.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              {request.responseTime && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{Math.round(request.responseTime)}ms</span>
                </div>
              )}
              <Badge variant={
                request.status === 'success' ? 'default' :
                request.status === 'error' ? 'destructive' : 'secondary'
              }>
                {request.status}
              </Badge>
            </div>
          </div>

          {/* Request/Response tabs */}
          <Tabs defaultValue="request" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="request">Request</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
            </TabsList>
            
            <TabsContent value="request" className="mt-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Request Payload
                </h4>
                <ScrollArea className="h-[300px] w-full">
                  <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto">
                    {JSON.stringify(mockRequestData, null, 2)}
                  </pre>
                </ScrollArea>
              </div>
            </TabsContent>
            
            <TabsContent value="response" className="mt-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    request.status === 'success' ? "bg-green-500" : "bg-red-500"
                  )}></div>
                  Response Payload
                </h4>
                <ScrollArea className="h-[300px] w-full">
                  <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto">
                    {JSON.stringify(mockResponseData, null, 2)}
                  </pre>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}