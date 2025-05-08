
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Server, FileText, Download, Clock, AlertCircle, Compass, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ServerExpiredPage() {
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
                      Server Share Link Expired
                    </h1>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span>This shared server link has expired</span>
                    </div>
                  </div>
                </div>
                {isSharingOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="p-6 pt-0 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">
                  <p className="text-muted-foreground max-w-2xl mt-4">
                    The owner of this server may have deleted it, or the link has timed out. 
                    Shared server links automatically expire after 7 days for security reasons.
                  </p>
                  
                  <div className="pt-4">
                    <Button variant="outline" className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800" asChild>
                      <Link to="/discovery">
                        <Compass className="h-4 w-4" />
                        Discover Available Servers
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
          
          {/* Server Information and Configuration Details - Accordion */}
          <Card className="w-full border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-white dark:bg-slate-950 p-0">
              <Accordion type="single" collapsible className="border-none">
                <AccordionItem value="server-info" className="border-b border-slate-200 dark:border-slate-800">
                  <AccordionTrigger className="px-6 py-4">
                    Server Information
                  </AccordionTrigger>
                  <AccordionContent className="px-6">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        This server configuration was designed to provide optimal performance for large language model inference.
                        It includes preconfigured environment variables and runtime settings.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
                          <div className="font-medium text-sm">Server Type</div>
                          <div className="text-sm text-muted-foreground">LLM Inference</div>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
                          <div className="font-medium text-sm">Version</div>
                          <div className="text-sm text-muted-foreground">2.1.0</div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="config-details" className="border-b-0">
                  <AccordionTrigger className="px-6 py-4">
                    Configuration Details
                  </AccordionTrigger>
                  <AccordionContent className="px-6">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        The server was configured with the following parameters to ensure optimal performance
                        and compatibility with popular LLM workflows.
                      </p>
                      <div className="overflow-hidden rounded-md border border-slate-200 dark:border-slate-800">
                        <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 text-sm font-medium">
                          Environment Variables
                        </div>
                        <div className="p-4 text-sm">
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-1">
                              <div className="font-mono text-blue-600 dark:text-blue-400">MODEL_PATH</div>
                              <div className="text-muted-foreground">/models/llm-base</div>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              <div className="font-mono text-blue-600 dark:text-blue-400">MAX_TOKENS</div>
                              <div className="text-muted-foreground">2048</div>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              <div className="font-mono text-blue-600 dark:text-blue-400">CUDA_VISIBLE_DEVICES</div>
                              <div className="text-muted-foreground">0,1</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Card>
          
          {/* Download Section - Simplified */}
          <Card className="w-full border-blue-100 dark:border-blue-900/30 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50/80 to-blue-100/80 dark:from-blue-950/30 dark:to-blue-900/20 px-6 py-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 mb-2">
                  <img src="/lovable-uploads/84e5dfcb-d52e-4426-ac6c-0d731dfae35f.png" alt="MCP Now Logo" className="w-full h-full" />
                </div>
                
                <h2 className="text-2xl font-bold tracking-tight">Explore AI Services with MCP Now</h2>
                
                <p className="text-muted-foreground">
                  Download MCP Now to connect to hundreds of AI services, manage configurations, and optimize your AI workflow
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
