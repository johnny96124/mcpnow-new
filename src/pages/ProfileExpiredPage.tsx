
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Server, FileText, Download, Clock, AlertCircle, Info, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function ProfileExpiredPage() {
  const isMobile = useIsMobile();
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-12 px-4 max-w-5xl">
        <div className="flex flex-col gap-8 items-center">
          {/* Expired Notice */}
          <Card className="w-full border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <AlertCircle className="h-8 w-8" />
                </div>
                
                <h1 className="text-3xl font-bold tracking-tight text-slate-700 dark:text-slate-300">
                  Profile Share Link Expired
                </h1>
                
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Clock className="h-5 w-5" />
                  <span>This shared profile link has expired</span>
                </div>
                
                <p className="text-muted-foreground max-w-2xl">
                  The owner of this profile may have deleted it, or the link has timed out. 
                  Shared profile links automatically expire after 7 days for security reasons.
                </p>
                
                {/* Collapsible Sharing Details - Now less prominent */}
                <Collapsible 
                  open={isDetailsOpen} 
                  onOpenChange={setIsDetailsOpen} 
                  className="w-full max-w-md border rounded-lg mt-4 overflow-hidden"
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-sm font-medium text-left text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      <span>Sharing details</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDetailsOpen ? "transform rotate-180" : ""}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-t">
                    <div className="p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50 text-sm">
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Created:</span>
                        <span className="ml-2 text-muted-foreground">2023-05-01 14:30</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Expired:</span>
                        <span className="ml-2 text-muted-foreground">2023-05-08 14:30</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Share mode:</span>
                        <span className="ml-2 text-muted-foreground">Complete configuration</span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </Card>
          
          {/* Try MCP Now - Redesigned as a footer banner instead of interrupting content */}
          <div className="w-full sticky bottom-8">
            <Card className="border-blue-100 dark:border-blue-900/30 overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-blue-50/80 to-blue-100/80 dark:from-blue-950/30 dark:to-blue-900/20 p-4">
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block">
                    <img src="/lovable-uploads/84e5dfcb-d52e-4426-ac6c-0d731dfae35f.png" alt="MCP Now Logo" className="w-12 h-12" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Try MCP Now</h2>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      Easily configure and manage AI services
                    </p>
                  </div>
                  
                  <div>
                    <motion.div 
                      animate={{
                        scale: [1, 1.03, 1],
                        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <Button size="sm" variant="default" className="bg-blue-500 hover:bg-blue-600 gap-2 shadow-sm whitespace-nowrap">
                        <Download className="h-4 w-4" />
                        <span className="sm:inline">Download Now</span>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
