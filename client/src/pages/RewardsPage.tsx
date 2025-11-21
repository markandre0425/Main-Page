import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// import GameNav from "@/components/layout/GameNav"; // Removed - now integrated into Header
import { useUser } from "@/context/UserContext";
import { Badge } from "@shared/schema";
import { badges } from "@/lib/gameData";
import { motion } from "framer-motion";

export default function RewardsPage() {
  const { userData } = useUser();
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [earnedCount, setEarnedCount] = useState(0);
  const userEarnedBadges = userData.earnedBadges || [];

  useEffect(() => {
    // In a real app, we would call an API to get all badges
    const processedBadges = badges.map(badge => ({
      ...badge,
      earned: userEarnedBadges.includes(badge.id)
    }));
    
    setAllBadges(processedBadges);
    setEarnedCount(processedBadges.filter(b => b.earned).length);
  }, [userData.earnedBadges]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-6">
            <h1 className="font-bangers text-3xl text-gray-800 mb-2">Your Rewards</h1>
            <p className="text-gray-600">Collect badges by completing missions and playing mini-games!</p>
          </div>
          
          <div className="bg-gradient-to-r from-[#2196F3] to-blue-700 rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="font-fredoka text-2xl mb-2">Badge Collection</h2>
                <p className="opacity-80">You've earned {earnedCount} out of {allBadges.length} badges!</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="bg-white/20 rounded-xl px-4 py-2">
                  <div className="flex items-center">
                    <i className="fas fa-medal text-[#FFC107] text-2xl mr-3"></i>
                    <span className="font-fredoka text-xl">{earnedCount} Badges</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {allBadges.map((badge) => (
              <motion.div 
                key={badge.id}
                className={`bg-white rounded-xl shadow-md p-4 text-center ${!badge.earned ? 'opacity-60' : ''}`}
                whileHover={{ scale: 1.05, rotate: badge.earned ? 5 : 0 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`${badge.earned ? badge.color : 'bg-gray-300'} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4`}>
                  <i className={`fas ${badge.earned ? badge.icon : 'fa-question'} text-white text-3xl`}></i>
                </div>
                <h3 className="font-fredoka text-lg text-gray-800 mb-1">{badge.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{badge.earned ? badge.description : 'Badge locked'}</p>
                {badge.earned ? (
                  <div className="bg-[#4CAF50]/10 text-[#4CAF50] rounded-full px-3 py-1 text-sm font-medium">
                    <i className="fas fa-check-circle mr-1"></i> Earned
                  </div>
                ) : (
                  <div className="bg-gray-100 text-gray-500 rounded-full px-3 py-1 text-sm">
                    <i className="fas fa-lock mr-1"></i> {badge.requirement}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 bg-[#FFC107]/10 border border-[#FFC107] rounded-xl p-4 text-center">
            <h3 className="font-fredoka text-lg text-gray-800 mb-2">Keep Learning and Earning!</h3>
            <p className="text-gray-600">Complete more fire safety missions to earn new badges and rewards.</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
