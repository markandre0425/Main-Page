import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AchievementBadge from "@/components/achievement-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Fetch user achievements
  const { data: achievements, isLoading, error } = useQuery({
    queryKey: ["/api/user/achievements"],
    queryFn: async () => {
      const res = await fetch('/api/user/achievements');
      if (!res.ok) throw new Error("Failed to fetch achievements");
      return res.json();
    }
  });
  
  // Fetch all available achievements
  const { data: allAchievements } = useQuery({
    queryKey: ["/api/achievements"],
    queryFn: async () => {
      const res = await fetch('/api/achievements');
      if (!res.ok) throw new Error("Failed to fetch all achievements");
      return res.json();
    }
  });
  
  // Filter achievements by condition
  const getAchievementsByCondition = (condition: string) => {
    if (!achievements || !allAchievements) return [];
    
    // Create a merged list of all achievements, marking which ones are earned
    const mergedAchievements = allAchievements.map(achievement => {
      const earned = achievements.find(a => a.id === achievement.id);
      return {
        ...achievement,
        earned: !!earned,
        earnedAt: earned?.earnedAt
      };
    });
    
    if (condition === "all") {
      return mergedAchievements;
    } else if (condition === "earned") {
      return mergedAchievements.filter(a => a.earned);
    } else if (condition === "not-earned") {
      return mergedAchievements.filter(a => !a.earned);
    } else {
      return mergedAchievements.filter(a => a.condition.includes(condition));
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-baloo font-bold text-dark-navy mb-6">Your Achievements</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to load achievements"}
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Achievement Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">Achievements Unlocked</h3>
                  <span className="text-fire-orange font-bold">
                    {achievements?.length || 0} of {allAchievements?.length || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-fire-orange to-fire-red h-4 rounded-full" 
                    style={{ width: `${(achievements?.length || 0) / (allAchievements?.length || 1) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Achievements</TabsTrigger>
            <TabsTrigger value="earned">Earned</TabsTrigger>
            <TabsTrigger value="not-earned">Locked</TabsTrigger>
            <TabsTrigger value="QUIZZES">Quiz</TabsTrigger>
            <TabsTrigger value="CROSSWORDS">Crossword</TabsTrigger>
            <TabsTrigger value="WORD_PICS">4 Pics 1 Word</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array(10).fill(null).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {getAchievementsByCondition(activeTab).map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    title={achievement.title}
                    description={achievement.description}
                    icon={achievement.icon}
                    earned={achievement.earned}
                    earnedAt={achievement.earnedAt}
                  />
                ))}
              </div>
            )}
            
            {!isLoading && getAchievementsByCondition(activeTab).length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold mb-2">No achievements found</h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === "earned" 
                    ? "You haven't earned any achievements yet. Keep playing to unlock them!"
                    : activeTab === "not-earned"
                    ? "You've earned all available achievements. Congratulations!"
                    : "No achievements match the selected filter."}
                </p>
                <Link href="/games">
                  <Button className="bg-fire-red hover:bg-red-700">Play Games</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
