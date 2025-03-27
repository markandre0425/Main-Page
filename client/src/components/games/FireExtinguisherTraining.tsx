import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";

interface FireExtinguisherTrainingProps {
  previewMode?: boolean;
  gameId?: number;
}

interface PassStep {
  id: string;
  name: string;
  description: string;
  completed: boolean;
}

const passSteps: PassStep[] = [
  { id: "pull", name: "Pull", description: "Pull the pin on the extinguisher", completed: false },
  { id: "aim", name: "Aim", description: "Aim the nozzle at the base of the fire", completed: false },
  { id: "squeeze", name: "Squeeze", description: "Squeeze the handle to release the extinguishing agent", completed: false },
  { id: "sweep", name: "Sweep", description: "Sweep the nozzle from side to side", completed: false },
];

export default function FireExtinguisherTraining({ previewMode = false, gameId }: FireExtinguisherTrainingProps) {
  const { updateUserScore } = useUser();
  const [gameActive, setGameActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<PassStep[]>(passSteps);
  const [extinguisherPosition, setExtinguisherPosition] = useState({ x: 0, y: 0 });
  const [fireIntensity, setFireIntensity] = useState(100);
  const [feedback, setFeedback] = useState("");
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameActive && currentStep >= steps.length) {
      endGame(true);
    }
  }, [currentStep, gameActive, steps.length]);

  const startGame = () => {
    if (previewMode) return;
    
    setGameActive(true);
    setCurrentStep(0);
    setSteps(passSteps.map(step => ({ ...step, completed: false })));
    setFireIntensity(100);
    setFeedback("");
  };

  const endGame = (success: boolean) => {
    setGameActive(false);
    
    // Update score in context/backend
    if (!previewMode && success) {
      updateUserScore("extinguisher-training", 1);
    }

    setFeedback(success ? "Great job! You successfully put out the fire!" : "Try again to complete all steps!");
  };

  const handleStepAction = () => {
    if (!gameActive || previewMode) return;
    
    setSteps(prev => {
      const newSteps = [...prev];
      newSteps[currentStep].completed = true;
      return newSteps;
    });
    
    // Reduce fire intensity as steps are completed
    setFireIntensity(prev => Math.max(0, prev - 25));
    
    // Give feedback
    setFeedback(`Good job with the ${steps[currentStep].name} step!`);
    
    // Move to next step
    setCurrentStep(prev => prev + 1);
  };

  const handleExtinguisherDrag = (event: React.MouseEvent | React.TouchEvent, info: any) => {
    if (gameRef.current) {
      const bounds = gameRef.current.getBoundingClientRect();
      
      // Normalize position to 0-100%
      const x = ((info.point.x - bounds.left) / bounds.width) * 100;
      const y = ((info.point.y - bounds.top) / bounds.height) * 100;
      
      setExtinguisherPosition({ x, y });
      
      // If in the right position for current step, auto-complete it
      if (gameActive && !previewMode && currentStep < steps.length && !steps[currentStep].completed) {
        // This is where we would check if the extinguisher is in the right position
        // For now, we'll just use a simple trigger in the center
        if (Math.abs(x - 50) < 20 && Math.abs(y - 50) < 20) {
          handleStepAction();
        }
      }
    }
  };

  return (
    <div 
      ref={gameRef}
      className={`game-canvas mb-3 bg-gray-800 ${previewMode ? 'cursor-not-allowed' : ''}`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Fire animation */}
        {fireIntensity > 0 && (
          <motion.div 
            className="fire-loader"
            animate={{ scale: fireIntensity / 100 }}
            transition={{ duration: 0.5 }}
          >
            <div></div>
            <div></div>
            <div></div>
          </motion.div>
        )}
        
        {/* P.A.S.S Technique instructions */}
        <div className="absolute top-4 left-0 right-0 text-center">
          <h4 className="text-white font-fredoka">P.A.S.S Technique</h4>
          <div className="flex justify-center space-x-2 mt-2">
            {steps.map((step, index) => (
              <span 
                key={step.id}
                className={`px-2 py-1 rounded text-white text-sm ${
                  gameActive && currentStep === index 
                    ? 'bg-[#FFC107] text-gray-800' 
                    : step.completed 
                      ? 'bg-[#4CAF50]' 
                      : 'bg-white/30'
                }`}
              >
                {step.name}
              </span>
            ))}
          </div>
        </div>
        
        {/* Draggable fire extinguisher */}
        <motion.div
          className="absolute bottom-0 right-0 w-1/3 h-1/3 cursor-grab active:cursor-grabbing"
          drag={gameActive && !previewMode}
          dragConstraints={gameRef}
          onDrag={handleExtinguisherDrag}
          animate={gameActive && !previewMode ? { x: 0, y: 0 } : { x: 0, y: 0 }}
          style={{ 
            left: `${extinguisherPosition.x}%`, 
            top: `${extinguisherPosition.y}%`,
            display: previewMode ? 'block' : undefined
          }}
        >
          <img 
            src="https://placehold.co/200x200/FF5722/FFFFFF/svg?text=Fire+Extinguisher" 
            alt="Fire Extinguisher" 
            className="w-full h-full object-contain"
          />
        </motion.div>
        
        {/* Feedback message */}
        {feedback && !previewMode && (
          <div className="absolute bottom-2 left-2 right-2 bg-white/80 rounded-lg px-4 py-2 text-center text-gray-800">
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
              Start Training
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
