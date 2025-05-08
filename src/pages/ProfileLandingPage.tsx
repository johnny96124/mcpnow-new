import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Server, FileText, Download, Info, Copy, Check, ChevronDown } from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import type { EndpointType } from "@/data/mockData";

// Mock data for the shared profile - In a real app, you would fetch this from an API
const mockSharedProfile = {
  id: "shared-profile-1",
  name: "General Development",
  description: "General development environment for AI projects",
  createdBy: "MCP User",
  createdAt: "2025-01-15 14:30",
  // Added time information
  shareMode: "complete",
  // "complete" or "basic"
  servers: [{
    id: "server-1",
    name: "GitHub Copilot",
    description: "Official GitHub Copilot API integration for code completions and explanations",
    type: "HTTP_SSE" as EndpointType,
    status: "ready",
    arguments: [],
    url: "https://api.github.com/copilot/v1",
    headers: {
      "Authorization": "Bearer XXXX-XXXX-XXXX",
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    environment: {
      "GITHUB_COPILOT_TOKEN": "XXXX-XXXX-XXXX",
      "GITHUB_API_VERSION": "2023-03-15",
      "DEBUG_MODE": "false"
    }
  }, {
    id: "server-2",
    name: "Local File Assistant",
    description: "Local file processing and analysis for code repositories",
    type: "STDIO" as EndpointType,
    status: "ready",
    arguments: ["--model", "advanced-code-v2", "--temperature", "0.7", "--log-level", "info"],
    environment: {
      "MAX_TOKENS": "4096",
      "CONTEXT_WINDOW": "8192",
      "MODEL_PATH": "/usr/local/models/code-v2"
    }
  }]
};
export default function ProfileLandingPage() {
  const {
    shareId
  } = useParams<{
    shareId: string;
  }>();
  const [profile, setProfile] = useState(mockSharedProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  // Get the full URL for sharing
  const shareUrl = window.location.origin + location.pathname;
  useEffect(() => {
    // In a real application, you'd fetch the profile data using the shareId
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // This would be replaced with actual API call
      setProfile(mockSharedProfile);
      setIsLoading(false);
    }, 800);
  }, [shareId]);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The share link has been copied to your clipboard.",
        type: "success"
      });
    }).catch(err => {
      console.error("Failed to copy: ", err);
      toast({
        title: "Failed to copy",
        description: "Please try again or copy the URL manually.",
        type: "error"
      });
    });
  };

  // Animation variants for the download button
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section with Download CTA */}
        <div className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-background py-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col gap-4 text-center">
              <div className="flex justify-center">
                <Badge variant="outline" className="bg-blue-100/50 dark:bg-blue-900/20 text-primary font-medium">
                  Shared Profile
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{profile.name}</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">This profile has been shared with you. 
It contains server configurations and settings that you can import into MCP Now.</p>
              
              {/* Enhanced Download CTA */}
              <div className="bg-blue-50/70 dark:bg-blue-950/30 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30 max-w-2xl mx-auto">
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-blue-700 dark:text-blue-400 text-xl font-medium">
                    Ready to unlock the power of this profile?
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 max-w-lg">Download MCP Now to instantly import this MCP server profile 
and supercharge your AI development workflow.</p>
                  <motion.div animate={pulseAnimation} className="mt-2">
                    <Button size="lg" variant="default" className="bg-blue-600 hover:bg-blue-700 gap-2 text-md font-medium h-12 px-8 min-w-[240px] shadow-md">
                      <Download className="h-5 w-5" />
                      Download MCP Now
                    </Button>
                  </motion.div>
                  <p className="text-sm text-muted-foreground">Available for macOS • Free download</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Combined Profile Information and Servers Section */}
        <div className="container mx-auto max-w-4xl py-12 px-6 space-y-10">
          {/* Combined Card for Profile Information and Included Servers */}
          <Card>
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Profile Information</CardTitle>
                </div>
                {/* Removed server count badge from here */}
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Profile Name</h3>
                    <p className="font-medium">{profile.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Share Mode</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={profile.shareMode === "complete" ? "default" : "secondary"}>
                        {profile.shareMode === "complete" ? "Complete Configuration" : "Basic Profile"}
                      </Badge>
                      {profile.shareMode === "complete" && <span className="text-xs text-muted-foreground">Includes all parameters</span>}
                    </div>
                  </div>
                  
                  {/* Share Link section */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Share Link</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm truncate flex-1">{shareUrl}</span>
                      <button onClick={handleCopyLink} className="text-primary hover:text-primary/80 p-1.5 rounded-full hover:bg-primary/10 transition-colors" aria-label="Copy link">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Created On</h3>
                    <p>{profile.createdAt}</p>
                  </div>
                </div>
                
                <div className="rounded-md bg-blue-50 dark:bg-blue-950/30 border p-4">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-600 dark:text-blue-400">About Shared Profiles</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Shared profiles allow you to quickly set up servers that have been configured by other users. 
                        You can import this profile to your MCP Now installation to use these servers immediately.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Servers Section - Integrated within the same card */}
                <div className="mt-8 border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold tracking-tight">Included Servers</h2>
                    {/* Added server count badge here */}
                    <Badge variant="outline" className="bg-secondary/50">
                      {profile.servers.length} Server{profile.servers.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <div className="grid gap-4">
                    {profile.servers.map(server => <Accordion type="single" collapsible className="w-full" key={server.id}>
                        <AccordionItem value={server.id} className="border rounded-lg overflow-hidden">
                          <AccordionTrigger className="px-6 py-4 hover:no-underline bg-muted/20">
                            <div className="flex items-center gap-4 w-full">
                              <ServerLogo name={server.name} />
                              <div className="space-y-1 text-left">
                                <div className="flex items-center gap-2 text-xl font-semibold">
                                  {server.name}
                                  <EndpointLabel type={server.type as EndpointType} />
                                </div>
                                {server.description && <p className="text-muted-foreground text-sm">{server.description}</p>}
                              </div>
                            </div>
                          </AccordionTrigger>
                          
                          <AccordionContent className="p-0 border-t">
                            {/* Modified tab navigation style to match the design */}
                            <div className="px-6 pt-4 pb-0">
                              <Tabs defaultValue="configuration" className="w-full">
                                <div className="border-b">
                                  <div className="flex overflow-x-auto">
                                    {/* Updated tabs to match the design in image 2 */}
                                    <TabsList className="bg-transparent h-10 p-0 space-x-4">
                                      <TabsTrigger value="configuration" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 h-10">
                                        Configuration
                                      </TabsTrigger>
                                      
                                      <TabsTrigger value="environment" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 h-10">
                                        Environment Variables
                                      </TabsTrigger>
                                      
                                      {server.type === "HTTP_SSE" && <TabsTrigger value="headers" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 h-10">
                                          HTTP Headers
                                        </TabsTrigger>}
                                    </TabsList>
                                  </div>
                                </div>
                                
                                <TabsContent value="configuration" className="space-y-4 p-6">
                                  {server.type === "STDIO" && server.arguments.length > 0 && <div>
                                      <h3 className="text-sm font-medium mb-2">Command Arguments</h3>
                                      <pre className="bg-muted/40 p-3 rounded-md overflow-x-auto text-sm whitespace-pre-wrap">
                                        {server.arguments.join(' ')}
                                      </pre>
                                    </div>}
                                  
                                  {server.type === "HTTP_SSE" && <div>
                                      <h3 className="text-sm font-medium mb-2">URL</h3>
                                      <pre className="bg-muted/40 p-3 rounded-md overflow-x-auto text-sm">
                                        {server.url}
                                      </pre>
                                    </div>}
                                </TabsContent>
                                
                                <TabsContent value="environment" className="p-6">
                                  {Object.keys(server.environment).length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {Object.entries(server.environment).map(([key, value]) => <div key={key} className="bg-muted/30 border rounded-md p-3">
                                          <div className="font-mono text-xs font-medium mb-1">{key}</div>
                                          <div className="font-mono text-xs text-muted-foreground truncate">
                                            {value}
                                          </div>
                                        </div>)}
                                    </div> : <div className="text-center text-muted-foreground py-4">
                                      No environment variables configured
                                    </div>}
                                </TabsContent>
                                
                                {server.type === "HTTP_SSE" && <TabsContent value="headers" className="p-6">
                                    {Object.keys(server.headers).length > 0 ? <div className="space-y-4">
                                        {Object.entries(server.headers).map(([key, value]) => <div key={key} className="bg-muted/30 border rounded-md p-3">
                                            <div className="font-mono text-xs font-medium mb-1">{key}</div>
                                            <div className="font-mono text-xs text-muted-foreground truncate">
                                              {value}
                                            </div>
                                          </div>)}
                                      </div> : <div className="text-center text-muted-foreground py-4">
                                        No headers configured
                                      </div>}
                                  </TabsContent>}
                              </Tabs>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* About MCP Now Section */}
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-center">About MCP Now</h2>
            
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-2/3 p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    
                    <h3 className="text-xl font-semibold">All in one MCP management platform</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">MCP Now helps you config and manage MCP servers with minimal effort. Connect your favorite hosts and start building right away.</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Explore and Add MCP Servers quickly</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Built-in dashboard for MCP hosts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Share servers with the community </span>
                    </div>
                    
                  </div>
                </div>
                <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 flex items-center justify-center">
                  <img src="/lovable-uploads/84e5dfcb-d52e-4426-ac6c-0d731dfae35f.png" alt="MCP Now Logo" className="w-3/4 h-auto" />
                </div>
              </div>
            </Card>
            
            {/* Bottom Download CTA */}
            
          </div>
        </div>
      </main>
      
      <Footer />
    </div>;
}