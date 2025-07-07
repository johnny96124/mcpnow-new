import React from "react";
import { TutorialCard } from "./TutorialCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { GraduationCap, ExternalLink } from "lucide-react";

const tutorials = [
  {
    title: "MCP Server 快速入门指南",
    description: "从零开始学习如何安装、配置和使用MCP Server，包含实际案例演示",
    duration: "15分钟",
    difficulty: "Beginner" as const,
    students: 1247,
    image: "",
    category: "入门教程"
  },
  {
    title: "高级配置与性能优化",
    description: "深入了解MCP Server的高级配置选项，优化性能和稳定性",
    duration: "25分钟", 
    difficulty: "Advanced" as const,
    students: 856,
    image: "",
    category: "进阶教程"
  },
  {
    title: "API集成最佳实践",
    description: "学习如何将MCP Server与各种API服务集成，实现强大的自动化功能",
    duration: "20分钟",
    difficulty: "Intermediate" as const,
    students: 932,
    image: "",
    category: "实践教程"
  },
  {
    title: "故障排查与调试技巧",
    description: "掌握常见问题的排查方法和调试技巧，快速解决使用中的问题",
    duration: "18分钟",
    difficulty: "Intermediate" as const,
    students: 743,
    image: "",
    category: "技术支持"
  },
  {
    title: "自定义Server开发",
    description: "从零开始构建你自己的MCP Server，满足特定的业务需求",
    duration: "45分钟",
    difficulty: "Advanced" as const,
    students: 524,
    image: "",
    category: "开发教程"
  }
];

export const TutorialSection: React.FC = () => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">MCP Server 学院</h2>
            <p className="text-sm text-muted-foreground">
              掌握专业技能，提升开发效率
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => window.location.href = '/academy'}
        >
          查看全部教程
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {tutorials.map((tutorial, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <TutorialCard
                {...tutorial}
                onClick={() => {
                  // 处理教程点击
                  console.log('Tutorial clicked:', tutorial.title);
                }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};