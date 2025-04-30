import { useState, useEffect, useMemo } from "react";
import { Search, FileCode, Menu, X, ExternalLink, ChevronRight, Download, Info, Tag, ArrowRight, Check, ChevronLeft, ChevronDown, Plus, GitMerge } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerDefinition } from "@/data/mockData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddInstanceDialog } from "@/components/servers/AddInstanceDialog";
import { useToast } from "@/hooks/use-toast";
import { OfficialBadge } from "@/components/servers/OfficialBadge";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";
import { useHostProfiles } from "@/hooks/useHostProfiles";
import { ServerToolsList } from "@/components/discovery/ServerToolsList";
import { ServerLogo } from "@/components/servers/ServerLogo";

const ITEMS_PER_PAGE = 12;

interface EnhancedServerDefinition extends ServerDefinition {
  views?: number;
  installations?: number;
}

const serverDefinitions: EnhancedServerDefinition[] = [
  {
    id: "http-sse-server",
    name: "HTTP SSE Server",
    type: "HTTP_SSE",
    version: "1.0.2",
    description: "A simple HTTP server that streams server-sent events.",
    downloads: 3200,
    isOfficial: true,
    icon: "🔥",
    url: "https://example.com/sse",
    categories: ["http", "sse", "streaming"],
    views: 1234,
    installations: 567,
    author: "Acme Corp",
    tools: [
      {
        id: "sse-inspector",
        name: "SSE Inspector",
        description: "Inspect server-sent events in real-time.",
        parameters: [
          { name: "url", type: "string", description: "SSE endpoint URL" },
          { name: "autoReconnect", type: "boolean", description: "Automatically reconnect on disconnect" },
        ],
      },
      {
        id: "message-generator",
        name: "Message Generator",
        description: "Generate and send custom SSE messages.",
        parameters: [
          { name: "message", type: "string", description: "Message content" },
          { name: "eventType", type: "string", description: "Event type" },
        ],
      },
    ],
  },
  {
    id: "stdio-server",
    name: "STDIO Server",
    type: "STDIO",
    version: "0.5.0",
    description: "A server that communicates via standard input/output.",
    downloads: 1500,
    isOfficial: false,
    icon: "⚙️",
    commandArgs: "start --port 8080",
    categories: ["stdio", "cli"],
    views: 5678,
    installations: 910,
    author: "Indie Dev",
    tools: [
      {
        id: "command-executor",
        name: "Command Executor",
        description: "Execute commands on the server's command line.",
        parameters: [
          { name: "command", type: "string", description: "Command to execute" },
        ],
      },
      {
        id: "log-viewer",
        name: "Log Viewer",
        description: "View the server's output logs.",
        parameters: [],
      },
    ],
  },
  {
    id: "grpc-server",
    name: "gRPC Server",
    type: "GRPC",
    version: "1.2.0",
    description: "A high-performance gRPC server.",
    downloads: 800,
    isOfficial: true,
    icon: "⚡",
    categories: ["grpc", "rpc"],
    views: 9012,
    installations: 345,
    author: "Cloud Services Inc.",
    tools: [
      {
        id: "grpc-tester",
        name: "gRPC Tester",
        description: "Test gRPC endpoints and services.",
        parameters: [
          { name: "service", type: "string", description: "gRPC service name" },
          { name: "method", type: "string", description: "Method to call" },
        ],
      },
    ],
  },
  {
    id: "websocket-server",
    name: "WebSocket Server",
    type: "WEBSOCKET",
    version: "2.1.0",
    description: "A real-time WebSocket server.",
    downloads: 2000,
    isOfficial: false,
    icon: "💬",
    categories: ["websocket", "realtime"],
    views: 2345,
    installations: 678,
    author: "WebSockets R Us",
    tools: [
      {
        id: "ws-client",
        name: "WebSocket Client",
        description: "Connect to the WebSocket server and send/receive messages.",
        parameters: [
          { name: "message", type: "string", description: "Message to send" },
        ],
      },
    ],
  },
  {
    id: "mqtt-broker",
    name: "MQTT Broker",
    type: "MQTT",
    version: "3.0.0",
    description: "An MQTT message broker for IoT devices.",
    downloads: 1200,
    isOfficial: true,
    icon: "🌐",
    categories: ["mqtt", "iot"],
    views: 3456,
    installations: 789,
    author: "IoT Solutions Ltd.",
    tools: [
      {
        id: "mqtt-publisher",
        name: "MQTT Publisher",
        description: "Publish messages to MQTT topics.",
        parameters: [
          { name: "topic", type: "string", description: "MQTT topic" },
          { name: "message", type: "string", description: "Message to publish" },
        ],
      },
      {
        id: "mqtt-subscriber",
        name: "MQTT Subscriber",
        description: "Subscribe to MQTT topics and view messages.",
        parameters: [
          { name: "topic", type: "string", description: "MQTT topic" },
        ],
      },
    ],
  },
  {
    id: "amqp-broker",
    name: "AMQP Broker",
    type: "AMQP",
    version: "1.5.0",
    description: "An AMQP message broker for enterprise messaging.",
    downloads: 900,
    isOfficial: false,
    icon: "🔗",
    categories: ["amqp", "messaging"],
    views: 4567,
    installations: 890,
    author: "Enterprise Messaging Co.",
    tools: [
      {
        id: "amqp-publisher",
        name: "AMQP Publisher",
        description: "Publish messages to AMQP exchanges.",
        parameters: [
          { name: "exchange", type: "string", description: "AMQP exchange" },
          { name: "message", type: "string", description: "Message to publish" },
        ],
      },
      {
        id: "amqp-subscriber",
        name: "AMQP Subscriber",
        description: "Subscribe to AMQP queues and view messages.",
        parameters: [
          { name: "queue", type: "string", description: "AMQP queue" },
        ],
      },
    ],
  },
  {
    id: "database-server",
    name: "Database Server",
    type: "DATABASE",
    version: "4.2.0",
    description: "A robust database server for data storage.",
    downloads: 2500,
    isOfficial: true,
    icon: "🗄️",
    categories: ["database", "storage"],
    views: 5678,
    installations: 901,
    author: "Data Solutions Inc.",
    tools: [
      {
        id: "query-executor",
        name: "Query Executor",
        description: "Execute SQL queries on the database.",
        parameters: [
          { name: "query", type: "string", description: "SQL query to execute" },
        ],
      },
      {
        id: "data-browser",
        name: "Data Browser",
        description: "Browse and inspect data in the database.",
        parameters: [],
      },
    ],
  },
  {
    id: "cache-server",
    name: "Cache Server",
    type: "CACHE",
    version: "2.8.0",
    description: "A high-speed cache server for data caching.",
    downloads: 1800,
    isOfficial: false,
    icon: "📦",
    categories: ["cache", "performance"],
    views: 6789,
    installations: 123,
    author: "Cache Technologies Ltd.",
    tools: [
      {
        id: "cache-viewer",
        name: "Cache Viewer",
        description: "View and manage cached data.",
        parameters: [],
      },
      {
        id: "cache-invalidator",
        name: "Cache Invalidator",
        description: "Invalidate specific cache entries.",
        parameters: [
          { name: "key", type: "string", description: "Cache key to invalidate" },
        ],
      },
    ],
  },
  {
    id: "message-queue",
    name: "Message Queue",
    type: "QUEUE",
    version: "1.1.0",
    description: "A reliable message queue for asynchronous communication.",
    downloads: 1100,
    isOfficial: true,
    icon: "✉️",
    categories: ["queue", "messaging"],
    views: 7890,
    installations: 456,
    author: "Queue Systems Inc.",
    tools: [
      {
        id: "message-producer",
        name: "Message Producer",
        description: "Produce and send messages to the queue.",
        parameters: [
          { name: "message", type: "string", description: "Message to send" },
        ],
      },
      {
        id: "message-consumer",
        name: "Message Consumer",
        description: "Consume and process messages from the queue.",
        parameters: [],
      },
    ],
  },
  {
    id: "load-balancer",
    name: "Load Balancer",
    type: "LOAD_BALANCER",
    version: "5.0.0",
    description: "A smart load balancer for distributing traffic.",
    downloads: 2200,
    isOfficial: false,
    icon: "⚖️",
    categories: ["load balancing", "networking"],
    views: 8901,
    installations: 789,
    author: "Balancing Solutions Ltd.",
    tools: [
      {
        id: "traffic-monitor",
        name: "Traffic Monitor",
        description: "Monitor traffic distribution and server health.",
        parameters: [],
      },
      {
        id: "rule-manager",
        name: "Rule Manager",
        description: "Manage load balancing rules and policies.",
        parameters: [
          { name: "rule", type: "string", description: "Load balancing rule" },
        ],
      },
    ],
  },
  {
    id: "api-gateway",
    name: "API Gateway",
    type: "API_GATEWAY",
    version: "2.5.0",
    description: "A secure API gateway for managing API traffic.",
    downloads: 1600,
    isOfficial: true,
    icon: "🚪",
    categories: ["api", "gateway"],
    views: 9012,
    installations: 123,
    author: "Gateway Technologies Inc.",
    tools: [
      {
        id: "request-logger",
        name: "Request Logger",
        description: "Log API requests and responses.",
        parameters: [],
      },
      {
        id: "policy-enforcer",
        name: "Policy Enforcer",
        description: "Enforce API security policies.",
        parameters: [
          { name: "policy", type: "string", description: "Security policy" },
        ],
      },
    ],
  },
  {
    id: "reverse-proxy",
    name: "Reverse Proxy",
    type: "REVERSE_PROXY",
    version: "3.1.0",
    description: "A high-performance reverse proxy server.",
    downloads: 1300,
    isOfficial: false,
    icon: "🔄",
    categories: ["proxy", "networking"],
    views: 1234,
    installations: 456,
    author: "Proxy Solutions Ltd.",
    tools: [
      {
        id: "traffic-analyzer",
        name: "Traffic Analyzer",
        description: "Analyze traffic patterns and performance.",
        parameters: [],
      },
      {
        id: "cache-manager",
        name: "Cache Manager",
        description: "Manage cached content and settings.",
        parameters: [],
      },
    ],
  },
];

