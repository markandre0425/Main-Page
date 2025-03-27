import { useState, useEffect } from "react";
import { Badge } from "@shared/schema";
import { useUser } from "@/context/UserContext";
import { badges } from "@/lib/gameData";
import { motion } from "framer-motion";
import { Link } from "wouter";

// Extended badge type with earned property
interface BadgeWithEarned extends Badge {
  earned: boolean;
}

export default function BadgesCollection() {
  const { userData } = useUser();
  const [userBadges, setUserBadges] = useState<BadgeWithEarned[]>([]);
  const userEarnedBadges = userData.earnedBadges || [];

  useEffect(() => {
    // In a real app, we would call an API to get the badges
    // For now, process the badges based on hard-coded data
    const processedBadges = badges.map(badge => ({
      ...badge,
      earned: userEarnedBadges.includes(badge.id)
    })).slice(0, 6); // Display only 6 badges
    
    setUserBadges(processedBadges);
  }, [userEarnedBadges]);

  return (
    <section className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="font-bangers text-2xl text-gray-800 mb-4">Your Badges</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {userBadges.map((badge) => (
          <motion.div 
            key={badge.id}
            className="flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div 
              className={`${badge.earned ? badge.color : 'bg-gray-300'} rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-2 ${!badge.earned ? 'opacity-50' : ''}`}
              title={badge.description}
            >
              <i className={`fas ${badge.earned ? badge.icon : 'fa-question'} text-white text-xl sm:text-2xl`}></i>
            </div>
            <span className="text-center text-xs sm:text-sm font-nunito truncate max-w-full">
              {badge.earned ? badge.name : 'Locked'}
            </span>
          </motion.div>
        ))}
      </div>
      <Link href="/rewards">
        <button className="w-full game-button bg-[#FF5722] hover:bg-orange-600 text-white py-2 rounded-lg font-fredoka mt-4">
          View All Badges
        </button>
      </Link>
    </section>
  );
}
