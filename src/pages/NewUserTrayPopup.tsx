import { useState } from "react";
import { ExternalLink, ChevronRight, Download, Settings, User, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * A component that displays a first-time user experience in the System Tray.
 * This guides new users through the initial steps of setting up and using the application.
 */
const NewUserTrayPopup = () => {
  // Open specific pages directly
  const openDiscoveryPage = () => {
    window.open("/discovery", "_blank");
  };
  const openDashboard = () => {
    window.open("/", "_blank");
  };
  return <div className="w-[420px] p-2 bg-background rounded-lg shadow-lg animate-fade-in max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-2 mb-4">
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/0ad4c791-4d08-4e94-bbeb-3ac78aae67ef.png" alt="MCP Now Logo" className="h-6 w-6" />
          <h2 className="font-medium">MCP Now</h2>
        </div>
        <Button size="sm" variant="ghost" className="text-xs flex items-center gap-1" onClick={openDashboard}>
          <span>Open Dashboard</span>
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>

      <ScrollArea className="h-full max-h-[calc(80vh-70px)]">
        <div className="pr-3">
          <div className="space-y-4 px-1">
            <div className="text-center py-4">
              <h3 className="text-xl font-semibold mb-2">Welcome to MCP Now!</h3>
              <p className="text-muted-foreground">
                Follow these simple steps to start configuring and using MCP Now.
              </p>
            </div>
            
            <Card className="overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                <h4 className="font-medium mb-2">Getting Started Guide</h4>
                <p className="text-sm text-muted-foreground">MCP Now helps you manage and configure your MCP servers. Follow these steps to start with:</p>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-1 h-10 w-10 flex items-center justify-center text-primary text-sm font-medium mt-0.5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
                      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M7 10H7.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M7 14H7.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Add Hosts</h5>
                    <p className="text-xs text-muted-foreground">Connect to available MCP hosts in your local computer.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-1 h-10 w-10 flex items-center justify-center text-primary text-sm font-medium mt-0.5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-600">
                      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Step 2: Discover and Add Servers</h5>
                    <p className="text-xs text-muted-foreground">
                      Select and configure servers for your host.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-1 h-10 w-10 flex items-center justify-center text-primary text-sm font-medium mt-0.5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600">
                      <path d="M5 12L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Manage Servers</h5>
                    <p className="text-xs text-muted-foreground">Start, monitor, and debug your servers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-1 h-10 w-10 flex items-center justify-center text-primary text-sm font-medium mt-0.5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-600">
                      <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 7L12 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 12H4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Share Profiles and Servers</h5>
                    <p className="text-xs text-muted-foreground">
                      Share your MCP configuration with others.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="flex justify-center pb-6">
              <Button onClick={openDiscoveryPage} className="gap-1 min-w-[180px]" size="lg">
                Get Started
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>;
};
export default NewUserTrayPopup;