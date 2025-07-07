import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar, 
  Share2, 
  BookOpen, 
  Play,
  CheckCircle,
  Settings,
  ExternalLink
} from "lucide-react";
import { ServerLogo } from "@/components/servers/ServerLogo";

interface TutorialData {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  author: {
    name: string;
    avatar: string;
    title: string;
  };
  updatedAt: string;
  servers: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  content: {
    overview: string;
    videoUrl?: string;
    steps: Array<{
      id: string;
      title: string;
      content: string;
      code?: string;
    }>;
  };
}

const mockTutorial: TutorialData = {
  id: "mcp-quickstart",
  title: "MCP Server 快速入门指南",
  description: "从零开始学习如何安装、配置和使用MCP Server，包含实际案例演示",
  duration: "15分钟",
  difficulty: "Beginner",
  author: {
    name: "张明",
    avatar: "",
    title: "高级开发工程师"
  },
  updatedAt: "2024-01-15",
  servers: [
    { id: "1", name: "File Operations", description: "文件操作服务器" },
    { id: "2", name: "Web Search", description: "网络搜索服务器" },
    { id: "3", name: "Database Query", description: "数据库查询服务器" }
  ],
  content: {
    overview: "本教程将带你从零开始学习MCP Server的使用。MCP (Model Context Protocol) Server是一个强大的工具，可以让AI助手访问各种外部资源和服务。通过本教程，你将学会如何安装、配置和使用MCP Server，以及如何将其集成到你的工作流程中。",
    videoUrl: "https://example.com/tutorial-video",
    steps: [
      {
        id: "step-1",
        title: "安装准备工作",
        content: "在开始安装MCP Server之前，我们需要确保系统满足所有必要的条件。首先检查你的Node.js版本是否为18.0或更高版本。",
        code: "node --version\nnpm --version"
      },
      {
        id: "step-2", 
        title: "下载和安装",
        content: "使用npm包管理器来安装MCP Server。这个过程通常需要几分钟时间，取决于你的网络连接速度。",
        code: "npm install -g @modelcontextprotocol/server-cli"
      },
      {
        id: "step-3",
        title: "基础配置",
        content: "安装完成后，我们需要进行基础配置。创建一个配置文件来定义你的MCP Server设置。",
        code: "mcp-server init\nmcp-server config --host localhost --port 3000"
      },
      {
        id: "step-4",
        title: "启动服务",
        content: "现在你可以启动MCP Server了。启动后，服务器将在指定端口运行，准备接收连接。",
        code: "mcp-server start"
      },
      {
        id: "step-5",
        title: "验证安装",
        content: "最后一步是验证安装是否成功。你可以通过访问健康检查端点来确认服务器正在正常运行。",
        code: "curl http://localhost:3000/health"
      }
    ]
  }
};

export default function TutorialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [tutorial] = useState<TutorialData>(mockTutorial);

  const sections = [
    { id: "overview", title: "概述", icon: BookOpen },
    { id: "video", title: "视频教程", icon: Play },
    { id: "steps", title: "操作步骤", icon: CheckCircle },
    { id: "servers", title: "相关服务器", icon: Settings }
  ];

  const handleShare = (platform: 'x' | 'facebook' | 'reddit') => {
    const url = window.location.href;
    const text = `查看这个MCP Server教程：${tutorial.title}`;
    
    let shareUrl = '';
    switch (platform) {
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'reddit':
        shareUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/discovery')}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回发现页
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{tutorial.title}</h1>
                  <p className="text-muted-foreground mt-1">{tutorial.description}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{tutorial.duration}</span>
                </div>
                <Badge variant="outline" className={getDifficultyColor(tutorial.difficulty)}>
                  {tutorial.difficulty}
                </Badge>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{tutorial.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>更新于 {tutorial.updatedAt}</span>
                </div>
              </div>
            </div>
            
            {/* Share Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleShare('x')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                分享到 X
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleShare('facebook')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleShare('reddit')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Reddit
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  目录导航
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => scrollToSection(section.id)}
                    >
                      <Icon className="h-4 w-4" />
                      {section.title}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview Section */}
            <section id="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    教程概述
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none dark:prose-invert">
                    <p className="text-base leading-relaxed">{tutorial.content.overview}</p>
                  </div>
                  
                  {/* Author Info */}
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">教程作者</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{tutorial.author.name}</p>
                        <p className="text-sm text-muted-foreground">{tutorial.author.title}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Video Section */}
            <section id="video">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    视频教程
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">视频内容即将推出</p>
                      <p className="text-sm text-muted-foreground mt-1">敬请期待完整的视频教程</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Steps Section */}
            <section id="steps">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    操作步骤
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {tutorial.content.steps.map((step, index) => (
                    <div key={step.id} className="relative">
                      {index < tutorial.content.steps.length - 1 && (
                        <div className="absolute left-4 top-8 w-0.5 h-full bg-border" />
                      )}
                      
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <h3 className="text-lg font-semibold">{step.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{step.content}</p>
                          
                          {step.code && (
                            <div className="bg-muted/50 rounded-lg p-4">
                              <pre className="text-sm font-mono overflow-x-auto">
                                <code>{step.code}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* Related Servers Section */}
            <section id="servers">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    相关服务器
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    本教程涉及以下MCP服务器，点击可快速配置
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {tutorial.servers.map((server) => (
                      <div 
                        key={server.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <ServerLogo name={server.name} className="w-10 h-10" />
                          <div>
                            <h4 className="font-medium">{server.name}</h4>
                            <p className="text-sm text-muted-foreground">{server.description}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          快速配置
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}