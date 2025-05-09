
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { type Host } from "@/data/mockData";
import { EmojiPicker } from "./EmojiPicker";

interface ManualHostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHost: (host: Host) => void;
}

export function ManualHostDialog({ open, onOpenChange, onAddHost }: ManualHostDialogProps) {
  const [manualHostName, setManualHostName] = useState("");
  const [configPath, setConfigPath] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("💻");
  const { toast } = useToast();

  const handleAddManualHost = () => {
    if (!manualHostName.trim()) {
      toast({
        title: "Invalid host name",
        description: "Please enter a valid host name",
        variant: "destructive"
      });
      return;
    }

    // Config path is optional now
    if (configPath && !validateConfigPath(configPath)) {
      toast({
        title: "Invalid config path",
        description: "Config path must start with / and end with .json",
        variant: "destructive"
      });
      return;
    }

    const newHost: Host = {
      id: `host-${Date.now()}`,
      name: manualHostName,
      icon: selectedEmoji,
      configPath: configPath || undefined,
      configStatus: configPath ? "configured" : "unknown",
      connectionStatus: configPath ? "connected" : "connected", // Changed to connected by default
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
    }
    onOpenChange(newOpenState);
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
          
          <div className="space-y-2">
            <Label htmlFor="configPath">Config Path <span className="text-muted-foreground text-sm">(optional)</span></Label>
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

        <DialogFooter>
          <Button variant="outline" onClick={() => handleDialogReset(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddManualHost}>
            <Plus className="h-4 w-4 mr-2" />
            Add Host
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
