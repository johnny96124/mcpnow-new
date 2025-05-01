
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, Share, Upload, Server as ServerIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Profile, ServerInstance } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ShareProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  serverInstances: ServerInstance[];
}

type ShareOption = "full" | "servers-only";

export function ShareProfileDialog({
  open,
  onOpenChange,
  profile,
  serverInstances
}: ShareProfileDialogProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [shareOption, setShareOption] = useState<ShareOption>("full");
  const { toast } = useToast();
  
  // Filter server instances that are part of this profile
  const profileServers = serverInstances.filter(
    server => profile.instances.includes(server.id)
  );
  
  const generateShareUrl = () => {
    // Simulate a network request with a brief delay
    setIsGeneratingLink(true);
    
    setTimeout(() => {
      if (shareOption === "full") {
        // Full profile sharing with configurations
        setShareUrl(`https://mcpnow.app/profiles/share/${profile.id}?config=true`);
      } else {
        // Share profile without server configurations
        setShareUrl(`https://mcpnow.app/profiles/share/${profile.id}`);
      }
      setIsGeneratingLink(false);
      
      toast({
        title: "链接已生成！",
        description: "您的分享链接已准备好",
      });
    }, 500); // Simulate a brief delay
  };
  
  const handleCopyUrl = () => {
    if (!shareUrl) return;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      toast({
        title: "链接已复制！",
        description: "分享链接已复制到剪贴板",
      });
      
      // Close dialog after copying
      setTimeout(() => {
        onOpenChange(false);
        // Reset copied state after dialog closes
        setTimeout(() => setIsCopied(false), 300);
      }, 1000);
    });
  };

  // Reset states when dialog opens
  useEffect(() => {
    if (open) {
      setShareOption("full");
      setIsCopied(false);
      setShareUrl(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl flex items-center gap-2">
            <Upload className="h-5 w-5" />
            分享你的配置
          </DialogTitle>
          <DialogDescription>
            可快速生成配置分享链接，一键导入开发环境
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <RadioGroup value={shareOption} onValueChange={(value) => setShareOption(value as ShareOption)}>
            <div className="grid grid-cols-2 gap-4">
              <Card className={cn(
                "relative p-4 cursor-pointer border-2 flex flex-col items-center justify-center text-center h-48",
                shareOption === "full" ? "border-primary bg-primary/5" : "border-muted"
              )}>
                <div className="absolute top-3 right-3">
                  <RadioGroupItem value="full" id="full" className="sr-only" />
                </div>
                <Upload className="h-10 w-10 text-primary mb-2" />
                <h3 className="font-medium text-lg mb-1">分享完整配置 (推荐)</h3>
                <p className="text-sm text-muted-foreground">
                  包含所有 Profile 变量和依赖的 Server
                </p>
              </Card>
              
              <Card className={cn(
                "relative p-4 cursor-pointer border-2 flex flex-col items-center justify-center text-center h-48",
                shareOption === "servers-only" ? "border-primary bg-primary/5" : "border-muted"
              )}>
                <div className="absolute top-3 right-3">
                  <RadioGroupItem value="servers-only" id="servers-only" className="sr-only" />
                </div>
                <ServerIcon className="h-10 w-10 mb-2" />
                <h3 className="font-medium text-lg mb-1">仅分享 Server</h3>
                <p className="text-sm text-muted-foreground">
                  只分享服务器配置，不包含 Profile 参数
                </p>
              </Card>
            </div>
          </RadioGroup>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium mb-1">
                Profile 名称
              </label>
              <Input 
                id="profile-name" 
                value={profile.name} 
                readOnly 
                className="bg-muted/30"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  服务器列表 ({profileServers.length})
                </label>
                <Badge variant="outline" className="text-xs">
                  {profileServers.length} 个服务器
                </Badge>
              </div>
              
              <div className="border rounded-md overflow-hidden divide-y">
                {profileServers.map((server) => (
                  <div key={server.id} className="p-3 bg-background hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{server.name}</div>
                      <Badge 
                        variant={server.status === "running" ? "default" : "outline"} 
                        className="text-xs"
                      >
                        {server.status === "running" ? "在线" : "离线"}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {profileServers.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    此配置文件中没有服务器
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {shareUrl ? (
            <div className="space-y-3">
              <Separator />
              <h4 className="text-sm font-medium">分享链接:</h4>
              <div className="bg-muted/40 border rounded-md p-3 flex items-center">
                <div className="text-sm truncate mr-3 flex-1 overflow-hidden font-mono">
                  {shareUrl}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="secondary"
                  size="sm"
                  className={`gap-1.5 ${isCopied ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800' : ''}`}
                  onClick={handleCopyUrl}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      复制
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center pt-2">
              <Button 
                variant="default"
                className="gap-1.5 w-full sm:w-auto bg-gradient-to-r from-indigo-400 to-blue-500 hover:from-indigo-500 hover:to-blue-600"
                onClick={generateShareUrl}
                disabled={isGeneratingLink}
              >
                <Share className="h-4 w-4" />
                一键生成链接
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
