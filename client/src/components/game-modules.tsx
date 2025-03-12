import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Heading } from "@/components/ui/heading";
import GameCard from "@/components/game-card";
import { gameTypes, ageGroups } from "@shared/schema";
import { gameInfo } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

interface GameModulesProps {
  className?: string;
  limit?: number;
}

export default function GameModules({ className = "", limit }: GameModulesProps) {
  const { user } = useAuth();
  const [currentAgeGroup, setCurrentAgeGroup] = useState(user?.ageGroup || ageGroups.KIDS);
  
  useEffect(() => {
    if (user) {
      setCurrentAgeGroup(user.ageGroup);
    }
  }, [user]);
  
  // Fetch games of all types
  const { data: quizzes, isLoading: quizzesLoading } = useQuery({
    queryKey: ["/api/quizzes", currentAgeGroup],
    queryFn: async () => {
      const res = await fetch(`/api/quizzes?ageGroup=${currentAgeGroup}`);
      if (!res.ok) throw new Error("Failed to fetch quizzes");
      return res.json();
    }
  });
  
  const { data: crosswords, isLoading: crosswordsLoading } = useQuery({
    queryKey: ["/api/crosswords", currentAgeGroup],
    queryFn: async () => {
      const res = await fetch(`/api/crosswords?ageGroup=${currentAgeGroup}`);
      if (!res.ok) throw new Error("Failed to fetch crosswords");
      return res.json();
    }
  });
  
  const { data: wordScrambles, isLoading: wordScramblesLoading } = useQuery({
    queryKey: ["/api/word-scrambles", currentAgeGroup],
    queryFn: async () => {
      const res = await fetch(`/api/word-scrambles?ageGroup=${currentAgeGroup}`);
      if (!res.ok) throw new Error("Failed to fetch word scrambles");
      return res.json();
    }
  });
  
  const { data: wordPics, isLoading: wordPicsLoading } = useQuery({
    queryKey: ["/api/word-pics", currentAgeGroup],
    queryFn: async () => {
      const res = await fetch(`/api/word-pics?ageGroup=${currentAgeGroup}`);
      if (!res.ok) throw new Error("Failed to fetch word pics");
      return res.json();
    }
  });
  
  // Fetch user progress
  const { data: userProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/progress"],
    queryFn: async () => {
      const res = await fetch('/api/progress');
      if (!res.ok) throw new Error("Failed to fetch user progress");
      return res.json();
    }
  });
  
  const isLoading = quizzesLoading || crosswordsLoading || wordScramblesLoading || wordPicsLoading || progressLoading;
  
  // Get progress for a specific game
  const getGameProgress = (gameType: string, gameId: number) => {
    if (!userProgress) return 0;
    
    const progress = userProgress.find(p => p.gameType === gameType && p.gameId === gameId);
    if (progress) {
      return progress.completed ? 100 : progress.score || 0;
    }
    return 0;
  };
  
  // Check if a game is completed
  const isGameCompleted = (gameType: string, gameId: number) => {
    if (!userProgress) return false;
    
    const progress = userProgress.find(p => p.gameType === gameType && p.gameId === gameId);
    return progress?.completed || false;
  };
  
  // Combine all games
  const prepareGames = () => {
    const allGames = [
      ...(quizzes || []).map(quiz => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        imageUrl: gameInfo[gameTypes.QUIZ].imageUrl,
        type: gameTypes.QUIZ,
        ageGroup: quiz.ageGroup,
        progress: getGameProgress(gameTypes.QUIZ, quiz.id),
        completed: isGameCompleted(gameTypes.QUIZ, quiz.id)
      })),
      ...(crosswords || []).map(crossword => ({
        id: crossword.id,
        title: crossword.title,
        description: crossword.description,
        imageUrl: gameInfo[gameTypes.CROSSWORD].imageUrl,
        type: gameTypes.CROSSWORD,
        ageGroup: crossword.ageGroup,
        progress: getGameProgress(gameTypes.CROSSWORD, crossword.id),
        completed: isGameCompleted(gameTypes.CROSSWORD, crossword.id)
      })),
      ...(wordScrambles || []).map(wordScramble => ({
        id: wordScramble.id,
        title: `${wordScramble.category} Word: ${wordScramble.word.length} Letters`,
        description: `Difficulty: ${wordScramble.difficulty}`,
        imageUrl: gameInfo[gameTypes.WORD_SCRAMBLE].imageUrl,
        type: gameTypes.WORD_SCRAMBLE,
        ageGroup: wordScramble.ageGroup,
        progress: getGameProgress(gameTypes.WORD_SCRAMBLE, wordScramble.id),
        completed: isGameCompleted(gameTypes.WORD_SCRAMBLE, wordScramble.id)
      })),
      ...(wordPics || []).map(wordPic => ({
        id: wordPic.id,
        title: `4 Pics 1 Word: ${wordPic.word.length} Letters`,
        description: `Difficulty: ${wordPic.difficulty}`,
        imageUrl: gameInfo[gameTypes.WORD_PICS].imageUrl,
        type: gameTypes.WORD_PICS,
        ageGroup: wordPic.ageGroup,
        progress: getGameProgress(gameTypes.WORD_PICS, wordPic.id),
        completed: isGameCompleted(gameTypes.WORD_PICS, wordPic.id)
      }))
    ];
    
    // Sort by progress (in-progress games first, then new games, then completed games)
    return allGames.sort((a, b) => {
      // In-progress games first
      if (a.progress > 0 && a.progress < 100 && (b.progress === 0 || b.progress === 100)) return -1;
      if (b.progress > 0 && b.progress < 100 && (a.progress === 0 || a.progress === 100)) return 1;
      
      // Then new games
      if (a.progress === 0 && b.progress === 100) return -1;
      if (b.progress === 0 && a.progress === 100) return 1;
      
      // Alphabetical sorting as tiebreaker
      return a.title.localeCompare(b.title);
    }).slice(0, limit);
  };
  
  const games = prepareGames();

  return (
    <div className={className}>
      <Heading as="h2" className="text-2xl font-baloo font-bold text-dark-navy mb-6">Fire Safety Games</Heading>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col h-full">
              <Skeleton className="h-48 w-full" />
              <div className="p-5 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-2 w-2/3" />
                  <Skeleton className="h-10 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : games.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-600">No games available for your age group. Try changing your age group or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map(game => (
            <GameCard 
              key={`${game.type}-${game.id}`}
              id={game.id}
              title={game.title}
              description={game.description}
              imageUrl={game.imageUrl}
              progress={game.progress}
              ageGroup={game.ageGroup}
              type={game.type}
              completed={game.completed}
            />
          ))}
        </div>
      )}
    </div>
  );
}
