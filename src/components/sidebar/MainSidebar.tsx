
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard,
  Settings, 
  HelpCircle,
  BookOpen,
  Telescope,
  Home,
  Link,
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { HelpDialog } from "@/components/help/HelpDialog";
import { GettingStartedDialog } from "@/components/onboarding/GettingStartedDialog";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SocialLinks } from "./SocialLinks";

interface MainSidebarProps {
  collapsed?: boolean;
}

export function MainSidebar({ collapsed = false }: MainSidebarProps) {
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  const navigate = useNavigate();
  
  const handleLogoClick = () => {
    navigate('/introduction-3');
  };
  
  return (
    <div className="border-r bg-sidebar h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
          <img 
            src="/lovable-uploads/0ad4c791-4d08-4e94-bbeb-3ac78aae67ef.png" 
            alt="MCP Now Logo" 
            className="h-6 w-6" 
          />
          {!collapsed && <h1 className="text-lg font-semibold">MCP Now</h1>}
        </div>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-2">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              cn(
                "sidebar-item text-sm", 
                isActive && "sidebar-item-active",
                collapsed && "justify-center px-0"
              )
            }
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            {!collapsed && "Dashboard"}
          </NavLink>

          <NavLink 
            to="/introduction-3" 
            className={({ isActive }) => 
              cn(
                "sidebar-item text-sm", 
                isActive && "sidebar-item-active",
                collapsed && "justify-center px-0"
              )
            }
          >
            <Home className="h-4 w-4 mr-2" />
            {!collapsed && "Introduction"}
          </NavLink>

          <NavLink 
            to="/discovery" 
            className={({ isActive }) => 
              cn(
                "sidebar-item text-sm", 
                isActive && "sidebar-item-active",
                collapsed && "justify-center px-0"
              )
            }
          >
            <Telescope className="h-4 w-4 mr-2" />
            {!collapsed && "Discovery"}
          </NavLink>
          
          <NavLink 
            to="/shared-profile/demo" 
            className={({ isActive }) => 
              cn(
                "sidebar-item text-sm", 
                isActive && "sidebar-item-active",
                collapsed && "justify-center px-0"
              )
            }
          >
            <Link className="h-4 w-4 mr-2" />
            {!collapsed && "Profile Landing"}
          </NavLink>
          
          <NavLink 
            to="/shared-server/demo" 
            className={({ isActive }) => 
              cn(
                "sidebar-item text-sm", 
                isActive && "sidebar-item-active",
                collapsed && "justify-center px-0"
              )
            }
          >
            <Server className="h-4 w-4 mr-2" />
            {!collapsed && "Server Landing"}
          </NavLink>

          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              cn(
                "sidebar-item text-sm", 
                isActive && "sidebar-item-active",
                collapsed && "justify-center px-0"
              )
            }
          >
            <Settings className="h-4 w-4 mr-2" />
            {!collapsed && "Settings"}
          </NavLink>
        </nav>
      </ScrollArea>
      
      <SocialLinks />
      
      <div className="border-t p-4">
        <div className="flex justify-between items-center gap-2">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-8 w-8" 
            onClick={() => setShowGettingStarted(true)}
          >
            <BookOpen className="h-4 w-4" />
          </Button>
          <HelpDialog />
        </div>
      </div>
      
      <GettingStartedDialog 
        open={showGettingStarted} 
        onOpenChange={setShowGettingStarted} 
      />
    </div>
  );
}
