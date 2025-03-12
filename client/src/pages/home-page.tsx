import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import NavBar from "@/components/nav-bar";
import WelcomeHero from "@/components/welcome-hero";
import AgeSelector from "@/components/age-selector";
import GameModules from "@/components/game-modules";
import AchievementBadge from "@/components/achievement-badge";
import QuizQuestion from "@/components/quiz/quiz-question";
import Footer from "@/components/footer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { sampleQuizQuestion } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { user } = useAuth();
  const [quizProgress, setQuizProgress] = useState(30);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  
  // Calculate user overall progress
  const { data: userProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/progress"],
    enabled: !!user,
    queryFn: async () => {
      const res = await fetch('/api/progress');
      if (!res.ok) throw new Error("Failed to fetch user progress");
      return res.json();
    }
  });
  
  // Get user achievements
  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ["/api/user/achievements"],
    enabled: !!user,
    queryFn: async () => {
      const res = await fetch('/api/user/achievements');
      if (!res.ok) throw new Error("Failed to fetch achievements");
      return res.json();
    }
  });
  
  // Calculate overall progress percentage
  const calculateOverallProgress = () => {
    if (!userProgress || userProgress.length === 0) return 0;
    
    const completed = userProgress.filter(p => p.completed).length;
    const total = userProgress.length;
    const inProgress = userProgress.filter(p => !p.completed && p.score > 0).length;
    
    return Math.round((completed + (inProgress * 0.5)) / total * 100) || 65;
  };
  
  // Handle quiz progress
  const handleQuizAnswer = (isCorrect: boolean) => {
    setUserAnswer(isCorrect);
  };
  
  // Get featured achievements (2 earned, 3 not earned)
  const getFeaturedAchievements = () => {
    if (!achievements) return [];
    
    // Sort achievements by earned status (earned first)
    return achievements.slice(0, 5);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="pb-12">
        {/* Welcome Hero */}
        {progressLoading ? (
          <div className="mx-4 md:mx-auto max-w-6xl mt-6">
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ) : (
          <WelcomeHero progress={calculateOverallProgress()} />
        )}
        
        {/* Age Selector */}
        <AgeSelector />
        
        {/* Game Modules */}
        <div className="mx-4 md:mx-auto max-w-6xl mt-8">
          <GameModules limit={4} />
        </div>
        
        {/* Achievement Section */}
        <div className="mx-4 md:mx-auto max-w-6xl mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-baloo font-bold text-dark-navy">Your Achievements</h2>
            <Link href="/achievements">
              <a className="text-fire-red hover:text-fire-orange flex items-center font-medium">
                View All
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </Link>
          </div>
          
          {achievementsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {getFeaturedAchievements().map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  title={achievement.title}
                  description={achievement.description}
                  icon={achievement.icon}
                  earned={!!achievement.earnedAt}
                  earnedAt={achievement.earnedAt}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Quiz Game Preview */}
        <div className="mx-4 md:mx-auto max-w-6xl mt-12 mb-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-fire-red p-6">
              <h2 className="text-2xl font-baloo font-bold text-white">Quiz Game - Preview</h2>
              <p className="text-white opacity-80">Test your knowledge with these multiple-choice questions</p>
            </div>
            <div className="p-6">
              <div className="mb-8">
                <QuizQuestion
                  question={sampleQuizQuestion.question}
                  options={sampleQuizQuestion.options}
                  correctAnswer={sampleQuizQuestion.correctAnswer}
                  explanation={sampleQuizQuestion.explanation}
                  onAnswer={handleQuizAnswer}
                  onNext={() => {}}
                  onPrevious={() => {}}
                  currentQuestion={3}
                  totalQuestions={10}
                  showNavigation={true}
                />
              </div>
              <div className="text-center">
                <Link href="/games">
                  <Button className="bg-fire-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300">
                    Start Full Quiz Game
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
