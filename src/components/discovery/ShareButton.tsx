
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ShareServerDialog } from "./ShareServerDialog";
import { ServerInstance, ServerDefinition } from "@/data/mockData";

interface ShareButtonProps {
  server: ServerInstance | ServerDefinition;
  serverDefinition?: ServerDefinition | null;
}

export function ShareButton({ server, serverDefinition }: ShareButtonProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShareDialogOpen(true)}
        className="h-8 gap-1"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>
      
      <ShareServerDialog 
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        server={server}
        serverDefinition={serverDefinition}
      />
    </>
  );
}
