import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Server, FileText, Download, Info, Copy, Check } from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { toast } from "@/components/ui/use-toast";
import type { EndpointType } from "@/data/mockData";

// Mock data for the shared profile - In a real app, you would fetch this from an API
const mockSharedProfile = {
  id: "shared-profile-1",
  name: "General Development",
  description: "General development environment for AI projects",
  createdBy: "MCP User",
  createdAt: "2025-01-15 14:30", // Added time information
  shareMode: "complete", // "complete" or "basic"
  servers: [
    {
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
    },
    {
      id: "server-2",
      name: "Local File Assistant",
      description: "Local file processing and analysis for code repositories",
      type: "STDIO" as EndpointType,
      status: "ready",
      arguments: [
        "--model", "advanced-code-v2", 
        "--temperature", "0.7", 
        "--log-level", "info"
      ],
      environment: {
        "MAX_TOKENS": "4096",
        "CONTEXT_WINDOW": "8192",
        "MODEL_PATH": "/usr/local/models/code-v2"
      }
    }
  ]
};

export default function ProfileLandingPage() {
  const { shareId } = useParams<{ shareId: string }>();
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
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        toast({
          title: "Link copied!",
          description: "The share link has been copied to your clipboard.",
          type: "success"
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Failed to copy",
          description: "Please try again or copy the URL manually.",
          type: "error"
        });
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-background py-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col gap-4 text-center">
              <div className="flex justify-center">
                <Badge variant="outline" className="bg-blue-100/50 dark:bg-blue-900/20 text-primary font-medium">
                  Shared Profile
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{profile.name}</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                This profile has been shared with you. It contains server configurations and settings that you can import into MCP Now.
              </p>
            </div>
          </div>
        </div>
        
        {/* Profile Details Section */}
        <div className="container mx-auto max-w-4xl py-12 px-6 space-y-10">
          {/* Profile Info Card */}
          <Card>
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Profile Information</CardTitle>
                </div>
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
                    <p className="font-medium">{profile.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Share Mode</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={profile.shareMode === "complete" ? "default" : "secondary"}>
                        {profile.shareMode === "complete" ? "Complete Configuration" : "Basic Profile"}
                      </Badge>
                      {profile.shareMode === "complete" && (
                        <span className="text-xs text-muted-foreground">Includes all parameters</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Updated Share Link section to match the design */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Share Link</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm truncate flex-1">{shareUrl}</span>
                      <button 
                        onClick={handleCopyLink}
                        className="text-primary hover:text-primary/80 p-1.5 rounded-full hover:bg-primary/10 transition-colors"
                        aria-label="Copy link"
                      >
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
              </div>
            </CardContent>
          </Card>
          
          {/* Servers Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">Included Servers</h2>
            </div>
            
            <div className="grid gap-6">
              {profile.servers.map((server) => (
                <Card key={server.id} className="overflow-hidden">
                  <CardHeader className="border-b bg-muted/30 p-4 md:p-6">
                    <div className="flex items-center gap-4">
                      <ServerLogo name={server.name} />
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-xl">
                          {server.name}
                          <EndpointLabel type={server.type as EndpointType} />
                        </CardTitle>
                        {server.description && (
                          <p className="text-muted-foreground text-sm">{server.description}</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <Tabs defaultValue="configuration" className="w-full">
                      <div className="border-b px-4 md:px-6">
                        <TabsList className="h-12">
                          <TabsTrigger value="configuration">Configuration</TabsTrigger>
                          <TabsTrigger value="environment">Environment Variables</TabsTrigger>
                          {server.type === "HTTP_SSE" && (
                            <TabsTrigger value="headers">HTTP Headers</TabsTrigger>
                          )}
                        </TabsList>
                      </div>
                      
                      <TabsContent value="configuration" className="space-y-4 p-4 md:p-6">
                        {server.type === "STDIO" && server.arguments.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium mb-2">Command Arguments</h3>
                            <pre className="bg-muted/40 p-3 rounded-md overflow-x-auto text-sm whitespace-pre-wrap">
                              {server.arguments.join(' ')}
                            </pre>
                          </div>
                        )}
                        
                        {server.type === "HTTP_SSE" && (
                          <div>
                            <h3 className="text-sm font-medium mb-2">URL</h3>
                            <pre className="bg-muted/40 p-3 rounded-md overflow-x-auto text-sm">
                              {server.url}
                            </pre>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="environment" className="p-4 md:p-6">
                        {Object.keys(server.environment).length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(server.environment).map(([key, value]) => (
                              <div key={key} className="bg-muted/30 border rounded-md p-3">
                                <div className="font-mono text-xs font-medium mb-1">{key}</div>
                                <div className="font-mono text-xs text-muted-foreground truncate">
                                  {value}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-4">
                            No environment variables configured
                          </div>
                        )}
                      </TabsContent>
                      
                      {server.type === "HTTP_SSE" && (
                        <TabsContent value="headers" className="p-4 md:p-6">
                          {Object.keys(server.headers).length > 0 ? (
                            <div className="space-y-4">
                              {Object.entries(server.headers).map(([key, value]) => (
                                <div key={key} className="bg-muted/30 border rounded-md p-3">
                                  <div className="font-mono text-xs font-medium mb-1">{key}</div>
                                  <div className="font-mono text-xs text-muted-foreground truncate">
                                    {value}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground py-4">
                              No headers configured
                            </div>
                          )}
                        </TabsContent>
                      )}
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* About MCP Now Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">About MCP Now</h2>
            
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-2/3 p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Server className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">The Ultimate AI Model Management Platform</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    MCP Now simplifies AI model deployment and management for developers, researchers, and enterprises.
                    With powerful tools for configuring, monitoring, and scaling your AI servers, MCP Now helps you get
                    the most out of your models with minimal friction.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Seamless integration with popular AI models</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Real-time monitoring and analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Share and collaborate on profiles with your team</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>Optimized for both local and cloud deployments</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 flex items-center justify-center p-8">
                  <img 
                    src="/lovable-uploads/654262e6-ff1d-42fc-b9cf-d9f672f96de1.png" 
                    alt="MCP Now Logo"
                    className="max-w-full max-h-48"
                  />
                </div>
              </div>
            </Card>
          </div>
          
          {/* Download Section */}
          <div className="text-center py-8 space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">Ready to use this profile?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Download MCP Now to import this profile and get started with these preconfigured servers in minutes.
            </p>
            
            <Button size="lg" variant="default" className="bg-blue-600 hover:bg-blue-700 gap-2 px-8 py-6 text-md font-medium">
              <Download className="h-5 w-5" />
              Download MCP Now
            </Button>
            
            <p className="text-sm text-muted-foreground pt-4">
              Available for Windows, macOS, and Linux
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
