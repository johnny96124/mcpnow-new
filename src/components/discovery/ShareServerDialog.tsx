
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ServerInstance, ServerDefinition } from "@/data/mockData";

interface ShareServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerInstance | ServerDefinition;
  serverDefinition?: ServerDefinition | null;
}

export function ShareServerDialog({
  open,
  onOpenChange,
  server,
  serverDefinition
}: ShareServerDialogProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  // Determine the correct ID to use for the share URL
  const definitionId = 'definitionId' in server ? server.definitionId : server.id;
  
  // Create a share URL that would point to a landing page for this server
  const shareUrl = `https://mcpnow.app/discover/${definitionId || 'server'}`;
  
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard",
      });
      
      // Close dialog after copying
      setTimeout(() => {
        onOpenChange(false);
        // Reset copied state after dialog closes
        setTimeout(() => setIsCopied(false), 300);
      }, 1000);
    });
  };

  // Use serverDefinition if provided, otherwise check if server itself is a ServerDefinition
  const description = serverDefinition?.description || 
                     ('description' in server ? server.description : "A powerful server that enhances your development workflow");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Server</DialogTitle>
          <DialogDescription>
            Share this server with others who might find it useful
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-start gap-4 py-4">
          <ServerLogo name={server.name} className="w-12 h-12 flex-shrink-0" />
          
          <div className="space-y-1 min-w-0">
            <h3 className="font-semibold text-lg">{server.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {description}
            </p>
          </div>
        </div>
        
        <div className="bg-muted/40 border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm truncate mr-2 flex-1">
              {shareUrl}
            </div>
            <Button 
              variant="secondary"
              size="sm"
              className="gap-1.5 w-24 flex-shrink-0"
              onClick={handleCopyUrl}
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
        
        <DialogFooter className="mt-4 sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Recipients will see server details and download options
          </div>
          <Button 
            variant="default" 
            onClick={handleCopyUrl}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isCopied ? "Copied!" : "Copy and Share"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
