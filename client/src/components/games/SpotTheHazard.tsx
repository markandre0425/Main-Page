import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { hazards } from "@/lib/gameData";
import { useUser } from "@/context/UserContext";

interface SpotTheHazardProps {
  previewMode?: boolean;
  gameId?: number;
}

interface Hazard {
  id: number;
  name: string;
  description: string;
  location: string;
  xPosition: number;
  yPosition: number;
  found?: boolean;
}

export default function SpotTheHazard({ previewMode = false, gameId }: SpotTheHazardProps) {
  const { updateUserScore } = useUser();
  const [gameHazards, setGameHazards] = useState<Hazard[]>([]);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [feedback, setFeedback] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // In a real app, we would fetch hazards specific to the game
    if (gameId) {
      const gameSpecificHazards = hazards
        .filter(h => h.location === "living-room")
        .map(h => ({ ...h, found: false }));
      
      setGameHazards(gameSpecificHazards);
    }
  }, [gameId]);

  useEffect(() => {
    if (gameActive && !previewMode && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameActive, previewMode]);

  const startGame = () => {
    if (previewMode) return;
    
    setGameActive(true);
    setScore(0);
    setTimeLeft(60);
    setGameHazards(gameHazards.map(h => ({ ...h, found: false })));
    setFeedback("");
  };

  const endGame = () => {
    setGameActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Update user score in context/backend
    if (!previewMode && score > 0) {
      updateUserScore("spot-hazard", score);
    }

    setFeedback(`Game over! You found ${score} hazards.`);
  };

  const handleHazardClick = (hazardId: number) => {
    if (!gameActive && !previewMode) return;
    
    setGameHazards(prev => 
      prev.map(h => {
        if (h.id === hazardId && !h.found) {
          setScore(s => s + 1);
          setFeedback(`Great job! You found a ${h.name}.`);
          return { ...h, found: true };
        }
        return h;
      })
    );
  };

  return (
    <div className={`game-canvas mb-3 bg-gray-100 ${previewMode ? 'cursor-not-allowed' : ''}`}>
      <div className="relative w-full h-full">
        <img 
          src="https://placehold.co/500x300/DDDDDD/999999/svg?text=Living+Room+Scene" 
          alt="Living Room Scene" 
          className="w-full h-full object-cover" 
        />
        
        {/* Game UI overlay */}
        {!previewMode && (
          <div className="absolute top-2 left-2 right-2 flex justify-between">
            <div className="bg-white/80 rounded-full px-3 py-1 text-sm font-bold">
              Score: {score}/{gameHazards.length}
            </div>
            {gameActive && (
              <div className="bg-white/80 rounded-full px-3 py-1 text-sm font-bold">
                Time: {timeLeft}s
              </div>
            )}
          </div>
        )}
        
        {/* Hazard markers */}
        {gameHazards.map((hazard) => (
          <motion.div 
            key={hazard.id}
            className={`absolute bg-[#FFC107] rounded-full w-8 h-8 flex items-center justify-center cursor-pointer ${hazard.found ? 'bg-[#4CAF50]' : 'animate-pulse'}`}
            style={{ 
              top: `${hazard.yPosition}%`, 
              left: `${hazard.xPosition}%`,
              opacity: hazard.found ? 0.7 : 1
            }}
            onClick={() => handleHazardClick(hazard.id)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className={`fas ${hazard.found ? 'fa-check' : 'fa-exclamation'} text-gray-800`}></i>
          </motion.div>
        ))}
        
        {/* Feedback message */}
        {feedback && !previewMode && (
          <div className="absolute bottom-2 left-2 right-2 bg-white/80 rounded-lg px-4 py-2 text-center">
            {feedback}
          </div>
        )}
        
        {/* Game controls */}
        {!gameActive && !previewMode && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <motion.button
              className="bg-[#4CAF50] text-white px-6 py-3 rounded-xl font-fredoka text-lg shadow-md"
              onClick={startGame}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Start Game
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
