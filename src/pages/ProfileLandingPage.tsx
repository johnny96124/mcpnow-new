
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Server, FileText, Download, Info, Copy, Check, ChevronDown, Clock } from "lucide-react";
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
  const { shareId } = useParams<{ shareId: string }>();
  const [profile, setProfile] = useState(mockSharedProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  // Get the full URL for sharing
  const shareUrl = window.location.origin + location.pathname;

  // Calculate expiration time - 7 days from creation
  const createDate = new Date(profile.createdAt);
  const expiryDate = new Date(createDate);
  expiryDate.setDate(expiryDate.getDate() + 7); // Links expire after 7 days

  // Format the date to display
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString(undefined, options);
  };

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Main two-column layout */}
        <div className="container mx-auto py-10 px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column - Download CTA and MCP Now info */}
            <div className="lg:w-1/3 space-y-6">
              {/* Profile Badge and Title Section */}
              <div className="text-center lg:text-left mb-6">
                <Badge variant="outline" className="bg-blue-100/50 dark:bg-blue-900/20 text-primary font-medium mb-3">
                  Shared Profile
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
                <p className="text-muted-foreground mt-2">A ready-to-use server configuration collection</p>
              </div>
              
              {/* Download CTA Card */}
              <Card className="border-blue-100 dark:border-blue-900/30">
                <CardContent className="pt-6">
                  <div className="bg-blue-50/70 dark:bg-blue-950/30 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="text-blue-700 dark:text-blue-400 text-xl font-medium text-center">Ready to use this MCP server profile?</div>
                      <p className="text-gray-600 dark:text-gray-300 text-center">Download MCP Now to instantly import this profile and add these servers to your development environment.</p>
                      <motion.div animate={pulseAnimation} className="mt-2">
                        <Button size="lg" variant="default" className="bg-blue-600 hover:bg-blue-700 gap-2 text-md font-medium h-12 px-6 sm:px-8 shadow-md w-full sm:w-auto">
                          <Download className="h-5 w-5" />
                          Download MCP Now
                        </Button>
                      </motion.div>
                      <p className="text-sm text-muted-foreground">Available for macOS • Free download</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* About MCP Now - Simplified */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">About MCP Now</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">MCP Now helps you configure and manage MCP servers with minimal effort. Connect your favorite hosts and start building right away.</p>
                  
                  <div className="space-y-2">
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
                      <span>Share servers with the community</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <img src="/lovable-uploads/84e5dfcb-d52e-4426-ac6c-0d731dfae35f.png" alt="MCP Now Logo" className="w-1/2 h-auto" />
                  </div>
                </CardContent>
              </Card>
              
              {/* Expiry Information */}
              <div className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400 justify-center lg:justify-start">
                <Clock className="h-3.5 w-3.5" />
                <span>Link expires on {formatDate(expiryDate)}</span>
              </div>
            </div>
            
            {/* Right Column - Profile Information and Server Details */}
            <div className="lg:w-2/3">
              <Card className="mb-6">
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex items-center justify-between">
                    <CardTitle>Profile Details</CardTitle>
                    <Badge variant="outline" className="bg-secondary/50">
                      {profile.servers.length} Server{profile.servers.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Profile Name</h3>
                        <p className="font-normal">{profile.name}</p>
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
                    
                    {/* Info box about shared profiles */}
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
                  </div>
                </CardContent>
              </Card>
            
              {/* Server Details Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Included Servers</h2>
                
                <div className="grid gap-4">
                  {profile.servers.map(server => (
                    <Accordion type="single" collapsible className="w-full" key={server.id}>
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
                          <div className="px-6 pt-4 pb-0">
                            <Tabs defaultValue="configuration" className="w-full">
                              <div className="border-b">
                                <div className="flex overflow-x-auto">
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
                    </Accordion>
                  ))}
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
