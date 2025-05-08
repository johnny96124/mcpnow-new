
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Server, FileText, Download, Clock, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function ProfileExpiredPage() {
  const isMobile = useIsMobile();
  const [isSharingOpen, setSharingOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-12 px-4 max-w-5xl">
        <div className="flex flex-col gap-8 items-center">
          {/* Sharing Details - Collapsible */}
          <Card className="w-full border-slate-200 dark:border-slate-800 overflow-hidden">
            <Collapsible
              open={isSharingOpen}
              onOpenChange={setSharingOpen}
              className="w-full"
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-700 dark:text-slate-300">
                      Profile Share Link Expired
                    </h1>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span>This shared profile link has expired</span>
                    </div>
                  </div>
                </div>
                {isSharingOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="p-6 pt-0 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">
                  <p className="text-muted-foreground max-w-2xl mt-4">
                    The owner of this profile may have deleted it, or the link has timed out. 
                    Shared profile links automatically expire after 7 days for security reasons.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
          
          {/* Download Section - Simplified */}
          <Card className="w-full border-blue-100 dark:border-blue-900/30 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50/80 to-blue-100/80 dark:from-blue-950/30 dark:to-blue-900/20 px-6 py-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 mb-2">
                  <img src="/lovable-uploads/84e5dfcb-d52e-4426-ac6c-0d731dfae35f.png" alt="MCP Now Logo" className="w-full h-full" />
                </div>
                
                <h2 className="text-2xl font-bold tracking-tight">Try MCP Now for Free</h2>
                
                <p className="text-muted-foreground">
                  Download MCP Now to discover, configure and manage AI services across local and cloud environments
                </p>
                
                <motion.div 
                  animate={{
                    scale: [1, 1.03, 1],
                    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="w-full max-w-xs"
                >
                  <Button size="lg" variant="default" className="bg-blue-500 hover:bg-blue-600 gap-2 text-md font-medium h-12 w-full shadow-md">
                    <Download className="h-5 w-5" />
                    Download Now
                  </Button>
                </motion.div>
                
                <p className="text-xs text-muted-foreground">Available for macOS • Free download</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
