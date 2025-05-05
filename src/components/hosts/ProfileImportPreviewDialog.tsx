
import React from "react";
import { Server } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Profile, ServerInstance } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EndpointLabel } from "@/components/status/EndpointLabel";

interface ProfileImportPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  servers: ServerInstance[];
  onConfirmImport: () => void;
}

export const ProfileImportPreviewDialog: React.FC<ProfileImportPreviewDialogProps> = ({
  open,
  onOpenChange,
  profile,
  servers,
  onConfirmImport
}) => {
  const { toast } = useToast();

  const handleConfirmImport = () => {
    onConfirmImport();
    onOpenChange(false);
    toast({
      title: "Profile imported successfully",
      description: `${profile.name} and its servers have been added to your profiles`,
      type: "success"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl text-foreground">
            <Server className="h-5 w-5" /> Import Profile
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Review and confirm the profile you're about to import
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 pt-3">
          {/* Profile Preview - Reusing styles from ShareProfileDialog */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground capitalize">
              Profile Details
            </h3>
            
            <div className="rounded-lg border overflow-hidden shadow-sm">
              {/* Profile name header */}
              <div className="bg-muted/30 p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-lg text-foreground">{profile.name}</div>
                  <Badge variant="outline" className="bg-secondary/50">{servers.length} Server{servers.length !== 1 ? 's' : ''}</Badge>
                </div>
              </div>
              
              {/* Servers list with ScrollArea */}
              <ScrollArea className="h-[240px]">
                <div className="divide-y divide-border">
                  {servers.map((server) => (
                    <div key={server.id} className="p-3.5 flex justify-between items-center bg-card hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <Server className="h-4 w-4 text-foreground" />
                        <span className="font-medium text-foreground">{server.name}</span>
                        <EndpointLabel type={server.connectionDetails?.includes('http') ? 'HTTP_SSE' : 'STDIO'} />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleConfirmImport} className="px-8">
              Import Profile
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
