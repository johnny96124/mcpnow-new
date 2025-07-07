import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Cloud, 
  Shield, 
  CheckCircle,
  Star,
  Search,
  Filter,
  ArrowRight,
  Zap,
  Lock,
  Clock,
  Users,
  Globe,
  Download
} from "lucide-react";
import { ServerDefinition, serverDefinitions } from "@/data/mockData";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { EndpointLabel } from "@/components/status/EndpointLabel";

export default function FeaturedServers() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'hosted'; // 'hosted' or 'verified'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const isHosted = type === 'hosted';
  const servers = serverDefinitions.filter(server => 
    isHosted ? server.downloads && server.downloads > 3000 : server.isOfficial
  );

  const filteredServers = servers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         server.description.toLowerCase().includes(searchQuery.toLowerCase());
    const serverCategory = server.categories?.[0] || 'Other';
    const matchesCategory = selectedCategory === "all" || serverCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(servers.map(s => s.categories?.[0] || 'Other')));

  const benefits = isHosted ? [
    {
      icon: <Zap className="h-5 w-5" />,
      title: "即开即用",
      description: "无需本地安装配置，一键启动使用"
    },
    {
      icon: <Cloud className="h-5 w-5" />,
      title: "稳定可靠",
      description: "专业云端基础设施，99.9%可用性保证"
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "安全保障",
      description: "企业级安全防护，数据传输加密保护"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "自动更新",
      description: "自动获取最新版本，无需手动维护升级"
    }
  ] : [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "官方认证",
      description: "由MCP团队严格审核，质量标准保证"
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "经过测试",
      description: "完整的功能测试和兼容性验证"
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "最佳实践",
      description: "遵循官方开发规范和安全标准"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "社区支持",
      description: "活跃的社区和官方技术支持"
    }
  ];

  const stats = {
    totalServers: servers.length,
    totalUsers: servers.reduce((sum, server) => sum + (server.downloads || 0), 0),
    avgRating: 4.8,
    categories: categories.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/discovery')}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回发现页
          </Button>
          
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-12">
            <div className="flex justify-center">
              <div className="relative">
                <div className={`absolute inset-0 ${isHosted ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-green-500 to-green-600'} rounded-3xl blur-xl opacity-50`}></div>
                <div className={`relative p-6 ${isHosted ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-green-500 to-green-600'} rounded-3xl shadow-2xl`}>
                  {isHosted ? <Cloud className="h-16 w-16 text-white" /> : <Shield className="h-16 w-16 text-white" />}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className={`text-4xl md:text-5xl font-bold ${isHosted ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-green-600 to-green-700'} bg-clip-text text-transparent`}>
                {isHosted ? '云端托管服务器' : '官方认证服务器'}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {isHosted ? '专业云端基础设施托管，让您专注于业务发展' : '经过官方严格审核认证，确保最佳使用体验'}
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className={`inline-flex p-3 rounded-xl ${isHosted ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Stats Section */}
        <section className="mb-8">
          <Card className={`${isHosted ? 'bg-gradient-to-r from-blue-50 to-blue-100' : 'bg-gradient-to-r from-green-50 to-green-100'} border-0`}>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold">{stats.totalServers}</div>
                  <div className="text-sm text-muted-foreground">可用服务器</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{(stats.totalUsers / 1000).toFixed(1)}K+</div>
                  <div className="text-sm text-muted-foreground">总下载量</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.avgRating}</div>
                  <div className="text-sm text-muted-foreground">平均评分</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.categories}</div>
                  <div className="text-sm text-muted-foreground">分类数量</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Search and Filter */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索服务器..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
              >
                全部
              </Button>
              {categories.map((category: string) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Servers Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServers.map((server) => (
              <Card key={server.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <ServerLogo name={server.name} className="w-10 h-10" />
                      <div>
                        <CardTitle className="text-lg">{server.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <EndpointLabel type={server.type} />
                          {isHosted && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              托管
                            </Badge>
                          )}
                          {!isHosted && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              认证
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>4.8</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {server.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      <span>{(server.downloads || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      <span>{server.categories?.[0] || 'Other'}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full group-hover:scale-105 transition-transform">
                    添加到配置文件
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <Card className={`max-w-2xl mx-auto ${isHosted ? 'bg-gradient-to-r from-blue-50 to-blue-100' : 'bg-gradient-to-r from-green-50 to-green-100'} border-0`}>
            <CardContent className="p-8 space-y-6">
              <h3 className="text-2xl font-bold">
                {isHosted ? '开始使用云端托管服务' : '探索更多官方认证服务器'}
              </h3>
              <p className="text-muted-foreground">
                {isHosted ? 
                  '无需复杂配置，立即体验专业级MCP服务器托管服务' : 
                  '发现更多经过官方认证的高质量MCP服务器，提升您的工作效率'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  <Cloud className="h-5 w-5" />
                  {isHosted ? '立即体验' : '查看更多'}
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Users className="h-5 w-5" />
                  联系技术支持
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}