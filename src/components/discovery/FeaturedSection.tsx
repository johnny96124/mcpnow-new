import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Cloud, Star, ArrowRight, CheckCircle } from "lucide-react";
import { ServerDefinition } from "@/data/mockData";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { EndpointLabel } from "@/components/status/EndpointLabel";

interface FeaturedSectionProps {
  hostedServers: ServerDefinition[];
  verifiedServers: ServerDefinition[];
  onServerClick: (server: ServerDefinition) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  hostedServers,
  verifiedServers,
  onServerClick
}) => {
  const FeaturedCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    servers: ServerDefinition[];
    badgeText: string;
    badgeColor: string;
    gradient: string;
  }> = ({ title, description, icon, servers, badgeText, badgeColor, gradient }) => (
    <Card className="overflow-hidden">
      <CardHeader className={`${gradient} text-white p-4`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-white/90 text-sm">{description}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        {servers.slice(0, 3).map((server) => (
          <div 
            key={server.id}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => onServerClick(server)}
          >
            <div className="flex items-center gap-3">
              <ServerLogo name={server.name} className="w-8 h-8" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{server.name}</span>
                  <Badge variant="outline" className={badgeColor}>
                    {badgeText}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <EndpointLabel type={server.type} />
                  {server.isOfficial && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      官方
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        ))}
        
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => {
            const serverType = title.includes('云端托管') ? 'hosted' : 'verified';
            window.location.href = `/featured-servers?type=${serverType}`;
          }}
        >
          查看全部 {servers.length} 个服务器
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">精选服务器</h2>
        <p className="text-muted-foreground">
          专业托管与官方认证，保障服务稳定可靠
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <FeaturedCard
          title="云端托管"
          description="无需本地部署，开箱即用"
          icon={<Cloud className="h-5 w-5 text-white" />}
          servers={hostedServers}
          badgeText="托管"
          badgeColor="bg-blue-100 text-blue-700 border-blue-200"
          gradient="bg-gradient-to-br from-blue-600 to-blue-700"
        />
        
        <FeaturedCard
          title="官方认证"
          description="经过严格测试，质量保证"
          icon={<Shield className="h-5 w-5 text-white" />}
          servers={verifiedServers}
          badgeText="认证"
          badgeColor="bg-green-100 text-green-700 border-green-200"
          gradient="bg-gradient-to-br from-green-600 to-green-700"
        />
      </div>
    </section>
  );
};