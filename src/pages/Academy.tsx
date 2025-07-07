import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Clock, 
  Star,
  MessageSquare,
  Share2,
  GraduationCap,
  Target,
  Zap,
  Heart
} from "lucide-react";
import { TutorialCard } from "@/components/discovery/TutorialCard";
import xLogo from "@/assets/x-logo.png";
import facebookLogo from "@/assets/facebook-logo.png";
import redditLogo from "@/assets/reddit-logo.png";
import aiTutorial1 from "@/assets/ai-tutorial-1.jpg";
import aiTutorial2 from "@/assets/ai-tutorial-2.jpg";
import aiTutorial3 from "@/assets/ai-tutorial-3.jpg";
import aiTutorial4 from "@/assets/ai-tutorial-4.jpg";
import aiTutorial5 from "@/assets/ai-tutorial-5.jpg";
import socialPost1 from "@/assets/social-post-1.jpg";
import socialPost2 from "@/assets/social-post-2.jpg";
import socialPost3 from "@/assets/social-post-3.jpg";

const tutorialCategories = [
  {
    title: "MCP Now 快速上手",
    description: "帮助新用户快速了解和使用MCP Now平台",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    tutorials: [
      {
        title: "MCP Server 快速入门指南",
        description: "从零开始学习如何安装、配置和使用MCP Server，包含实际案例演示",
        duration: "15分钟",
        difficulty: "Beginner" as const,
        students: 1247,
        image: aiTutorial1,
        category: "入门教程"
      },
      {
        title: "界面功能全览",
        description: "详细介绍MCP Now各个功能模块，帮助用户快速熟悉平台操作",
        duration: "12分钟",
        difficulty: "Beginner" as const,
        students: 956,
        image: aiTutorial4,
        category: "平台指南"
      },
      {
        title: "配置文件管理入门",
        description: "学习如何创建、修改和管理MCP Server配置文件，掌握基础配置技巧",
        duration: "10分钟",
        difficulty: "Beginner" as const,
        students: 1089,
        image: aiTutorial2,
        category: "配置教程"
      },
      {
        title: "常用Server推荐与安装",
        description: "介绍最受欢迎的MCP Server及其安装配置方法，快速开始你的第一个项目",
        duration: "18分钟",
        difficulty: "Beginner" as const,
        students: 1324,
        image: aiTutorial3,
        category: "推荐教程"
      }
    ]
  },
  {
    title: "MCP Server 教程",
    description: "深入学习各种MCP Server的配置和使用技巧",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
    tutorials: [
      {
        title: "高级配置与性能优化",
        description: "深入了解MCP Server的高级配置选项，优化性能和稳定性",
        duration: "25分钟",
        difficulty: "Advanced" as const,
        students: 856,
        image: aiTutorial5,
        category: "进阶教程"
      },
      {
        title: "API集成最佳实践",
        description: "学习如何将MCP Server与各种API服务集成，实现强大的自动化功能",
        duration: "20分钟",
        difficulty: "Intermediate" as const,
        students: 932,
        image: aiTutorial2,
        category: "实践教程"
      },
      {
        title: "自定义Server开发",
        description: "从零开始构建你自己的MCP Server，满足特定的业务需求",
        duration: "45分钟",
        difficulty: "Advanced" as const,
        students: 524,
        image: aiTutorial3,
        category: "开发教程"
      },
      {
        title: "多Server集成与管理",
        description: "学习如何同时管理多个MCP Server，实现复杂的工作流程自动化",
        duration: "30分钟",
        difficulty: "Advanced" as const,
        students: 678,
        image: aiTutorial1,
        category: "高级教程"
      },
      {
        title: "错误处理与监控",
        description: "掌握MCP Server的错误处理机制和监控方法，确保系统稳定运行",
        duration: "28分钟",
        difficulty: "Intermediate" as const,
        students: 456,
        image: aiTutorial4,
        category: "运维教程"
      }
    ]
  },
  {
    title: "新手必读",
    description: "专为初学者准备的基础知识和常见问题解答",
    icon: GraduationCap,
    color: "from-green-500 to-emerald-500",
    tutorials: [
      {
        title: "故障排查与调试技巧",
        description: "掌握常见问题的排查方法和调试技巧，快速解决使用中的问题",
        duration: "18分钟",
        difficulty: "Intermediate" as const,
        students: 743,
        image: aiTutorial4,
        category: "技术支持"
      },
      {
        title: "安全配置指南",
        description: "了解MCP Server的安全最佳实践，保护你的数据和隐私",
        duration: "22分钟",
        difficulty: "Beginner" as const,
        students: 1156,
        image: aiTutorial1,
        category: "安全教程"
      },
      {
        title: "常见问题与解决方案",
        description: "汇总新手使用过程中最常遇到的问题及其解决方案，避免常见陷阱",
        duration: "16分钟",
        difficulty: "Beginner" as const,
        students: 1445,
        image: aiTutorial5,
        category: "问题解答"
      },
      {
        title: "社区资源与支持",
        description: "了解如何利用社区资源，获取帮助，以及为社区贡献你的力量",
        duration: "14分钟",
        difficulty: "Beginner" as const,
        students: 987,
        image: aiTutorial2,
        category: "社区指南"
      }
    ]
  }
];

