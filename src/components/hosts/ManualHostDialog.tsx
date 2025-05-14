
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Computer, Plus, Server } from "lucide-react";
import { type Host } from "@/data/mockData";
import { EmojiPicker } from "./EmojiPicker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ManualHostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHost: (host: Host) => void;
}

export function ManualHostDialog({ open, onOpenChange, onAddHost }: ManualHostDialogProps) {
  const [manualHostName, setManualHostName] = useState("");
  const [configPath, setConfigPath] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("💻");
  const [configOption, setConfigOption] = useState<"withPath" | "withoutPath">("withPath");
  const [serverType, setServerType] = useState<"HTTP_SSE" | "STDIO">("HTTP_SSE");
  const { toast } = useToast();

  // Sample configs in JSON format for display based on server type
  const sampleConfigs = {
    HTTP_SSE: {
      mcpServers: {
        mcpnow: {
          type: "HTTP_SSE",
          url: "http://localhost:8008/mcp",
          headers: {
            "Content-Type": "application/json"
          }
        }
      }
    },
    STDIO: {
      mcpServers: {
        mcpnow: {
          type: "STDIO",
          command: "npx",
          args: [
            "-y",
            "@modelcontextprotocol/mcpnow"
          ],
          env: {
            "MCP_PORT": "8008"
          }
        }
      }
    }
  };

  const handleAddManualHost = () => {
    if (!manualHostName.trim()) {
      toast({
        title: "Invalid host name",
        description: "Please enter a valid host name",
        variant: "destructive"
      });
      return;
    }

    // Only validate path if user chose the withPath option
    if (configOption === "withPath") {
      if (!validateConfigPath(configPath)) {
        toast({
          title: "Invalid config path",
          description: "Config path must start with / and end with .json",
          variant: "destructive"
        });
        return;
      }
    }

    const newHost: Host = {
      id: `host-${Date.now()}`,
      name: manualHostName,
      icon: selectedEmoji,
      configPath: configOption === "withPath" ? configPath : undefined,
      configStatus: configOption === "withPath" ? "configured" : "unknown",
      connectionStatus: "connected",
      profileId: `profile-${Date.now()}`
    };

    const defaultProfileName = `${manualHostName} Default`;
    
    const newHostWithProfile = {
      ...newHost,
      defaultProfileName
    };

    onAddHost(newHostWithProfile);
    
    toast({
      title: "Host Added",
      description: `Successfully added ${manualHostName}`
    });
    
    handleDialogReset(false);
  };

  const validateConfigPath = (path: string) => {
    return path.startsWith("/") && path.endsWith(".json");
  };

  const handleDialogReset = (newOpenState: boolean) => {
    if (!newOpenState) {
      setManualHostName("");
      setConfigPath("");
      setSelectedEmoji("💻");
      setConfigOption("withPath");
      setServerType("HTTP_SSE");
    }
    onOpenChange(newOpenState);
  };

  const copyConfigToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(serverType === "HTTP_SSE" ? sampleConfigs.HTTP_SSE : sampleConfigs.STDIO, null, 2));
    toast({
      title: "Configuration copied",
      description: "Configuration has been copied to clipboard"
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogReset}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Host Manually</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="hostName">Host Name <span className="text-destructive">*</span></Label>
            <Input
              id="hostName"
              value={manualHostName}
              onChange={(e) => setManualHostName(e.target.value)}
              placeholder="Enter host name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hostIcon">Host Icon</Label>
            <EmojiPicker 
              selectedEmoji={selectedEmoji}
              onEmojiSelected={(emoji) => setSelectedEmoji(emoji)}
            />
          </div>
          
          <div className="space-y-3">
            <Label>Configuration Method</Label>
            <RadioGroup 
              value={configOption} 
              onValueChange={(value) => setConfigOption(value as "withPath" | "withoutPath")}
              className="flex flex-col gap-3"
            >
              <div className={cn(
                "flex items-center space-x-3 rounded-md border p-4 cursor-pointer",
                configOption === "withPath" ? "border-primary bg-primary/5" : "border-muted"
              )}>
                <RadioGroupItem value="withPath" id="withPath" />
                <Label htmlFor="withPath" className="cursor-pointer flex-1">
                  <div className="font-medium mb-1 flex items-center">
                    <Server className="h-4 w-4 mr-2" />
                    Specify Config Path
                  </div>
                  <p className="text-sm text-muted-foreground">
                    I'll provide the path to my configuration file
                  </p>
                </Label>
              </div>
              
              {configOption === "withPath" && (
                <div className="pl-8 pr-4 -mt-2 mb-2">
                  <div className="space-y-2">
                    <Label htmlFor="configPath">Config Path <span className="text-destructive">*</span></Label>
                    <Input
                      id="configPath"
                      value={configPath}
                      onChange={(e) => setConfigPath(e.target.value)}
                      placeholder="/path/to/config.json"
                    />
                    <p className="text-xs text-muted-foreground">
                      Path must start with / and end with .json
                    </p>
                  </div>
                </div>
              )}
              
              <div className={cn(
                "flex items-center space-x-3 rounded-md border p-4 cursor-pointer",
                configOption === "withoutPath" ? "border-primary bg-primary/5" : "border-muted"
              )}>
                <RadioGroupItem value="withoutPath" id="withoutPath" />
                <Label htmlFor="withoutPath" className="cursor-pointer flex-1">
                  <div className="font-medium mb-1 flex items-center">
                    <Computer className="h-4 w-4 mr-2" />
                    Manual Configuration
                  </div>
                  <p className="text-sm text-muted-foreground">
                    I'll manually set up the configuration on my host
                  </p>
                </Label>
              </div>
              
              {configOption === "withoutPath" && (
                <div className="pl-8 pr-4 -mt-2 mb-2">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="serverType">Server Type</Label>
                      <Select 
                        value={serverType} 
                        onValueChange={(val) => setServerType(val as "HTTP_SSE" | "STDIO")}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select server type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HTTP_SSE">HTTP SSE</SelectItem>
                          <SelectItem value="STDIO">STDIO</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Choose the type of server to configure
                      </p>
                    </div>
                    
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertDescription className="text-blue-800">
                        Please copy this configuration and manually add it to your host's MCP configuration.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="relative">
                      <ScrollArea className="h-[120px] w-full rounded-md border p-4">
                        <pre className="text-xs font-mono">
                          {JSON.stringify(
                            serverType === "HTTP_SSE" ? sampleConfigs.HTTP_SSE : sampleConfigs.STDIO, 
                            null, 
                            2
                          )}
                        </pre>
                      </ScrollArea>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={copyConfigToClipboard} 
                        className="absolute top-2 right-2"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleDialogReset(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddManualHost}>
            <Plus className="h-4 w-4 mr-2" />
            Confirm & Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
