import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  action: string;
  completed: boolean;
}

export default function HeroSection() {
  const { user } = useAuth();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialSteps, setTutorialSteps] = useState<TutorialStep[]>([
    {
      id: 1,
      title: "Missions",
      description: "Complete missions to learn about fire safety in fun, interactive ways",
      action: "Click 'Play Now' to see available missions",
      completed: false
    },
    {
      id: 2,
      title: "Mini-Games",
      description: "Practice your knowledge with educational games",
      action: "Visit the Games section to play mini-games",
      completed: false
    },
    {
      id: 3,
      title: "Badges & Points",
      description: "Earn badges and points to level up as you learn",
      action: "Check the Rewards tab to see available badges",
      completed: false
    },
    {
      id: 4,
      title: "Avatar Customization",
      description: "Customize your character with new outfits",
      action: "Visit the Avatar page to change your look",
      completed: false
    },
    {
      id: 5,
      title: "Share Your Knowledge",
      description: "Share what you've learned with friends and family",
      action: "Complete all tutorial steps to unlock sharing features",
      completed: false
    }
  ]);
  
  const markStepCompleted = (stepId: number) => {
    setTutorialSteps(tutorialSteps.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
  };
  
  const allStepsCompleted = tutorialSteps.every(step => step.completed);
  const progressPercentage = user?.progress || 65;
  const nextLevel = user?.level ? user.level + 1 : 6;
  const pointsNeeded = 500; // This would ideally be calculated based on level
  
  return (
    <section className="bg-gradient-to-br from-[#2196F3] to-blue-700 rounded-2xl p-6 mb-8 text-white shadow-xl">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-6 md:mb-0 text-center md:text-left">
          <motion.h2 
            className="font-bangers text-3xl md:text-5xl mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome, {user?.displayName || user?.username || 'Hero'}!
          </motion.h2>
          <p className="font-nunito text-lg md:text-xl mb-4 max-w-lg">The city needs your help to learn about fire safety!</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <Link href="/mission/1">
              <motion.button 
                className="game-button bg-[#FFC107] hover:bg-yellow-500 text-gray-800 px-6 py-3 rounded-xl font-fredoka text-lg shadow-md transform transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Using SVG instead of font-awesome for better load time */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Play Now
              </motion.button>
            </Link>
            <Link href="/leaderboard">
              <motion.button 
                className="game-button bg-[#FF5722] hover:bg-[#E91E63] text-white px-6 py-3 rounded-xl font-fredoka text-lg shadow-md transform transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Using SVG instead of font-awesome for better load time */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2">
                  <path d="M3 3v18h18"></path>
                  <path d="M18.7 8l-5.1 5.1-2.8-2.7L7 14.3"></path>
                </svg>
                Leaderboard
              </motion.button>
            </Link>
            <button 
              onClick={() => setShowTutorial(!showTutorial)}
              className="game-button bg-white/30 hover:bg-white/40 text-white px-6 py-3 rounded-xl font-fredoka text-lg shadow-md"
              aria-label={showTutorial ? "Hide tutorial" : "Show tutorial"}
              aria-expanded={showTutorial}
            >
              {/* Using SVG instead of font-awesome for better load time */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2">
                <path d="M12 22c-7 0-7-5-7-8V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v11c0 3 0 8-5 8Z"></path>
                <path d="M9 10h6"></path>
                <path d="M12 7v6"></path>
                <path d="M22 19a5 5 0 0 0-9.9 0"></path>
              </svg>
              Tutorial
            </button>
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
              src={`https://placehold.co/400x400/E91E63/FFFFFF/svg?text=${user?.displayName || user?.username || 'Hero'}`}
              alt={`${user?.displayName || user?.username || 'Hero'} Character`} 
              className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full border-4 border-white shadow-2xl" 
            />
            <div className="absolute -top-2 -right-2 bg-[#4CAF50] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
              <span className="font-fredoka text-lg">{user?.level || 5}</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Interactive Tutorial section */}
      {showTutorial && (
        <motion.div 
          className="mt-4 bg-white/20 rounded-xl p-6 shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-fredoka text-xl">Welcome to Fire Safety Adventure, {user?.displayName || user?.username || 'Hero'}!</h3>
            <button 
              onClick={() => setShowTutorial(false)}
              className="text-white/80 hover:text-white"
              aria-label="Close tutorial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-white font-nunito">Complete the following steps to get started:</p>
            <div className="w-full bg-white/20 rounded-full h-4 mt-2 overflow-hidden">
              <motion.div 
                className="bg-[#4CAF50] h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(tutorialSteps.filter(s => s.completed).length / tutorialSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
            <p className="text-xs text-white/80 mt-1">
              {tutorialSteps.filter(s => s.completed).length} of {tutorialSteps.length} completed
            </p>
          </div>
          
          <div className="space-y-4">
            {tutorialSteps.map((step) => (
              <div 
                key={step.id}
                className={`p-3 rounded-lg transition-all ${step.completed 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'bg-white/10 border border-white/20'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                    step.completed ? 'bg-green-500' : 'bg-white/20'
                  }`}>
                    {step.completed ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-fredoka text-lg">{step.title}</h4>
                    <p className="text-sm text-white/80 mb-2">{step.description}</p>
                    
                    {!step.completed && (
                      <>
                        <div className="flex items-center text-sm bg-white/10 p-2 rounded mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"></path>
                            <circle cx="17" cy="7" r="5"></circle>
                          </svg>
                          <span>{step.action}</span>
                        </div>
                        
                        {/* Only show action buttons for steps that match their paths */}
                        {step.id === 1 && (
                          <Link href="/mission/1">
                            <button 
                              className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded"
                              onClick={() => markStepCompleted(step.id)}
                            >
                              Go to Missions
                            </button>
                          </Link>
                        )}
                        
                        {step.id === 2 && (
                          <Link href="/games">
                            <button 
                              className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded"
                              onClick={() => markStepCompleted(step.id)}
                            >
                              Go to Games
                            </button>
                          </Link>
                        )}
                        
                        {step.id === 3 && (
                          <Link href="/rewards">
                            <button 
                              className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded"
                              onClick={() => markStepCompleted(step.id)}
                            >
                              Go to Rewards
                            </button>
                          </Link>
                        )}
                        
                        {step.id === 4 && (
                          <Link href="/avatar">
                            <button 
                              className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded"
                              onClick={() => markStepCompleted(step.id)}
                            >
                              Go to Avatar
                            </button>
                          </Link>
                        )}
                        
                        {step.id === 5 && tutorialSteps.slice(0, 4).every(s => s.completed) && (
                          <button 
                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded"
                            onClick={() => markStepCompleted(step.id)}
                          >
                            Unlock Sharing
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {allStepsCompleted && (
            <motion.div 
              className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h4 className="font-fredoka text-xl mb-2">🎉 Tutorial Complete! 🎉</h4>
              <p className="text-white mb-3">Great job, {user?.displayName || user?.username || 'Hero'}! You've learned the basics of the Fire Safety Adventure!</p>
              <Link href="/mission/1">
                <button className="game-button bg-[#FFC107] hover:bg-yellow-500 text-gray-800 px-6 py-2 rounded-xl font-fredoka shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  Start Your Adventure
                </button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      )}
      
      <div className="mt-6 bg-white/10 rounded-xl p-4">
        <h3 className="font-fredoka text-xl mb-2">Your Progress</h3>
        <div className="w-full bg-white/20 rounded-full h-6 overflow-hidden">
          <motion.div 
            className="bg-[#FFC107] h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          ></motion.div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between mt-2 text-sm">
          <span>{progressPercentage}% to Level {nextLevel}</span>
          <span>{user?.points || 350}/{pointsNeeded} points</span>
        </div>
      </div>
    </section>
  );
}
