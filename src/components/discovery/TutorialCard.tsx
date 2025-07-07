import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, BookOpen, ArrowRight } from "lucide-react";

interface TutorialCardProps {
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  students: number;
  image: string;
  category: string;
  onClick?: () => void;
}

export const TutorialCard: React.FC<TutorialCardProps> = ({
  title,
  description,
  duration,
  difficulty,
  students,
  image,
  category,
  onClick
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    // Navigate to tutorial detail page with a generated ID based on title
    const tutorialId = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    navigate(`/tutorial/${tutorialId}`);
  };
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50"
      onClick={handleClick}
    >
      <div className="relative">
        <div className="h-32 relative overflow-hidden rounded-t-lg">
          {image ? (
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600" />
          )}
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className="bg-white/90 text-gray-700 border-white/50">
              {category}
            </Badge>
          </div>
          <div className="absolute bottom-3 right-3">
            <Button 
              size="sm" 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 group-hover:scale-105 transition-transform"
            >
              <BookOpen className="h-3.5 w-3.5 mr-1" />
              学习
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {duration}
            </div>
            <div className="flex items-center text-muted-foreground">
              <Users className="h-3.5 w-3.5 mr-1" />
              {students.toLocaleString()}人已学习
            </div>
            <Badge variant="outline" className={`text-xs ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </Badge>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};