import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { ProfileStatusBadge } from "@/components/status/ProfileStatusBadge";
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

  // Calculate expiration time - 7 days from creation
  const createDate = new Date(profile.createdAt);
  const expiryDate = new Date(createDate);
  expiryDate.setDate(expiryDate.getDate() + 7); // Links expire after 7 days

  // Format the date to display - Updated to use dashes instead of any other separators
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // Calculate days remaining until expiration
  const daysRemaining = Math.max(0, Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)));

  // Check if the profile is valid (not expired)
  const isProfileValid = daysRemaining > 0;
  
  // ... keep existing code (useEffect hooks and handler functions)
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
      
      <main className="flex-1 container mx-auto py-12 px-4 max-w-7xl">
        {/* Two-column layout: Download CTA on left, Profile details on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left column - Download CTA and MCP Info */}
          <div className="lg:col-span-5 space-y-8">
            {/* Download CTA Card */}
            <Card className="overflow-hidden border-blue-100 dark:border-blue-800">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 px-6 py-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 mb-2">
                    <img src="/lovable-uploads/84e5dfcb-d52e-4426-ac6c-0d731dfae35f.png" alt="MCP Now Logo" className="w-full h-full" />
                  </div>
                  
                  <h2 className="text-2xl font-bold tracking-tight">Import this configuration with MCP Now</h2>
                  
                  <p className="text-muted-foreground">Download the MCP Now client to import the <span className="font-medium text-blue-600 dark:text-blue-400">{profile.name}</span> configuration with one click and use these AI services instantly</p>
                  
                  <motion.div animate={pulseAnimation} className="w-full max-w-xs">
                    <Button size="lg" variant="default" className="bg-blue-600 hover:bg-blue-700 gap-2 text-md font-medium h-12 w-full shadow-md">
                      <Download className="h-5 w-5" />
                      Download MCP Now
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
                      <Server className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      MCP Now is a desktop tool that unifies AI service management, allowing you to easily configure, use, and share different AI model services
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      With the configuration sharing feature, you can import service configurations shared by others with one click, without manual setup
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Profile and Servers */}
          <div className="lg:col-span-7 space-y-6">
            {/* Profile Info Header */}
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Badge variant="outline" className="bg-blue-100/50 dark:bg-blue-900/20 text-primary font-medium mb-2">
                    Shared Profile
                  </Badge>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
                    <ProfileStatusBadge isValid={isProfileValid} className="mt-1" />
                  </div>
                </div>
                
              </div>
              
            </div>
            
            {/* Key Profile Information */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Sharing Mode</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={profile.shareMode === "complete" ? "default" : "secondary"}>
                        {profile.shareMode === "complete" ? "Complete Configuration" : "Basic Configuration"}
                      </Badge>
                      {profile.shareMode === "complete" && <span className="text-xs text-muted-foreground">Includes all parameters</span>}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Shared Link</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm truncate flex-1">{shareUrl}</span>
                      <button onClick={handleCopyLink} className="text-primary hover:text-primary/80 p-1.5 rounded-full hover:bg-primary/10 transition-colors" aria-label="Copy link">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Created On</h3>
                    <div className="space-y-1">
                      <p>{formatDate(createDate)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Expired On</h3>
                    <div className="space-y-1">
                      <p>{formatDate(expiryDate)}</p>
                      <div className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{isProfileValid ? `${daysRemaining} days remaining` : "Link has expired"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Server List - The main focus */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                <Server className="h-5 w-5" /> 
                Included Servers
                <Badge variant="outline" className="bg-secondary/50 ml-2">
                  {profile.servers.length} Servers
                </Badge>
              </h2>
              
              <div className="space-y-4">
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
                                    No HTTP headers configured
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
        </div>
      </main>
      
      <Footer />
    </div>;
}
