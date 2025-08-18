import { useAuth } from "@/hooks/use-auth";
import { ProgressMap } from "@/components/progress/ProgressMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Award, BookOpen, Medal, Star, Flame, Clock, Target, Zap } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Mock achievements data (would come from the backend in a real app)
const achievementsList = [
  {
    id: 1,
    title: "Fire Starter",
    description: "Completed your first fire safety mission",
    icon: <Flame className="h-8 w-8 text-orange-500" />,
    earned: true,
    date: "2023-09-15"
  },
  {
    id: 2,
    title: "Quick Learner",
    description: "Completed 3 missions in a single day",
    icon: <Zap className="h-8 w-8 text-yellow-500" />,
    earned: true,
    date: "2023-09-20"
  },
  {
    id: 3,
    title: "Knowledge Guardian",
    description: "Scored 100% on a fire safety quiz",
    icon: <BookOpen className="h-8 w-8 text-blue-500" />,
    earned: false,
    date: null
  },
  {
    id: 4,
    title: "Perfect Planner",
    description: "Completed fire safety training",
    icon: <Target className="h-8 w-8 text-green-500" />,
    earned: false,
    date: null
  },
  {
    id: 5,
    title: "Safety Champion",
    description: "Completed all basic fire safety training",
    icon: <Medal className="h-8 w-8 text-purple-500" />,
    earned: false,
    date: null
  }
];

// Mock statistics data
const statsData = [
  { label: "Missions Completed", value: 3, icon: <Target className="h-5 w-5 text-blue-500" /> },
  { label: "Quizzes Taken", value: 2, icon: <BookOpen className="h-5 w-5 text-purple-500" /> },
  { label: "Games Played", value: 5, icon: <Flame className="h-5 w-5 text-red-500" /> },
  { label: "Achievements Earned", value: 2, icon: <Award className="h-5 w-5 text-yellow-500" /> },
  { label: "Total Time Spent", value: "3h 45m", icon: <Clock className="h-5 w-5 text-green-500" /> },
  { label: "Highest Score", value: "85%", icon: <Star className="h-5 w-5 text-orange-500" /> }
];

export default function ProfilePage() {
  const { user } = useAuth();
  const earnedAchievements = achievementsList.filter(a => a.earned);
  const achievementProgress = Math.round((earnedAchievements.length / achievementsList.length) * 100);
  
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
                    <span>{user.progress || 65}%</span>
                  </div>
                  <Progress value={user.progress || 65} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Achievements</span>
                    <span>{earnedAchievements.length}/{achievementsList.length}</span>
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
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>Track your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="journey">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="journey">Learning Journey</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>
                
                <TabsContent value="journey" className="space-y-4">
                  <ProgressMap />
                </TabsContent>
                
                <TabsContent value="achievements" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievementsList.map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        className={`border rounded-lg p-4 relative ${achievement.earned ? 'bg-white' : 'bg-gray-50'}`}
                        whileHover={{ scale: 1.03 }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${achievement.earned ? 'bg-blue-50' : 'bg-gray-100'}`}>
                            {achievement.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <p className="text-sm text-gray-500">{achievement.description}</p>
                            {achievement.earned ? (
                              <p className="text-xs text-green-600 mt-1">Earned on {achievement.date}</p>
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