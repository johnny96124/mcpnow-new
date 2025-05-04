
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { format } from "date-fns";

export interface VersionInfo {
  version: string;
  releaseDate: Date | string;
  author: string;
  changes?: string[];
}

interface VersionHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverName: string;
  versions: VersionInfo[];
  onInstallVersion: (version: string) => void;
}

export function VersionHistoryDialog({
  open,
  onOpenChange,
  serverName,
  versions,
  onInstallVersion
}: VersionHistoryDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("versions");
  
  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
      return date;
    }
    return format(date, "MMM d, yyyy");
  };

  const getRelativeTime = (date: Date | string) => {
    const now = new Date();
    const releaseDate = typeof date === 'string' ? new Date(date) : date;
    const diffMonths = (now.getFullYear() - releaseDate.getFullYear()) * 12 + 
                      now.getMonth() - releaseDate.getMonth();
    
    if (diffMonths === 0) {
      return "This month";
    } else if (diffMonths === 1) {
      return "1 month ago";
    } else {
      return `${diffMonths} months ago`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">Version History</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <Tabs 
          defaultValue="versions" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="versions" className="text-center">VERSIONS</TabsTrigger>
            <TabsTrigger value="changelog" className="text-center">CHANGE LOG</TabsTrigger>
          </TabsList>
          
          <TabsContent value="versions" className="space-y-4">
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">VERSION</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">LAST UPDATED</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">RELEASED BY</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {versions.map((version, index) => (
                    <tr key={version.version} className={index !== versions.length - 1 ? "border-b" : ""}>
                      <td className="px-4 py-3 text-sm font-medium">{version.version}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {getRelativeTime(version.releaseDate)}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{version.author}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => onInstallVersion(version.version)}
                          >
                            Install
                          </Button>
                          <Button variant="outline">
                            Download
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="changelog" className="space-y-6">
            {versions.map(version => (
              <div key={version.version} className="border-b pb-4 last:border-0">
                <h3 className="text-lg font-semibold mb-2">
                  {version.version} - {formatDate(version.releaseDate)}
                </h3>
                
                {version.changes && version.changes.length > 0 ? (
                  <ul className="space-y-2 list-disc list-inside">
                    {version.changes.map((change, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">{change}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No change log</p>
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
