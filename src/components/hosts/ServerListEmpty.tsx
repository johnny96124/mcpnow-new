
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServerListEmptyProps {
  onAddServers: () => void;
  highlight?: boolean;
}

export const ServerListEmpty: React.FC<ServerListEmptyProps> = ({ 
  onAddServers,
  highlight = false
}) => {
  return (
    <div className="border-2 border-dashed rounded-lg p-8 text-center flex flex-col items-center justify-center">
      <div className="rounded-full bg-muted/50 p-4 mb-4">
        <Plus className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">未添加服务器</h3>
      <p className="text-muted-foreground mb-4 max-w-[280px]">
        添加服务器到此配置文件，以便在主机上运行
      </p>
      <Button 
        id="add-servers-button"
        onClick={onAddServers} 
        className={highlight ? 'animate-pulse ring-2 ring-primary ring-offset-2' : ''}
      >
        <Plus className="h-4 w-4 mr-2" />
        添加服务器
      </Button>
    </div>
  );
};

export default ServerListEmpty;
