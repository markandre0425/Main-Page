import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Progress } from "@/components/ui/progress";

interface GameCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  progress: number;
  ageGroup: string;
  type: string;
  completed?: boolean;
}

export default function GameCard({
  id,
  title,
  description,
  imageUrl,
  progress,
  ageGroup,
  type,
  completed = false,
}: GameCardProps) {
  // Determine status badge based on progress
  const getStatusBadge = () => {
    if (completed) {
      return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Completed</span>;
    }
    
    if (progress === 0) {
      return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">New</span>;
    }
    
    return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{progress}% Done</span>;
  };

  // Determine age group badge color
  const getAgeBadgeColor = () => {
    switch (ageGroup) {
      case 'kids':
        return "bg-water-blue text-white";
      case 'preteens':
        return "bg-green-600 text-white";
      case 'teens':
        return "bg-fire-orange text-white";
      case 'adults':
        return "bg-fire-red text-white";
      default:
        return "bg-safety-yellow text-dark-navy";
    }
  };

  // Determine age group label
  const getAgeBadgeLabel = () => {
    switch (ageGroup) {
      case 'kids':
        return "Kids";
      case 'preteens':
        return "Pre-teens";
      case 'teens':
        return "Teens";
      case 'adults':
        return "Adults";
      default:
        return "All Ages";
    }
  };

  // Get link path based on game type
  const getGamePath = () => {
    switch (type) {
      case 'quiz':
        return `/games/quiz/${id}`;
      case 'crossword':
        return `/games/crossword/${id}`;
      case 'wordScramble':
        return `/games/word-scramble/${id}`;
      case 'wordPics':
        return `/games/word-pics/${id}`;
      default:
        return `/games`;
    }
  };

  return (
    <Card className="game-card overflow-hidden transition duration-300 transform hover:-translate-y-1 relative h-full">
      <div className={`age-badge ${getAgeBadgeColor()} text-xs font-bold px-2 py-1 rounded-full absolute top-2 right-2 z-10`}>
        {getAgeBadgeLabel()}
      </div>
      <div className="h-48 overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg text-dark-navy">{title}</h3>
          {getStatusBadge()}
        </div>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <div className="w-2/3 bg-gray-200 rounded-full h-2">
            <Progress value={progress} className="h-2" />
          </div>
          <Link href={getGamePath()}>
            <Button className="bg-fire-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-300">
              {progress > 0 ? "Play" : "Start"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