const socialPosts = [
  {
    id: 1,
    platform: 'x',
    author: '@techguru_dev',
    content: "刚试用了MCP Now的文件管理Server，效率提升了300%！强烈推荐给所有开发者 🚀",
    likes: 156,
    shares: 24,
    timestamp: "2小时前",
    serverName: "File Manager Pro",
    image: socialPost1
  },
  {
    id: 2,
    platform: 'reddit',
    author: 'u/ai_enthusiast',
    content: "MCP Now的数据库查询Server真的太好用了，几分钟就能设置完成，查询速度超快！",
    likes: 89,
    shares: 12,
    timestamp: "4小时前",
    serverName: "Database Query",
    image: socialPost2
  },
  {
    id: 3,
    platform: 'facebook',
    author: 'John Chen',
    content: "团队开始使用MCP Now后，工作流程自动化程度大大提升，节省了很多时间！",
    likes: 203,
    shares: 45,
    timestamp: "6小时前",
    serverName: "Automation Suite",
    image: socialPost3
  }
];

export default function Academy() {
  const navigate = useNavigate();

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'x': return xLogo;
      case 'facebook': return facebookLogo;
      case 'reddit': return redditLogo;
      default: return xLogo;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'x': return 'X (Twitter)';
      case 'facebook': return 'Facebook';
      case 'reddit': return 'Reddit';
      default: return platform;
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
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回发现页
          </Button>
          
          {/* Hero Section */}
          <div className="text-center space-y-8 mb-16">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"></div>
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-50"></div>
                    <div className="relative p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl">
                      <GraduationCap className="h-16 w-16 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    MCP Server 学院
                  </h1>
                  <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                    让所有人通过 MCP Now 快速上手 MCP Server
                  </p>
                  <div className="flex justify-center gap-2 mt-8">
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    <div className="w-4 h-1 bg-pink-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial Categories */}
        <div className="space-y-12">
          {tutorialCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <section key={categoryIndex} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-gradient-to-br ${category.color} rounded-xl shadow-md`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.tutorials.map((tutorial, index) => (
                    <TutorialCard
                      key={index}
                      {...tutorial}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <Separator className="my-12" />

        {/* Social Media Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-md">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">社区分享</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              看看社区用户是如何使用 MCP Server 的，获取更多使用灵感
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="h-32 relative">
                  <img 
                    src={post.image} 
                    alt="Social post preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-3 left-3">
                    <img 
                      src={getPlatformIcon(post.platform)} 
                      alt={getPlatformName(post.platform)}
                      className="h-6 w-6 bg-white rounded-full p-1"
                    />
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-sm">{post.author}</p>
                        <p className="text-xs text-muted-foreground">{getPlatformName(post.platform)}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed">{post.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {post.serverName}
                    </Badge>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" />
                        {post.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-3.5 w-3.5" />
                        {post.shares}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-2xl font-bold">开始你的 MCP Server 学习之旅</h3>
              <p className="text-muted-foreground">
                选择适合你水平的教程，跟随专业指导，快速掌握 MCP Server 的强大功能
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  <BookOpen className="h-5 w-5" />
                  浏览入门教程
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Users className="h-5 w-5" />
                  加入社区讨论
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}