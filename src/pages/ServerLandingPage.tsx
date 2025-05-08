
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
import { Server, FileText, Download, Info, Copy, Check, ChevronDown, Clock, Terminal, Shield, ExternalLink, User, Tag, List } from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { CategoryList } from "@/components/discovery/CategoryList";
import type { EndpointType } from "@/data/mockData";

// Mock data for the shared server - In a real app, you would fetch this from an API
const mockSharedServer = {
  id: "shared-server-1",
  name: "GitHub Copilot API",
  description: "Official GitHub Copilot API integration for code completions and explanations",
  createdBy: "MCP User",
  author: "GitHub",
  createdAt: "2025-01-15 14:30",
  type: "HTTP_SSE" as EndpointType,
  shareMode: "complete", // "complete" or "basic"
  status: "ready",
  version: "1.2.0",
  officialStatus: "verified",
  category: "code-assistant",
  categories: ["code-assistant", "documentation", "testing", "productivity"],
  url: "https://api.github.com/copilot/v1",
  apiDocUrl: "https://docs.github.com/en/copilot/github-copilot-api-reference",
  arguments: [],
  headers: {
    "Authorization": "Bearer XXXX-XXXX-XXXX",
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  environment: {
    "GITHUB_COPILOT_TOKEN": "XXXX-XXXX-XXXX",
    "GITHUB_API_VERSION": "2023-03-15",
    "DEBUG_MODE": "false"
  },
  requirements: {
    "apiKey": true,
    "localModel": false,
    "internetAccess": true,
    "minimumMemory": "4GB"
  },
  repository: "https://github.com/github/copilot-api",
  features: ["Code completion", "Code explanation", "Test generation", "Documentation"]
};

export default function ServerLandingPage() {
  const { shareId } = useParams<{ shareId: string }>();
  const [server, setServer] = useState(mockSharedServer);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  // Get the full URL for sharing
  const shareUrl = window.location.origin + location.pathname;

  // Calculate expiration time - 7 days from creation
  const createDate = new Date(server.createdAt);
  const expiryDate = new Date(createDate);
  expiryDate.setDate(expiryDate.getDate() + 7); // Links expire after 7 days

  // Format the date to display with dashes instead of any other separators
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

  // Check if the server link is valid (not expired)
  const isLinkValid = daysRemaining > 0;

  useEffect(() => {
    // In a real application, you'd fetch the server data using the shareId
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // This would be replaced with actual API call
      setServer(mockSharedServer);
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
      });
    }).catch(err => {
      console.error("Failed to copy: ", err);
      toast({
        title: "Failed to copy",
        description: "Please try again or copy the URL manually.",
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
      
      <main className="flex-1 container mx-auto py-12 px-4 max-w-7xl">
        {/* Two-column layout: Download CTA on left, Server details on right */}
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
                  
                  <h2 className="text-2xl font-bold tracking-tight">Use this server with MCP Now</h2>
                  
                  <p className="text-muted-foreground">
                    Download the MCP Now client to import <span className="font-medium text-blue-600 dark:text-blue-400">{server.name}</span> with one click and start using it instantly
                  </p>
                  
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
                      With the server sharing feature, you can import server configurations shared by others with one click, without manual setup
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Server Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* Server Info Header */}
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Badge variant="outline" className="bg-blue-100/50 dark:bg-blue-900/20 text-primary font-medium mb-2">
                    Shared Server
                  </Badge>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">{server.name}</h1>
                    <ProfileStatusBadge isValid={isLinkValid} className="mt-1" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Server Details Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-8">
                  {/* Top section with key server information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Share Details</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Share Mode</p>
                          <div className="flex items-center gap-2">
                            <Badge variant={server.shareMode === "complete" ? "default" : "secondary"}>
                              {server.shareMode === "complete" ? "Complete Configuration" : "Basic Configuration"}
                            </Badge>
                            {server.shareMode === "complete" && (
                              <span className="text-xs text-muted-foreground">Includes all parameters</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-1">Shareable Link</p>
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
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Date Information</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Created On</p>
                          <p>{formatDate(createDate)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-1">Expired On</p>
                          <p>{formatDate(expiryDate)}</p>
                          <div className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400 mt-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{isLinkValid ? `${daysRemaining} days remaining` : "Link has expired"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <Separator className="my-2" />
                  
                  {/* Server Details Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <ServerLogo name={server.name} className="w-12 h-12" />
                      <div>
                        <h2 className="font-semibold text-lg">{server.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <EndpointLabel type={server.type} />
                          {server.officialStatus === "verified" && (
                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground">{server.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left details column */}
                      <div className="space-y-5">
                        <div>
                          <h3 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                            <User className="h-4 w-4" /> Author
                          </h3>
                          <p className="text-sm">{server.author}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                            <List className="h-4 w-4" /> Features
                          </h3>
                          <ul className="text-sm space-y-1 list-disc list-inside">
                            {server.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                            <Tag className="h-4 w-4" /> Categories
                          </h3>
                          {server.categories && <CategoryList categories={server.categories} maxVisible={5} />}
                        </div>
                      </div>
                      
                      {/* Right details column */}
                      <div className="space-y-5">
                        <div>
                          <h3 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                            <Info className="h-4 w-4" /> Version
                          </h3>
                          <p className="text-sm">{server.version}</p>
                        </div>
                        
                        {server.repository && (
                          <div>
                            <h3 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                              <FileText className="h-4 w-4" /> Repository
                            </h3>
                            <a 
                              href={server.repository} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                            >
                              {server.repository}
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        )}
                        
                        <div>
                          <h3 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                            <Terminal className="h-4 w-4" /> Server Type
                          </h3>
                          <div className="flex items-center gap-2">
                            <EndpointLabel type={server.type} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Server Configuration Section - Only show if this is a complete share */}
            {server.shareMode === "complete" && (
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Configuration Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="general" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="environment">Environment</TabsTrigger>
                      {server.type === "HTTP_SSE" && <TabsTrigger value="headers">Headers</TabsTrigger>}
                      <TabsTrigger value="requirements">Requirements</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="general" className="space-y-4">
                      {server.type === "HTTP_SSE" && (
                        <div>
                          <h3 className="text-sm font-medium mb-2">URL</h3>
                          <pre className="bg-muted/40 p-3 rounded-md overflow-x-auto text-sm">
                            {server.url}
                          </pre>
                          
                          {server.apiDocUrl && (
                            <div className="mt-3">
                              <Button variant="outline" size="sm" onClick={() => window.open(server.apiDocUrl, '_blank')} className="gap-1.5">
                                <ExternalLink className="h-3.5 w-3.5" />
                                View API Documentation
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {server.type === "STDIO" && server.arguments.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium mb-2">Command Arguments</h3>
                          <pre className="bg-muted/40 p-3 rounded-md overflow-x-auto text-sm whitespace-pre-wrap">
                            {server.arguments.join(' ')}
                          </pre>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="environment" className="space-y-4">
                      {Object.keys(server.environment).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                      <TabsContent value="headers" className="space-y-4">
                        {Object.keys(server.headers).length > 0 ? (
                          <div className="space-y-3">
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
                            No HTTP headers configured
                          </div>
                        )}
                      </TabsContent>
                    )}
                    
                    <TabsContent value="requirements" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(server.requirements).map(([key, value]) => {
                          const label = {
                            'apiKey': 'API Key Required',
                            'localModel': 'Local Model Required',
                            'internetAccess': 'Internet Access Required',
                            'minimumMemory': 'Minimum Memory'
                          }[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                          
                          const valueDisplay = typeof value === 'boolean' 
                            ? (value ? 'Yes' : 'No')
                            : value;
                            
                          return (
                            <div key={key} className="bg-muted/30 border rounded-md p-3">
                              <div className="text-xs font-medium mb-1">{label}</div>
                              <div className="text-xs text-muted-foreground">
                                {String(valueDisplay)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
