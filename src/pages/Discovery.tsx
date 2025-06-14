import { useEffect, useRef, useState } from "react";
import { 
  Calendar, Check, CheckCircle, ChevronLeft, Clock, Copy, 
  Database, Download, Eye, ExternalLink, FolderOpen, Globe, 
  History, Info, Link2, Loader2, HardDrive, Search, Share, 
  Star, Tag, Terminal, Upload, UserRound, Users, Watch, Wrench, X, Plus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { discoveryItems, ServerDefinition, Profile, Host } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { CategoryList } from "@/components/discovery/CategoryList";
import { OfficialBadge } from "@/components/discovery/OfficialBadge";
import { EmptyState } from "@/components/discovery/EmptyState";
import { LoadingIndicator } from "@/components/discovery/LoadingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddInstanceDialog, InstanceFormValues } from "@/components/servers/AddInstanceDialog";
import { AddToProfileDialog } from "@/components/discovery/AddToProfileDialog";
import { useHostProfiles } from "@/hooks/useHostProfiles";
import { ServerToolsList } from "@/components/discovery/ServerToolsList";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ShareServerDialog } from "@/components/discovery/ShareServerDialog";
import { VersionHistoryDialog } from "@/components/discovery/VersionHistoryDialog";
import { ServerRequirementsSection } from "@/components/discovery/ServerRequirementsSection";

