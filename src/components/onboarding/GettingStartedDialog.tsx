
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Server,
  Play,
  Share,
  Plus,
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { markOnboardingAsSeen } from "@/utils/localStorage";

interface GettingStartedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GettingStartedDialog = ({ open, onOpenChange }: GettingStartedDialogProps) => {
  const [expandedStep, setExpandedStep] = useState<number>(0);
  const [closing, setClosing] = useState(false);
  const [animationOrigin, setAnimationOrigin] = useState<string>("60 calc(100vh - 60)");
  const dialogRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!open && !closing) {
      setClosing(false);
    }
  }, [open, closing]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setAnimationOrigin("60 calc(100vh - 60)");
      
      setClosing(true);
      
      setTimeout(() => {
        markOnboardingAsSeen();
        setClosing(false);
        onOpenChange(false);
      }, 300);
    } else {
      onOpenChange(true);
    }
  };

  const beginnerGuideSteps = [
    {
      title: "添加本地已安装的MCP Host",
      description: "连接到您本地网络中可用的MCP主机。",
      icon: <Server className="h-6 w-6 text-blue-500" />,
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      iconColor: "text-blue-600 dark:text-blue-300",
      content: (
        <>
          <p className="text-muted-foreground mb-4">
            开始使用MCP Now的第一步是添加您本地已安装的MCP主机：
          </p>
          <ol className="list-decimal list-inside space-y-3 text-sm">
            <li className="py-1">打开应用后，系统会自动扫描本地网络中可用的主机</li>
            <li className="py-1">从发现列表中选择一个或多个主机，或使用"手动添加"选项</li>
            <li className="py-1">提供必要的连接详情（主机名称、图标和连接地址）</li>
            <li className="py-1">系统将自动为新添加的主机创建默认配置文件</li>
          </ol>
          <div className="pt-4">
            <Button asChild size="sm" className="gap-1 bg-blue-500 hover:bg-blue-600">
              <Link to="/hosts">
                管理主机
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      )
    },
    {
      title: "添加MCP Server至Host",
      description: "为您的主机选择并配置服务器。",
      icon: <Plus className="h-6 w-6 text-purple-500" />,
      iconBg: "bg-purple-100 dark:bg-purple-900/40",
      iconColor: "text-purple-600 dark:text-purple-300",
      content: (
        <>
          <p className="text-muted-foreground mb-4">
            连接主机后，您需要添加和配置服务器：
          </p>
          <ol className="list-decimal list-inside space-y-3 text-sm">
            <li className="py-1">在主机详情页面，选择一个配置文件</li>
            <li className="py-1">点击"添加服务器"按钮，从可用服务器类型中选择</li>
            <li className="py-1">根据需要为每个所选服务器提供附加配置</li>
            <li className="py-1">完成后，服务器将被添加到当前配置文件并显示在已连接服务器列表中</li>
          </ol>
          <div className="pt-4">
            <Button asChild size="sm" className="gap-1 bg-purple-500 hover:bg-purple-600">
              <Link to="/servers">
                添加服务器
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      )
    },
    {
      title: "运行Server并动态管理",
      description: "启动、监控和管理您的服务器。",
      icon: <Play className="h-6 w-6 text-green-500" />,
      iconBg: "bg-green-100 dark:bg-green-900/40", 
      iconColor: "text-green-600 dark:text-green-300",
      content: (
        <>
          <p className="text-muted-foreground mb-4">
            添加服务器后，您可以灵活管理它们的运行状态：
          </p>
          <ol className="list-decimal list-inside space-y-3 text-sm">
            <li className="py-1">通过服务器列表中的开关控制每个服务器的状态（运行/停止）</li>
            <li className="py-1">系统会提供有关连接状态的直观反馈（连接中、运行中、错误）</li>
            <li className="py-1">点击服务器项目可访问每个服务器的详细信息</li>
            <li className="py-1">根据需要调整环境变量、命令参数和其他设置</li>
            <li className="py-1">出现错误时，系统会显示通知并提供问题解决方案</li>
          </ol>
          <div className="pt-4">
            <Button asChild size="sm" className="gap-1 bg-green-500 hover:bg-green-600">
              <Link to="/hosts">
                管理服务器
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      )
    },
    {
      title: "分享MCP Now给更多的人",
      description: "与他人共享您的MCP配置。",
      icon: <Share className="h-6 w-6 text-amber-500" />,
      iconBg: "bg-amber-100 dark:bg-amber-900/40",
      iconColor: "text-amber-600 dark:text-amber-300",
      content: (
        <>
          <p className="text-muted-foreground mb-4">
            轻松与团队成员或朋友共享您的MCP配置：
          </p>
          <ol className="list-decimal list-inside space-y-3 text-sm">
            <li className="py-1">在主机详情页面点击"共享配置文件"按钮</li>
            <li className="py-1">选择是共享完整配置还是仅共享基本配置文件</li>
            <li className="py-1">选择要在共享配置文件中包含的特定服务器</li>
            <li className="py-1">点击"生成共享链接"创建独特链接</li>
            <li className="py-1">复制链接并分享给他人，对方可以在确认前预览他们将导入的内容</li>
          </ol>
          <div className="pt-4">
            <Button asChild size="sm" className="gap-1 bg-amber-500 hover:bg-amber-600">
              <Link to="/profiles">
                管理配置文件
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      )
    }
  ];

  return (
    <Dialog open={open || closing} onOpenChange={handleOpenChange}>
      <DialogContent 
        ref={dialogRef}
        className={`max-w-2xl ${closing ? 'animate-collapse' : 'animate-expand'}`}
        animationOrigin={animationOrigin}
        hideClose={true}
        size="xl"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">欢迎使用 MCP Now</DialogTitle>
          <DialogDescription className="text-base">
            按照以下简单步骤开始配置和使用 MCP Now。
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Accordion 
            type="single" 
            defaultValue="step-0" 
            collapsible 
            className="w-full rounded-md overflow-hidden border"
          >
            {beginnerGuideSteps.map((step, index) => (
              <AccordionItem 
                key={`step-${index}`} 
                value={`step-${index}`}
                className={index === beginnerGuideSteps.length - 1 ? "border-0" : ""}
              >
                <AccordionTrigger 
                  className="px-4 py-5 hover:bg-muted/30 data-[state=open]:bg-muted/20"
                  icon={
                    <div className={`${step.iconBg} ${step.iconColor} p-3 rounded-full`}>
                      {step.icon}
                    </div>
                  }
                >
                  <div>
                    <h3 className="font-medium text-lg">步骤 {index + 1}: {step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 bg-muted/10">
                  {step.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            您可以随时从侧边栏重新打开此指南。
          </div>
          <DialogClose asChild>
            <Button>
              明白了
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

