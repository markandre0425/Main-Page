import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Gamepad2, BookOpen, HelpCircle, Home, Calendar } from "lucide-react";
import { useLocation } from "wouter";

export function FireSafetyStars() {
  const { user, isGuest } = useAuth();
  const [, setLocation] = useLocation();
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  // Load recent activity from localStorage
  useEffect(() => {
    const savedActivity = localStorage.getItem('recentActivity');
    if (savedActivity) {
      setRecentActivity(JSON.parse(savedActivity));
    }
  }, []);

  // Daily fire safety tips
  const dailyTips = [
    "🔥 Fire is hot! Never touch fire or play with matches.",
    "🛑 If your clothes catch fire: Stop, Drop, and Roll!",
    "🚨 Call 911 if there's a fire emergency.",
    "👨‍🚒 Firefighters are your friends and helpers.",
    "🚪 Always know two ways out of every room.",
    "📱 Never hide during a fire - get out and stay out!",
    "🔥 Smoke rises, so stay low to the ground.",
    "🏠 Practice your family's fire escape plan.",
    "🔌 Don't play with electrical outlets or cords.",
    "🍳 Ask a grown-up for help in the kitchen."
  ];

  // Get today's tip based on date
  const today = new Date().getDate();
  const todaysTip = dailyTips[today % dailyTips.length];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'games':
        setLocation('/games');
        break;
      case 'quiz':
        setLocation('/games/fire-safety-quiz');
        break;
      case 'tips':
        setLocation('/safety-tips');
        break;
      case 'home':
        setLocation('/');
        break;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 w-full">
      {/* Welcome Header */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full mb-4 inline-block">
            <Star className="h-12 w-12" />
          </div>
        </motion.div>
        
        <h2 className="text-3xl font-bangers text-gray-800 mb-2">
          🌟 Welcome! 🌟
        </h2>
        <p className="text-lg text-gray-600 font-fredoka">
          {isGuest ? "Great job learning about fire safety!" : `Welcome back, ${user?.displayName || user?.username}!`}
        </p>
      </div>

      {/* Today's Safety Tip */}
      <Card className="mb-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300">
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <Calendar className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-bangers text-orange-800">Today's Safety Tip</h3>
          </div>
          <p className="text-gray-700 font-fredoka text-lg">{todaysTip}</p>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <Card className="mb-6 bg-white">
          <CardContent className="p-4">
            <h3 className="text-lg font-bangers text-gray-800 mb-3 flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              What You've Done Recently
            </h3>
            <div className="space-y-2">
              {recentActivity.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex items-center text-gray-600 font-fredoka">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  {activity}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="bg-white">
        <CardContent className="p-4">
          <h3 className="text-lg font-bangers text-gray-800 mb-4 text-center">
            🎮 What would you like to do?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleQuickAction('games')}
              className="h-16 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-fredoka text-lg"
            >
              <Gamepad2 className="h-6 w-6 mr-2" />
              Play Games
            </Button>
            <Button
              onClick={() => handleQuickAction('quiz')}
              className="h-16 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-fredoka text-lg"
            >
              <HelpCircle className="h-6 w-6 mr-2" />
              Take Quiz
            </Button>
            <Button
              onClick={() => handleQuickAction('tips')}
              className="h-16 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-fredoka text-lg"
            >
              <BookOpen className="h-6 w-6 mr-2" />
              Read Tips
            </Button>
            <Button
              onClick={() => handleQuickAction('home')}
              className="h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-fredoka text-lg"
            >
              <Home className="h-6 w-6 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Encouragement Message */}
      <div className="text-center mt-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-xl"
        >
          <h3 className="text-xl font-bangers text-gray-800 mb-2">
            🏆 You're a Fire Safety Hero! 🏆
          </h3>
          <p className="text-gray-600 font-fredoka">
            Keep learning and practicing fire safety! You're making yourself and your family safer every day!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
