import { useAuth } from "@/hooks/use-auth";
import { useUserProgress } from "@/hooks/useUserProgress";
import { FireSafetyStars } from "@/components/progress/FireSafetyStars";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Award, BookOpen, Medal, Star, Flame, Clock, Target, Zap, TrendingUp } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ProfilePage() {
  const { user } = useAuth();
  const { 
    progress, 
    achievements, 
    getFormattedTime, 
    getRecentGames, 
    getEarnedAchievements 
  } = useUserProgress();
  
  const earnedAchievements = getEarnedAchievements();
  const achievementProgress = achievements.length > 0 ? Math.round((earnedAchievements.length / achievements.length) * 100) : 0;
  
  // Real-time statistics data
  const statsData = [
    { label: "Missions Completed", value: progress.missionsCompleted, icon: <Target className="h-5 w-5 text-blue-500" /> },
    { label: "Quizzes Taken", value: progress.quizzesTaken, icon: <BookOpen className="h-5 w-5 text-purple-500" /> },
    { label: "Games Played", value: progress.gamesPlayed, icon: <Flame className="h-5 w-5 text-red-500" /> },
    { label: "Achievements Earned", value: progress.achievementsEarned, icon: <Award className="h-5 w-5 text-yellow-500" /> },
    { label: "Total Time Spent", value: getFormattedTime(progress.totalTimeSpent), icon: <Clock className="h-5 w-5 text-green-500" /> },
    { label: "Highest Score", value: `${progress.highestScore}%`, icon: <Star className="h-5 w-5 text-orange-500" /> }
  ];
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-bold">Loading profile...</h1>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div id="app" className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* User Profile Card */}
          <Card className="md:w-1/3">
            <CardHeader className="pb-2">
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>View and manage your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <motion.div 
                  className="relative mb-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src={`https://placehold.co/200x200/E91E63/FFFFFF/svg?text=${user.displayName?.charAt(0) || user.username?.charAt(0) || '?'}`}
                    alt="Profile" 
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg" 
                  />
                  <div className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md border-2 border-white">
                    <span className="text-sm font-bold">{user.level || 1}</span>
                  </div>
                </motion.div>
                
                <h3 className="text-xl font-bold">{user.displayName || user.username}</h3>
                <div className="flex items-center mt-2 space-x-1">
                  <Badge variant="outline" className="bg-blue-50">Level {user.level || 1}</Badge>
                  <Badge variant="outline" className="bg-purple-50">{user.points || 0} points</Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Level Progress</span>
                    <span>{progress.levelProgress}%</span>
                  </div>
                  <Progress value={progress.levelProgress} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Achievements</span>
                    <span>{earnedAchievements.length}/{achievements.length}</span>
                  </div>
                  <Progress value={achievementProgress} className="h-2" />
                </div>
                
                <hr className="my-4" />
                
                <div className="grid grid-cols-2 gap-4">
                  {statsData.map((stat, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center mb-1 space-x-2">
                        {stat.icon}
                        <span className="text-xs text-gray-500">{stat.label}</span>
                      </div>
                      <div className="text-lg font-semibold">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Progress Tab Card */}
          <Card className="md:w-2/3">
            <CardHeader className="pb-2">
              <CardTitle>🌟 Your Fire Safety Progress</CardTitle>
              <CardDescription>See all the stars you've earned!</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="stars">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="stars">My Fire Safety Stars</TabsTrigger>
                  <TabsTrigger value="achievements">All Achievements</TabsTrigger>
                </TabsList>
                
                <TabsContent value="stars" className="space-y-4">
                  <FireSafetyStars />
                </TabsContent>
                
                <TabsContent value="achievements" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        className={`border rounded-lg p-4 relative ${achievement.earned ? 'bg-white' : 'bg-gray-50'}`}
                        whileHover={{ scale: 1.03 }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${achievement.earned ? 'bg-blue-50' : 'bg-gray-100'}`}>
                            <span className="text-2xl">{achievement.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <p className="text-sm text-gray-500">{achievement.description}</p>
                            
                            {/* Progress bar for achievements with progress tracking */}
                            {achievement.progress !== undefined && achievement.maxProgress && (
                              <div className="mt-2">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>Progress</span>
                                  <span>{achievement.progress}/{achievement.maxProgress}</span>
                                </div>
                                <Progress 
                                  value={(achievement.progress / achievement.maxProgress) * 100} 
                                  className="h-1" 
                                />
                              </div>
                            )}
                            
                            {achievement.earned ? (
                              <p className="text-xs text-green-600 mt-1">
                                Earned on {new Date(achievement.earnedAt!).toLocaleDateString()}
                              </p>
                            ) : (
                              <p className="text-xs text-gray-500 mt-1">Not yet earned</p>
                            )}
                          </div>
                        </div>
                        
                        {achievement.earned && (
                          <div className="absolute top-2 right-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}