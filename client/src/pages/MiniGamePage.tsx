import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GameNav from "@/components/layout/GameNav";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Award, Star } from "lucide-react";
import { useUser } from "@/context/UserContext";

// Import all game components
import SpotTheHazard from "@/components/games/SpotTheHazard";
import FireExtinguisherTraining from "@/components/games/FireExtinguisherTraining";
import FireExtinguisherSimulator from "@/components/games/FireExtinguisherSimulator";
import HazardIdentificationGame from "@/components/games/HazardIdentificationGame";
import EscapePlanDesigner from "@/components/games/EscapePlanDesigner";
import FireSafetyQuiz from "@/components/games/FireSafetyQuiz";

import { MiniGame } from "@shared/schema";
import { miniGames } from "@/lib/gameData";

export default function MiniGamePage() {
  const { id } = useParams<{ id: string }>();
  const [location, navigate] = useLocation();
  const [game, setGame] = useState<MiniGame | null>(null);
  const [customGame, setCustomGame] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const { userData } = useUser();

  useEffect(() => {
    // Check if this is a route for one of our custom games
    const path = location.split('/').pop();
    if (
      path === 'fire-extinguisher-simulator' || 
      path === 'hazard-identification' || 
      path === 'escape-plan-designer' || 
      path === 'fire-safety-quiz'
    ) {
      setCustomGame(path);
      return;
    }
    
    // Otherwise, try to find it in the miniGames collection
    const foundGame = miniGames.find(g => g.id === Number(id));
    
    if (foundGame) {
      setGame(foundGame);
      
      // If it's an external game, redirect to the external URL
      if (foundGame.isExternal && foundGame.externalUrl) {
        window.open(foundGame.externalUrl, '_blank');
        // Navigate back to games page after opening external link
        navigate("/games");
      }
    } else {
      navigate("/games");
    }
  }, [id, location, navigate]);

  // Handle game completion
  const handleGameComplete = (achievedScore: number) => {
    setGameCompleted(true);
    setScore(achievedScore);
    
    // In a real app, you would save the score to the user's profile
    toast({
      title: "Game Completed!",
      description: `You scored ${achievedScore} points. Great job!`,
    });
  };

  // Render the legacy game components
  const renderLegacyGame = () => {
    if (!game) {
      return <div className="p-6 text-center">Loading game...</div>;
    }
    
    switch (game.type) {
      case "spot-hazard":
        return <SpotTheHazard gameId={game.id} />;
      case "extinguisher-training":
        return <FireExtinguisherTraining gameId={game.id} />;
      default:
        return <div>Game type not supported</div>;
    }
  };
  
  // Render our new mini game components
  const renderCustomGame = () => {
    if (!customGame) {
      return <div className="p-6 text-center">Loading game...</div>;
    }
    
    switch (customGame) {
      case 'fire-extinguisher-simulator':
        return (
          <FireExtinguisherSimulator 
            onComplete={() => handleGameComplete(100)} 
          />
        );
      case 'hazard-identification':
        return (
          <HazardIdentificationGame 
            onComplete={() => handleGameComplete(85)} 
          />
        );
      case 'escape-plan-designer':
        return (
          <EscapePlanDesigner 
            onComplete={() => handleGameComplete(90)} 
          />
        );
      case 'fire-safety-quiz':
        return (
          <FireSafetyQuiz 
            onComplete={() => handleGameComplete(75)} 
          />
        );
      default:
        return (
          <div className="p-6 text-center">
            <h2 className="text-2xl text-red-600 mb-4">Game Not Found</h2>
            <p>Sorry, the game you're looking for doesn't exist.</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => navigate('/games')}
            >
              Back to Games
            </button>
          </div>
        );
    }
  };
  
  // Get the game title
  const getGameTitle = () => {
    if (game) return game.title;
    
    switch (customGame) {
      case 'fire-extinguisher-simulator': return "Fire Extinguisher Simulator";
      case 'hazard-identification': return "Hazard Identification Game";
      case 'escape-plan-designer': return "Escape Plan Designer";
      case 'fire-safety-quiz': return "Fire Safety Quiz";
      default: return "Mini Game";
    }
  };
  
  // Get the game description
  const getGameDescription = () => {
    if (game) return game.description;
    
    switch (customGame) {
      case 'fire-extinguisher-simulator': 
        return "Learn the PASS technique and practice using different types of fire extinguishers.";
      case 'hazard-identification': 
        return "Identify fire hazards in different rooms and learn how to prevent dangerous situations.";
      case 'escape-plan-designer': 
        return "Create and practice a personalized fire escape plan for your home or building.";
      case 'fire-safety-quiz': 
        return "Test your knowledge with interactive quizzes about fire prevention and safety procedures.";
      default: return "";
    }
  };
  
  // Loading state
  if (!game && !customGame) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <GameNav />
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading game...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <GameNav />
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button 
                className="mr-4 p-2 rounded-full hover:bg-gray-100"
                onClick={() => navigate('/games')}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="font-bangers text-4xl text-gray-800">{getGameTitle()}</h1>
            </div>
            
            {userData && (
              <div className="bg-amber-50 px-4 py-2 rounded-lg border border-amber-200 flex items-center">
                <Star className="w-5 h-5 text-amber-500 mr-2" />
                <span className="font-medium">Your Best: {userData?.level || 0} points</span>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="p-6">
              <p className="text-gray-600 mb-6">{getGameDescription()}</p>
              
              <div className="game-canvas bg-gray-100 rounded-xl overflow-hidden mb-6">
                {game ? renderLegacyGame() : renderCustomGame()}
              </div>
            </div>
          </div>
        </div>
        
        {gameCompleted && (
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center mb-4">
              <Award className="w-8 h-8 text-amber-500 mr-3" />
              <h2 className="font-bangers text-2xl text-gray-800">Achievement Unlocked!</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-fredoka text-lg text-gray-800 mb-3">Game Complete</h3>
                <p className="text-gray-700 mb-2">
                  Congratulations! You've completed the {getGameTitle()}.
                </p>
                <p className="text-gray-700">
                  Your score: <span className="font-bold">{score} points</span>
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-fredoka text-lg text-gray-800 mb-3">Next Steps</h3>
                <div className="space-y-2">
                  <button 
                    className="w-full py-2 px-4 rounded bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => {
                      setGameCompleted(false);
                      // This would reset the game in a real implementation
                    }}
                  >
                    Play Again
                  </button>
                  
                  <button 
                    className="w-full py-2 px-4 rounded bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => navigate('/games')}
                  >
                    Try Another Game
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
