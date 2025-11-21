import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function HeroSection() {
  const { user } = useAuth();
  const [isEditingHero, setIsEditingHero] = useState(false);
  const [heroName, setHeroName] = useState("Fire Hero");
  
  // Load saved hero name on component mount
  useEffect(() => {
    const savedHeroName = localStorage.getItem('heroName');
    if (savedHeroName) {
      setHeroName(savedHeroName);
    }
  }, []);
  

  const handleSaveHeroName = () => {
    setIsEditingHero(false);
    // could save to localStorage here if I want persistence
    localStorage.setItem('heroName', heroName);
  };

  const handleCancelEdit = () => {
    setIsEditingHero(false);
    setHeroName("Fire Hero"); // Reset to default
  };
  
  const progressPercentage = user?.progress || 65;
  const nextLevel = user?.level ? user.level + 1 : 6;
  const pointsNeeded = 500;
  
  return (
    <section className="bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] rounded-2xl p-6 mb-8 text-white shadow-xl">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-6 md:mb-0 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
            {isEditingHero ? (
              <div className="flex items-center gap-2">
                <Input
                  value={heroName}
                  onChange={(e) => setHeroName(e.target.value)}
                  className="font-bangers text-2xl md:text-4xl bg-white/20 border-white/30 text-white placeholder-white/70"
                  placeholder="Enter hero name"
                />
                <Button 
                  onClick={handleSaveHeroName}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  ✓
                </Button>
                <Button 
                  onClick={handleCancelEdit}
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  ✕
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <motion.h2 
                  className="font-bangers text-3xl md:text-5xl lg:text-6xl flex items-center gap-2 flex-wrap"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  🚒 Hi {heroName}! 🚒
                  <Button 
                    onClick={() => setIsEditingHero(true)}
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white text-2xl md:text-4xl p-1"
                    title="Edit hero name"
                  >
                    ✏️
                  </Button>
                </motion.h2>
              </div>
            )}
          </div>
          <p className="font-nunito text-xl md:text-2xl mb-6 max-w-lg">Let's learn about fire safety together!</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Link href="/games">
              <motion.button 
                className="game-button bg-[#FFD93D] hover:bg-yellow-400 text-gray-800 px-8 py-4 rounded-xl font-fredoka text-xl shadow-md transform transition min-h-[60px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎮 Play Games
              </motion.button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <motion.div 
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img 
              src={`https://placehold.co/400x400/4ECDC4/FFFFFF/svg?text=${encodeURIComponent(heroName)}`}
              alt={`${heroName} Character`} 
              className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full border-4 border-white shadow-2xl" 
            />
            <div className="absolute -top-2 -right-2 bg-[#FF6B6B] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
              <span className="font-fredoka text-2xl">{user?.level || 1}</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="mt-6 bg-white/10 rounded-xl p-4">
        <h3 className="font-fredoka text-xl mb-2">Your Stars ⭐</h3>
        <div className="w-full bg-white/20 rounded-full h-6 overflow-hidden">
          <motion.div 
            className="bg-[#FFD93D] h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          ></motion.div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between mt-2 text-sm">
          <span>{progressPercentage}% to Level {nextLevel}</span>
          <span>{user?.points || 50}/{pointsNeeded} stars</span>
        </div>
      </div>
    </section>
  );
}
