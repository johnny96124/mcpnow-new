
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ServerExpiredPage() {
  const isMobile = useIsMobile();

  // Animation variants for the download button
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-12 px-4 max-w-7xl">
        {/* Two-column layout: Download CTA on left, Expired message on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left column - Download CTA and MCP Info - Now with sticky positioning */}
          <div className="lg:col-span-5 space-y-8">
            <div className={isMobile ? "" : "sticky top-8"}>
              {/* Download CTA Card */}
              <Card className="overflow-hidden border-blue-100 dark:border-blue-800">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 px-6 py-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 mb-2">
                      <img src="/lovable-uploads/84e5dfcb-d52e-4426-ac6c-0d731dfae35f.png" alt="MCP Now Logo" className="w-full h-full" />
                    </div>
                    
                    <h2 className="text-2xl font-bold tracking-tight">Get MCP Now for free</h2>
                    
                    <p className="text-muted-foreground">
                      Download MCP Now to discover, configure, and use AI models with a single click - all in one desktop application
                    </p>
                    
                    <motion.div animate={pulseAnimation} className="w-full max-w-xs">
                      <Button size="lg" variant="default" className="bg-blue-600 hover:bg-blue-700 gap-2 text-md font-medium h-12 w-full shadow-md">
                        <Download className="h-5 w-5" />
                        Download Now
                      </Button>
                    </motion.div>
                    
                    <p className="text-xs text-muted-foreground">Available for macOS • Free download</p>
                  </div>
                </div>
                
                <CardContent className="py-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-center">What is MCP Now?</h3>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-blue-600 dark:text-blue-400 flex-shrink-0">
                        <Info className="h-5 w-5" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        MCP Now is a desktop tool that unifies AI service management, allowing you to easily configure, use, and share different AI model services
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Right column - Expired message */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col items-center justify-center h-full text-center py-16 px-4">
              <div className="w-24 h-24 mb-6 opacity-50">
                <img 
                  src="/lovable-uploads/73160045-4ba5-4ffa-a980-50e0b33b3517.png" 
                  alt="Expired" 
                  className="w-full h-full"
                />
              </div>
              
              <h1 className="text-3xl font-bold tracking-tight mb-3">This server has expired</h1>
              
              <p className="text-lg text-muted-foreground max-w-md mb-8">
                The shared server link you're trying to access is no longer available. 
                Server links expire after 7 days for security reasons.
              </p>
              
              <div className="bg-muted/30 rounded-lg p-6 max-w-lg mb-6">
                <h3 className="font-medium mb-2">Why do shared links expire?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  For security and privacy reasons, all shared server links in MCP Now have a 7-day expiration period. 
                  This ensures that your configuration data isn't permanently exposed.
                </p>
                
                <div className="text-left mt-4 pt-4 border-t border-border">
                  <h4 className="text-sm font-medium mb-2">Looking for AI servers?</h4>
                  <Link to="/discovery">
                    <Button className="w-full">
                      Explore Discovery Channel
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