const categories = [
  "All",
  "http",
  "sse",
  "streaming",
  "stdio",
  "cli",
  "grpc",
  "rpc",
  "websocket",
  "realtime",
  "mqtt",
  "iot",
  "amqp",
  "messaging",
  "database",
  "storage",
  "cache",
  "performance",
  "queue",
  "load balancing",
  "networking",
  "api",
  "gateway",
  "proxy",
];

const sortOptions = [
  { label: "Most Popular", value: "popularity" },
  { label: "Most Recent", value: "recent" },
  { label: "Name (A-Z)", value: "name_asc" },
  { label: "Name (Z-A)", value: "name_desc" },
];

const Discovery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<EnhancedServerDefinition | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [addInstanceOpen, setAddInstanceOpen] = useState(false);
  const { profiles } = useHostProfiles();
  const { toast } = useToast();

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
  };

  const handleServerClick = (server: EnhancedServerDefinition) => {
    setSelectedServer(server);
    setIsDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredServers = useMemo(() => {
    let filtered = [...serverDefinitions];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((server) => server.categories?.includes(selectedCategory));
    }

    if (searchQuery) {
      const lowerSearchQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((server) => server.name.toLowerCase().includes(lowerSearchQuery) || server.description?.toLowerCase().includes(lowerSearchQuery));
    }

    return filtered;
  }, [serverDefinitions, selectedCategory, searchQuery]);

  const sortedServers = useMemo(() => {
    let sorted = [...filteredServers];

    if (sortBy === "popularity") {
      sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === "recent") {
      sorted.sort((a, b) => (b.installations || 0) - (a.installations || 0));
    } else if (sortBy === "name_asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name_desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }

    return sorted;
  }, [filteredServers, sortBy]);

  const paginatedServers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedServers.slice(startIndex, endIndex);
  }, [sortedServers, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedServers.length / ITEMS_PER_PAGE);
  }, [sortedServers]);

  return <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discover Servers</h1>
          <p className="text-muted-foreground">
            Explore and add new server definitions to your host
          </p>
        </div>
        <Button onClick={() => {
          toast({
            title: "Coming Soon!",
            description: "This feature is under development.",
          });
        }}>
          <GitMerge className="mr-2 h-4 w-4" />
          Contribute
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search servers..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginatedServers.map((server) => (
            <Card key={server.id} className="cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={() => handleServerClick(server)}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {server.icon && <span className="text-2xl">{server.icon}</span>}
                    <span>{server.name}</span>
                  </div>
                  <OfficialBadge isOfficial={server.isOfficial} />
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                  {server.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <EndpointLabel type={server.type} />
                  {server.author && <Badge variant="outline">By {server.author}</Badge>}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Info className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {server.views || 0} views | {server.installations || 0} installations
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white dark:bg-gray-900">
          {selectedServer && <div className="h-full flex flex-col">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <ServerLogo name={selectedServer.name} className="w-14 h-14 bg-white/10 border-white/20" />
                    <div className="space-y-1">
                      <DialogTitle className="text-xl font-bold leading-tight text-white">
                        {selectedServer.name}
                      </DialogTitle>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <EndpointLabel type={selectedServer.type} />
                        {selectedServer.isOfficial && <OfficialBadge />}
                      </div>
                    </div>
                  </div>
                  
                  <DialogClose className="rounded-full p-1.5 hover:bg-white/20 transition-colors">
                    <X className="h-5 w-5" />
                  </DialogClose>
                </div>
              </div>
              
              <div className="h-[500px] overflow-auto">
                <Tabs defaultValue="details" className="flex h-full flex-col">
                  <TabsList className="bg-muted p-2">
                    <TabsTrigger value="details" className="data-[state=active]:text-foreground">
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="tools" className="data-[state=active]:text-foreground">
                      Tools
                    </TabsTrigger>
                    <TabsTrigger value="install" className="data-[state=active]:text-foreground">
                      Install
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="space-y-2 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedServer.description}
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Server Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Categories:</span>
                            <div className="flex gap-1">
                              {selectedServer.categories?.map((category) => (
                                <Badge key={category} variant="secondary">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Download className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Downloads:</span>
                            <span>{selectedServer.downloads}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileCode className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Version:</span>
                            <span>{selectedServer.version}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Additional Links</CardTitle>
                        <CardDescription>Useful resources and documentation</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="link" className="gap-1">
                          <ExternalLink className="h-4 w-4" />
                          Visit Homepage
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="tools" className="space-y-2 p-4">
                    <ServerToolsList tools={selectedServer.tools} debugMode={false} serverName={selectedServer.name} />
                  </TabsContent>
                  <TabsContent value="install" className="flex flex-col gap-4 p-4">
                    <p>Configure and create a new instance of this server.</p>
                    <AddInstanceDialog open={addInstanceOpen} onOpenChange={setAddInstanceOpen} serverDefinition={selectedServer} />
                    <Button onClick={() => setAddInstanceOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Instance
                    </Button>
                    {profiles && profiles.length > 0 ? <div className="border rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">
                            Import from Profile
                          </h3>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Import
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Import settings from an existing profile.
                        </p>
                      </div> : <Card className="p-8 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-medium">No Profiles Found</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Create a profile to import settings.
                        </p>
                      </Card>}
                  </TabsContent>
                </Tabs>
              </div>
              
              <DialogFooter className="p-4">
                <Button variant="outline" asChild>
                  <DialogClose>Close</DialogClose>
                </Button>
              </DialogFooter>
            </div>}
        </DialogContent>
      </Dialog>
      
      <AddInstanceDialog open={addInstanceOpen} onOpenChange={setAddInstanceOpen} serverDefinition={selectedServer} />
    </div>;
};

export default Discovery;
