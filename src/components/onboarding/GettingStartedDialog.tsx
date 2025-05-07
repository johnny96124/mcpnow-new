
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  BookOpen,
  Settings2,
  Layers,
  Computer,
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { markOnboardingAsSeen } from "@/utils/localStorage";

interface GettingStartedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GettingStartedDialog = ({ open, onOpenChange }: GettingStartedDialogProps) => {
  const [expandedStep, setExpandedStep] = useState<number>(0);
  const [closing, setClosing] = useState(false);
  const [animationOrigin, setAnimationOrigin] = useState<string>("60 calc(100vh - 60)");
  const dialogRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!open && !closing) {
      setClosing(false);
    }
  }, [open, closing]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setAnimationOrigin("60 calc(100vh - 60)");
      
      setClosing(true);
      
      setTimeout(() => {
        markOnboardingAsSeen();
        setClosing(false);
        onOpenChange(false);
      }, 300);
    } else {
      onOpenChange(true);
    }
  };

  const beginnerGuideSteps = [
    {
      title: "Install Servers from Discovery",
      description: "Browse and install server definitions for your workflow.",
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      iconColor: "text-blue-600 dark:text-blue-300",
      content: (
        <>
          <p className="text-muted-foreground mb-4">
            Start by installing server definitions from our Discovery page:
          </p>
          <ol className="list-decimal list-inside space-y-3 text-sm">
            <li className="py-1">Navigate to the <Link to="/discovery" className="text-blue-500 hover:underline">Discovery</Link> page</li>
            <li className="py-1">Browse available server types based on your needs</li>
            <li className="py-1">Click "Install" to add server definitions to your environment</li>
            <li className="py-1">Explore official and community-created server options</li>
          </ol>
          <div className="pt-4">
            <Button asChild size="sm" className="gap-1 bg-blue-500 hover:bg-blue-600">
              <Link to="/discovery">
                Go to Discovery
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      )
    },
    {
      title: "Create Instances & Configure Parameters",
      description: "Create and customize server instances with specific settings.",
      icon: <Settings2 className="h-6 w-6 text-purple-500" />,
      iconBg: "bg-purple-100 dark:bg-purple-900/40",
      iconColor: "text-purple-600 dark:text-purple-300",
      content: (
        <>
          <p className="text-muted-foreground mb-4">
            Once you've installed server definitions, create instances with custom configurations:
          </p>
          <ol className="list-decimal list-inside space-y-3 text-sm">
            <li className="py-1">Go to <Link to="/servers" className="text-purple-500 hover:underline">Servers</Link> page</li>
            <li className="py-1">Click "Add Instance" on an installed server</li>
            <li className="py-1">Set name, parameters, and environment variables</li>
            <li className="py-1">Configure connection details specific to your needs</li>
          </ol>
          <div className="pt-4">
            <Button asChild size="sm" className="gap-1 bg-purple-500 hover:bg-purple-600">
              <Link to="/servers">
                Manage Servers
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      )
    },
    {
      title: "Create Profiles & Add Instances",
      description: "Organize server instances into profiles for easier management.",
      icon: <Layers className="h-6 w-6 text-green-500" />,
      iconBg: "bg-green-100 dark:bg-green-900/40", 
      iconColor: "text-green-600 dark:text-green-300",
      content: (
        <>
          <p className="text-muted-foreground mb-4">
            Create profiles to group your server instances logically:
          </p>
          <ol className="list-decimal list-inside space-y-3 text-sm">
            <li className="py-1">Visit the <Link to="/profiles" className="text-green-500 hover:underline">Profiles</Link> page</li>
            <li className="py-1">Create a new profile with a relevant name</li>
            <li className="py-1">Add your configured server instances to the profile</li>
            <li className="py-1">Enable the profile to activate all included instances</li>
          </ol>
          <div className="pt-4">
            <Button asChild size="sm" className="gap-1 bg-green-500 hover:bg-green-600">
              <Link to="/profiles">
                Create Profiles
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      )
    },
    {
      title: "Associate Hosts with Profiles",
      description: "Connect your profiles to hosts to deploy server instances.",
      icon: <Computer className="h-6 w-6 text-amber-500" />,
      iconBg: "bg-amber-100 dark:bg-amber-900/40",
      iconColor: "text-amber-600 dark:text-amber-300",
      content: (
        <>
          <p className="text-muted-foreground mb-4">
            Finally, associate your profiles with hosts to run your server instances:
          </p>
          <ol className="list-decimal list-inside space-y-3 text-sm">
            <li className="py-1">Go to the <Link to="/hosts" className="text-amber-500 hover:underline">Hosts</Link> page</li>
            <li className="py-1">Add a new host or select an existing one</li>
            <li className="py-1">Assign your created profile to the host</li>
            <li className="py-1">Monitor status and control your server instances</li>
          </ol>
          <div className="pt-4">
            <Button asChild size="sm" className="gap-1 bg-amber-500 hover:bg-amber-600">
              <Link to="/hosts">
                Manage Hosts
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      )
    }
  ];

  return (
    <Dialog open={open || closing} onOpenChange={handleOpenChange}>
      <DialogContent 
        ref={dialogRef}
        className={`max-w-2xl ${closing ? 'animate-collapse' : 'animate-expand'}`}
        animationOrigin={animationOrigin}
        hideClose={true}
        size="xl"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Welcome to MCP Now</DialogTitle>
          <DialogDescription className="text-base">
            Follow these simple steps to configure and start using MCP Now effectively.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Accordion 
            type="single" 
            defaultValue="step-0" 
            collapsible 
            className="w-full rounded-md overflow-hidden border"
          >
            {beginnerGuideSteps.map((step, index) => (
              <AccordionItem 
                key={`step-${index}`} 
                value={`step-${index}`}
                className={index === beginnerGuideSteps.length - 1 ? "border-0" : ""}
              >
                <AccordionTrigger 
                  className="px-4 py-5 hover:bg-muted/30 data-[state=open]:bg-muted/20"
                  icon={
                    <div className={`${step.iconBg} ${step.iconColor} p-3 rounded-full`}>
                      {step.icon}
                    </div>
                  }
                >
                  <div>
                    <h3 className="font-medium text-lg">Step {index + 1}: {step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 bg-muted/10">
                  {step.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            You can reopen this guide anytime from the sidebar.
          </div>
          <DialogClose asChild>
            <Button>
              Got it
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
