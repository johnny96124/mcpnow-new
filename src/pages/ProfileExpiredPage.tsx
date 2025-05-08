
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Server, FileText, Download, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import DownloadSection from "@/components/marketing/DownloadSection";

export default function ProfileExpiredPage() {
  const isMobile = useIsMobile();

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
              </div>
            </div>
          </Card>
        </div>
      </main>
      
      {/* Download CTA - Floating banner at the bottom */}
      <div className="sticky bottom-0 w-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/80 dark:to-blue-900/80 border-t border-blue-200 dark:border-blue-800 py-4 backdrop-blur-sm z-10 shadow-lg">
        <div className="container mx-auto flex items-center justify-between max-w-5xl px-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 flex-shrink-0 hidden sm:block">
              <img src="/lovable-uploads/84e5dfcb-d52e-4426-ac6c-0d731dfae35f.png" alt="MCP Now Logo" className="w-full h-full" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-semibold">Try MCP Now for Free</h3>
              <p className="text-sm text-muted-foreground hidden sm:block">Available for macOS</p>
            </div>
          </div>
          <div>
            <motion.div 
              animate={{
                scale: [1, 1.05, 1],
                transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Button size="lg" variant="default" className="bg-blue-500 hover:bg-blue-600 gap-2 text-md h-10 sm:h-12">
                <Download className="h-5 w-5" />
                <span>Download Now</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
