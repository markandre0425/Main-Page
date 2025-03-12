import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FaAward, FaFireExtinguisher, FaPuzzlePiece, FaImages, FaGraduationCap } from "react-icons/fa";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
}

export default function AchievementBadge({
  title,
  description,
  icon,
  earned,
  earnedAt,
}: AchievementBadgeProps) {
  // Render the appropriate icon based on the icon name
  const renderIcon = () => {
    switch (icon) {
      case 'award':
        return <FaAward className={earned ? "text-green-600" : "text-gray-400"} />;
      case 'fire-extinguisher':
        return <FaFireExtinguisher className={earned ? "text-amber-600" : "text-gray-400"} />;
      case 'puzzle-piece':
        return <FaPuzzlePiece className={earned ? "text-blue-600" : "text-gray-400"} />;
      case 'images':
        return <FaImages className={earned ? "text-purple-600" : "text-gray-400"} />;
      case 'graduation-cap':
        return <FaGraduationCap className={earned ? "text-blue-600" : "text-gray-400"} />;
      default:
        return <FaAward className={earned ? "text-green-600" : "text-gray-400"} />;
    }
  };

  // Determine background color for the icon container
  const getIconBgColor = () => {
    if (!earned) return "bg-gray-100";
    
    switch (icon) {
      case 'award':
        return "bg-green-100";
      case 'fire-extinguisher':
        return "bg-amber-100";
      case 'puzzle-piece':
        return "bg-blue-100";
      case 'images':
        return "bg-purple-100";
      case 'graduation-cap':
        return "bg-blue-100";
      default:
        return "bg-green-100";
    }
  };

  // Format earned date
  const formatEarnedDate = () => {
    if (!earnedAt) return "";
    return new Date(earnedAt).toLocaleDateString();
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Card className={`achievement-badge p-4 flex flex-col items-center text-center transition ${earned ? "" : "opacity-50"}`}>
            <CardContent className="p-0">
              <div className={`w-16 h-16 rounded-full ${getIconBgColor()} flex items-center justify-center mb-2 text-2xl`}>
                {renderIcon()}
              </div>
              <h3 className="font-bold text-sm text-dark-navy">{title}</h3>
              <p className="text-xs text-gray-500">{description}</p>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-bold">{title}</p>
            <p>{description}</p>
            {earned && earnedAt && (
              <p className="text-xs mt-1">Earned on {formatEarnedDate()}</p>
            )}
            {!earned && (
              <p className="text-xs mt-1 italic">Not yet earned</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