const ITEMS_PER_PAGE = 12;
interface EnhancedServerDefinition extends ServerDefinition {
  views?: number;
  forks?: number;
  watches?: number;
  updated?: string;
  trending?: boolean;
  author?: string;
  requirements?: {
    type: 'llm' | 'tool' | 'memory';
    value: string;
  }[];
}
const extendedItems: EnhancedServerDefinition[] = [...discoveryItems.map(item => ({
  ...item,
  views: Math.floor(Math.random() * 50000) + 1000,
  updated: "2025-03-15",
  author: item.author || "API Team"
})), ...discoveryItems.map((item, index) => ({
  ...item,
  id: `trending-${item.id}-${index}`,
  name: `${item.name} API`,
  views: Math.floor(Math.random() * 1000000) + 50000,
  updated: "2025-04-03",
  isOfficial: true,
  trending: true,
  forks: Math.floor(Math.random() * 100) + 30,
  watches: Math.floor(Math.random() * 1000) + 200,
  author: item.author || "API Team",
  downloads: Math.floor(Math.random() * 5000) + 500
})), ...discoveryItems.map((item, index) => ({
  ...item,
  id: `community-${item.id}-${index}`,
  name: `${item.name} Community`,
  isOfficial: false,
  views: Math.floor(Math.random() * 50000) + 1000,
  updated: "2025-02-15",
  author: "Community Contributor",
  categories: [...(item.categories || []), "Community"],
  downloads: Math.floor(Math.random() * 2000) + 100,
  watches: Math.floor(Math.random() * 500) + 50
}))];
const mockCategories = ["API Testing", "Developer Tools", "Database", "DevOps", "Monitoring", "Cloud", "Security", "Analytics", "Productivity", "Automation"];
const Discovery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedServer, setSelectedServer] = useState<EnhancedServerDefinition | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [installedServers, setInstalledServers] = useState<Record<string, boolean>>({});
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>(mockCategories);
  const [sortOption, setSortOption] = useState("popular");
  const [installedButtonHover, setInstalledButtonHover] = useState<Record<string, boolean>>({});
  const [addInstanceOpen, setAddInstanceOpen] = useState(false);
  const [selectedDefinition, setSelectedDefinition] = useState<ServerDefinition | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState("overview");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  
  // Mock version history data
  const versionHistory = [
    {
      version: "0.9.5", 
      releaseDate: new Date(2025, 3, 3), // April 3, 2025
      author: "API Team",
      changes: [
        "Added Kubernetes 1.28 support",
        "Improved cluster monitoring with real-time metrics",
        "Fixed pod visualization in dark mode"
      ]
    },
    {
      version: "0.9.0", 
      releaseDate: new Date(2025, 2, 15), // March 15, 2025
      author: "API Team",
      changes: [
        "Launched deployment automation features",
        "Added support for custom namespaces",
        "Fixed several stability issues with long-running operations"
      ]
    },
    {
      version: "0.8.5", 
      releaseDate: new Date(2025, 1, 20), // February 20, 2025
      author: "API Team",
      changes: [
        "Beta release of resource monitoring dashboard",
        "Initial implementation of pod visualization",
        "Added basic cluster management functionality"
      ]
    }
  ];
  
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const {
    allProfiles,
    addInstanceToProfile,
    getProfileById,
    getAvailableHosts
  } = useHostProfiles();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setVisibleItems(ITEMS_PER_PAGE);
  }, [searchQuery, selectedCategory, activeTab]);
  const getFilteredServers = () => {
    let filtered = extendedItems.filter(server => (searchQuery === "" || server.name.toLowerCase().includes(searchQuery.toLowerCase()) || server.description.toLowerCase().includes(searchQuery.toLowerCase()) || server.author && server.author.toLowerCase().includes(searchQuery.toLowerCase())) && (selectedCategory === null || server.categories?.includes(selectedCategory)));
    if (activeTab === "official") {
      filtered = filtered.filter(server => server.isOfficial);
    } else if (activeTab === "community") {
      filtered = filtered.filter(server => !server.isOfficial);
    }
    if (sortOption === "popular") {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortOption === "recent") {
      filtered.sort((a, b) => {
        const dateA = a.updated ? new Date(a.updated).getTime() : 0;
        const dateB = b.updated ? new Date(b.updated).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sortOption === "installed") {
      filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    } else if (sortOption === "stars") {
      filtered.sort((a, b) => (b.watches || 0) - (a.watches || 0));
    }
    return filtered;
  };
  const getCardStatIcon = (server: EnhancedServerDefinition) => {
    if (sortOption === "popular") {
      return <div className="flex items-center text-xs text-muted-foreground">
          <Eye className="h-3.5 w-3.5 mr-1" />
          {formatNumber(server.views || 0)}
        </div>;
    } else if (sortOption === "installed") {
      return <div className="flex items-center text-xs text-muted-foreground">
          <Download className="h-3.5 w-3.5 mr-1" />
          {formatNumber(server.downloads || 0)}
        </div>;
    } else if (sortOption === "stars") {
      return <div className="flex items-center text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 mr-1" />
          {formatNumber(server.watches || 0)}
        </div>;
    }
    return <div className="flex items-center text-xs text-muted-foreground">
        <Eye className="h-3.5 w-3.5 mr-1" />
        {formatNumber(server.views || 0)}
      </div>;
  };
  const filteredServers = getFilteredServers();
  const visibleServers = filteredServers.slice(0, visibleItems);
  const hasMore = visibleServers.length < filteredServers.length;
  const isSearching = searchQuery.trim().length > 0;
  const availableHosts = getAvailableHosts();
  useEffect(() => {
    observerRef.current = new IntersectionObserver(entries => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        loadMoreItems();
      }
    }, {
      rootMargin: "200px"
    });
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [visibleItems, filteredServers.length, isLoading]);
  const loadMoreItems = () => {
    if (!hasMore) return;
    setIsLoading(true);
    setTimeout(() => {
      setVisibleItems(prev => prev + ITEMS_PER_PAGE);
      setIsLoading(false);
    }, 800);
  };
  const handleViewDetails = (server: EnhancedServerDefinition) => {
    setSelectedServer(server);
    setIsDialogOpen(true);
    setActiveDetailTab("overview"); // Reset to overview tab when opening dialog
  };
  const handleAddServer = (serverId: string) => {
    const server = extendedItems.find(item => item.id === serverId);
    if (!server) return;
    setSelectedDefinition(server);
    setAddInstanceOpen(true);
  };
  const handleCreateInstance = (data: InstanceFormValues, selectedHosts: string[] = []) => {
    if (!selectedDefinition) return;
    setInstalledServers(prev => ({
      ...prev,
      [selectedDefinition.id]: true
    }));
    if (selectedHosts && selectedHosts.length > 0) {
      toast({
        title: "Server added",
        description: `${data.name} has been added to ${selectedHosts.length} host(s).`
      });
    } else {
      toast({
        title: "Server configured",
        description: `${data.name} has been configured successfully.`
      });
    }
    setAddInstanceOpen(false);
  };
  const handleAddToProfile = (profileId: string) => {
    if (!selectedDefinition) return;
    const profile = addInstanceToProfile(profileId, selectedDefinition.id);
    toast({
      title: "Instance Added",
      description: `Added to profile ${profile?.name}.`
    });
  };
  const handleNavigateToServers = () => {
    navigate("/servers");
  };
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };
  const handleInstallVersion = (version: string) => {
    // 这里可以实现版本安装逻辑
    setShowVersionHistory(false);
    
    if (selectedServer) {
      setAddInstanceOpen(true);
      
      toast({
        title: "Version selected",
        description: `Preparing to install version ${version} of ${selectedServer.name}`,
      });
    }
  };
  return <div className="animate-fade-in">
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <h1 className="text-3xl font-bold mb-2">Discovery</h1>
          <p className="text-blue-100 mb-6">Explore powerful MCP Servers from a centralized hub. Browse our curated collection of servers that can enhance your productivity, streamline your workflow, and meet all your development needs.</p>
          
          {/* My Servers button removed */}
        </div>
        
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-10">
          <div className="w-64 h-64 rounded-full border-4 border-white absolute -right-16 -top-16"></div>
          <div className="w-32 h-32 rounded-full border-4 border-white absolute right-24 top-8"></div>
          <div className="w-48 h-48 rounded-full border-4 border-white absolute -right-8 top-16"></div>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-[280px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search servers, APIs, collections..." className="pl-10 bg-background border-input" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-blue-600" />
                    Most Popular
                  </div>
                </SelectItem>
                <SelectItem value="installed">
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-2 text-green-600" />
                    Most Installed
                  </div>
                </SelectItem>
                <SelectItem value="stars">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-amber-500" />
                    Most Stars
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {!isSearching && <>
            <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center border-b pb-1">
                <TabsList className="bg-transparent p-0 h-9">
                  <TabsTrigger value="all" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-3">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="official" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-3">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Official
                  </TabsTrigger>
                  <TabsTrigger value="community" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-3">
                    <Users className="h-4 w-4 mr-1" />
                    Community
                  </TabsTrigger>
                </TabsList>
                
                {selectedCategory && <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setSelectedCategory(null)}>
                    <X className="h-3.5 w-3.5 mr-1" />
                    Clear filters
                  </Button>}
              </div>
            </Tabs>
            
            <div className="flex flex-wrap gap-2">
              {allCategories.map(category => <Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" className={`
                    rounded-full text-xs px-3 h-7
                    ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-transparent'}
                  `} onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}>
                  <Tag className="h-3 w-3 mr-1" />
                  {category}
                </Button>)}
            </div>
          </>}
      </div>
      
      <ScrollArea className="h-[calc(100vh-380px)]">
        {filteredServers.length > 0 ? <>
            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
              {visibleServers.map(server => <Card key={server.id} className="flex flex-col overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-800 cursor-pointer group relative" onClick={() => handleViewDetails(server)}>
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  
                  <CardHeader className="pb-2 space-y-0 px-5 pt-5">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <ServerLogo name={server.name} className="w-12 h-12" />
                          {installedServers[server.id] && <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="absolute -top-1 -right-1 bg-blue-100 border border-blue-200 rounded-full p-0.5 shadow-sm">
                                    <CheckCircle className="h-4 w-4 text-blue-600" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Server already added</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>}
                        </div>
                        <div className="flex flex-col">
                          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                            {server.name}
                          </CardTitle>
                          <div className="flex items-center gap-1.5 mt-1">
                            <EndpointLabel type={server.type} />
                            {server.isOfficial && <OfficialBadge />}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        {getCardStatIcon(server)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-5 py-2 flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {server.description}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="px-5 py-4 border-t flex flex-col gap-2 bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-start justify-between w-full">
                      <div className="flex flex-col text-xs text-muted-foreground w-3/5">
                        <div className="grid grid-cols-1 gap-1">
                          {server.author && <div className="flex items-center">
                              <UserRound className="h-3.5 w-3.5 mr-1.5 text-blue-600 flex-shrink-0" />
                              <span className="font-medium">
                                {server.author}
                              </span>
                            </div>}
                          
                          {server.updated && <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1.5 text-gray-400 flex-shrink-0" />
                              <span>Updated {getTimeAgo(server.updated)}</span>
                            </div>}
                        </div>
                      </div>
                      
                      <Button size="sm" onClick={e => {
                  e.stopPropagation();
                  handleAddServer(server.id);
                }} className="bg-blue-600 hover:bg-blue-700 h-8 relative z-10">
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardFooter>
                </Card>)}
            </div>
            
            {hasMore && <div ref={loadMoreRef} className="py-6 flex justify-center">
                {isLoading ? <LoadingIndicator /> : <Button variant="outline" onClick={loadMoreItems} className="min-w-[200px]">
                    Load More
                  </Button>}
              </div>}
          </> : <EmptyState searchQuery={searchQuery} onReset={() => {
        setSearchQuery("");
        setSelectedCategory(null);
      }} />}
      </ScrollArea>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl overflow-hidden">
          {selectedServer && <div className="h-full flex flex-col">
              <DialogHeader className="border-b pb-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <ServerLogo name={selectedServer.name} className="w-12 h-12" />
                      {installedServers[selectedServer.id] && <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="absolute -top-1 -right-1 bg-blue-100 border border-blue-200 rounded-full p-0.5 shadow-sm">
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Server already added</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>}
                    </div>
                    <div className="flex items-center justify-between flex-1">
                      <div>
                        <DialogTitle className="text-xl font-semibold">
                          {selectedServer.name}
                        </DialogTitle>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <EndpointLabel type={selectedServer.type} />
                          {selectedServer.isOfficial && <OfficialBadge />}
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" onClick={e => {
                    e.stopPropagation();
                    setShareDialogOpen(true);
                  }} className="h-8 mx-[20px]">
                        <Share className="h-4 w-4 mr-1.5" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="h-[500px] overflow-auto">
                <div className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                          Description
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedServer.description}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                          Author
                        </h3>
                        <div className="flex items-center">
                          <UserRound className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {selectedServer.author || `${selectedServer.name.split(' ')[0]} Team`}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                          Features
                        </h3>
                        <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600 dark:text-gray-300 pl-1">
                          {selectedServer.features?.map((feature, index) => <li key={index}>{feature}</li>)}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                          Categories
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedServer.categories?.map(category => <Badge key={category} variant="outline" className="bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300 text-xs px-3 py-0.5 rounded-full">
                              <Tag className="h-3 w-3 mr-1.5" />
                              {category}
                            </Badge>)}
                        </div>
                      </div>

                      {/* 添加需求部分 */}
                      {selectedServer.requirements && selectedServer.requirements.length > 0 && (
                        <div>
                          <ServerRequirementsSection requirements={selectedServer.requirements} />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-md p-5 space-y-4">
                        <div>
                          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Version</h3>
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mr-2">
                              {selectedServer.version || (Math.random() > 0.5 ? '1.5.0' : '0.9.5')}
                            </p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-600 px-1.5 h-6 gap-1"
                              onClick={() => setShowVersionHistory(true)}
                            >
                              <History className="h-3.5 w-3.5" />
                              Version history
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Last Updated</h3>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-800 dark:text-gray-200">
                              {selectedServer.updated ? new Date(selectedServer.updated).toLocaleDateString() : 'April 3, 2025'}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Repository</h3>
                          <a href="#" className="text-sm text-blue-600 flex items-center hover:underline" target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4 mr-2" />
                            <span className="truncate">
                              {selectedServer.repository || `github.com/${selectedServer.name.toLowerCase().replace(/\s+/g, '-')}`}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                          </a>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-md p-5">
                        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">Usage Statistics</h3>
                        
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-white dark:bg-gray-900 rounded-md p-3">
                            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                              {formatNumber(selectedServer.views || 1320)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Views</div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-900 rounded-md p-3">
                            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                              {formatNumber(selectedServer.downloads || 240)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Downloads</div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-900 rounded-md p-3">
                            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                              {formatNumber(selectedServer.watches || 58)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Stars</div>
                          </div>
                        </div>
                      </div>
                      
                      {!installedServers[selectedServer.id] ? <Button className="w-full bg-blue-600 hover:bg-blue-700 py-5" onClick={() => handleAddServer(selectedServer.id)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Server
                        </Button> : <Button variant="outline" className="w-full border-green-200 bg-green-50 text-green-600 hover:bg-green-100 py-5" onClick={handleNavigateToServers}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Server Added
                        </Button>}
                    </div>
                  </div>
                </div>
              </div>
            </div>}
        </DialogContent>
      </Dialog>
      
      <AddInstanceDialog open={addInstanceOpen} onOpenChange={setAddInstanceOpen} serverDefinition={selectedDefinition} onCreateInstance={handleCreateInstance} availableHosts={availableHosts} />
      
      {selectedServer && (
        <>
          <ShareServerDialog 
            open={shareDialogOpen} 
            onOpenChange={setShareDialogOpen} 
            server={selectedServer} 
            serverDefinition={selectedServer} 
          />
          
          <VersionHistoryDialog
            open={showVersionHistory}
            onOpenChange={setShowVersionHistory}
            serverName={selectedServer.name}
            versions={versionHistory}
            onInstallVersion={handleInstallVersion}
          />
        </>
      )}
    </div>;
};
export default Discovery;
