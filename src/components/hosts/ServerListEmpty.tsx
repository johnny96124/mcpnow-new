
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Server } from "lucide-react";
import { GuidedTourOverlay } from "@/components/onboarding/GuidedTourOverlay";

interface ServerListEmptyProps {
  onAddServers: () => void;
}

export const ServerListEmpty: React.FC<ServerListEmptyProps> = ({ onAddServers }) => {
  const [showTourOverlay, setShowTourOverlay] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if we need to show the guided tour
    if (sessionStorage.getItem('highlightAddServers') === 'true') {
      setShowTourOverlay(true);
    }
  }, []);

  const handleCloseTour = () => {
    setShowTourOverlay(false);
    sessionStorage.removeItem('highlightAddServers');
  };

  return (
    <>
      <div className="text-center py-12 space-y-4">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-muted/30 p-3 rounded-full">
            <Server className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No servers in this profile</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Add servers to this profile to get started. You can add existing servers or create new ones.
          </p>
        </div>
        <Button 
          id="add-servers-button" 
          onClick={onAddServers}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Servers
        </Button>
      </div>

      <GuidedTourOverlay 
        targetElementId="add-servers-button"
        onClose={handleCloseTour}
        isVisible={showTourOverlay}
        guidanceText="点击此处添加服务器到您的配置文件"
      />
    </>
  );
};
