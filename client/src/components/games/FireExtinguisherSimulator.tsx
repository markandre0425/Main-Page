import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';

// PASS technique steps
enum PassStep {
  PULL = 0,
  AIM = 1,
  SQUEEZE = 2,
  SWEEP = 3,
  COMPLETE = 4
}

// Fire types
enum FireType {
  CLASS_A = 'Class A: Ordinary combustibles',
  CLASS_B = 'Class B: Flammable liquids',
  CLASS_C = 'Class C: Electrical equipment'
}

// Extinguisher types
enum ExtinguisherType {
  WATER = 'Water',
  FOAM = 'Foam',
  CO2 = 'Carbon Dioxide',
  DRY_CHEMICAL = 'Dry Chemical'
}

interface FireExtinguisherSimulatorProps {
  previewMode?: boolean;
  onComplete?: () => void;
}

export default function FireExtinguisherSimulator({ 
  previewMode = false,
  onComplete
}: FireExtinguisherSimulatorProps) {
  // User state
  const { userData } = useUser();
  
  // Game state
  const [currentStep, setCurrentStep] = useState<PassStep>(PassStep.PULL);
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedFire, setSelectedFire] = useState<FireType>(FireType.CLASS_A);
  const [selectedExtinguisher, setSelectedExtinguisher] = useState<ExtinguisherType>(ExtinguisherType.WATER);
  const [isCorrectExtinguisher, setIsCorrectExtinguisher] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes timer
  const [timerActive, setTimerActive] = useState(false);
  
  // UI state
  const [extinguisherPosition, setExtinguisherPosition] = useState({ x: 0, y: 0 });
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Check if extinguisher type matches fire type
  const checkExtinguisherMatch = () => {
    if (selectedFire === FireType.CLASS_A) {
      return [ExtinguisherType.WATER, ExtinguisherType.FOAM, ExtinguisherType.DRY_CHEMICAL].includes(selectedExtinguisher);
    } else if (selectedFire === FireType.CLASS_B) {
      return [ExtinguisherType.FOAM, ExtinguisherType.CO2, ExtinguisherType.DRY_CHEMICAL].includes(selectedExtinguisher);
    } else if (selectedFire === FireType.CLASS_C) {
      return [ExtinguisherType.CO2, ExtinguisherType.DRY_CHEMICAL].includes(selectedExtinguisher);
    }
    return false;
  };
  
  // Handle fire type selection
  const handleSelectFire = (fireType: FireType) => {
    setSelectedFire(fireType);
    setIsCorrectExtinguisher(checkExtinguisherMatch());
  };
  
  // Handle extinguisher selection
  const handleSelectExtinguisher = (extType: ExtinguisherType) => {
    setSelectedExtinguisher(extType);
    setIsCorrectExtinguisher(checkExtinguisherMatch());
  };
  
  // Start the simulation
  const startSimulation = () => {
    setShowInstructions(false);
    setTimerActive(true);
    setCurrentStep(PassStep.PULL);
    setScore(0);
    setGameCompleted(false);
  };
  
  // Process the current step
  const processStep = () => {
    if (!isCorrectExtinguisher) {
      setFeedback("You selected the wrong type of extinguisher for this fire. Try again!");
      return;
    }
    
    switch (currentStep) {
      case PassStep.PULL:
        setFeedback("Good! You pulled the pin.");
        setScore(prev => prev + 25);
        setCurrentStep(PassStep.AIM);
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 1000);
        break;
      case PassStep.AIM:
        setFeedback("Good! You aimed at the base of the fire.");
        setScore(prev => prev + 25);
        setCurrentStep(PassStep.SQUEEZE);
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 1000);
        break;
      case PassStep.SQUEEZE:
        setFeedback("Good! You squeezed the handle.");
        setScore(prev => prev + 25);
        setCurrentStep(PassStep.SWEEP);
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 1000);
        break;
      case PassStep.SWEEP:
        setFeedback("Good! You swept from side to side. Fire extinguished!");
        setScore(prev => prev + 25);
        setCurrentStep(PassStep.COMPLETE);
        setShowAnimation(true);
        setTimeout(() => {
          setShowAnimation(false);
          setGameCompleted(true);
          setTimerActive(false);
          if (onComplete) onComplete();
        }, 1500);
        break;
      default:
        break;
    }
  };
  
  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
      setFeedback("Time's up! The fire has spread. Try again.");
      setGameCompleted(true);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timer]);
  
  // Handle mouse/touch movement for extinguisher
  const handlePointerMove = (e: React.PointerEvent) => {
    if (currentStep >= PassStep.AIM && currentStep < PassStep.COMPLETE) {
      const container = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - container.left - 50; // 50 is half the width of extinguisher
      const y = e.clientY - container.top - 50;  // 50 is half the height of extinguisher
      setExtinguisherPosition({ x, y });
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setCurrentStep(PassStep.PULL);
    setShowInstructions(true);
    setFeedback("");
    setScore(0);
    setGameCompleted(false);
    setTimer(120);
    setTimerActive(false);
  };
  
  // Get step instruction text
  const getStepInstruction = () => {
    switch (currentStep) {
      case PassStep.PULL:
        return "PULL the pin to unlock the extinguisher";
      case PassStep.AIM:
        return "AIM the nozzle at the base of the fire";
      case PassStep.SQUEEZE:
        return "SQUEEZE the handle to discharge the extinguishing agent";
      case PassStep.SWEEP:
        return "SWEEP the nozzle from side to side";
      case PassStep.COMPLETE:
        return "Fire extinguished! Well done!";
      default:
        return "";
    }
  };
  
  // Preview mode simplified version
  if (previewMode) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-red-100 p-4 rounded-lg shadow">
        <h3 className="font-fredoka text-xl text-red-600 mb-2">Fire Extinguisher Simulator</h3>
        <p className="text-sm mb-4">Learn the PASS technique: Pull, Aim, Squeeze, Sweep</p>
        <div className="flex justify-center">
          <img 
            src="https://placehold.co/300x200/FF6B35/FFF?text=PASS+Technique" 
            alt="Fire Extinguisher Preview" 
            className="rounded-md mb-3"
          />
        </div>
        <p className="text-xs text-gray-600">Practice using different types of fire extinguishers in various scenarios.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Game header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-4">
        <h2 className="font-fredoka text-2xl">Fire Extinguisher Simulator</h2>
        <p className="text-sm opacity-90">Learn the PASS technique: Pull, Aim, Squeeze, Sweep</p>
      </div>
      
      {/* Score and timer */}
      <div className="flex justify-between items-center bg-gray-100 p-3 border-b">
        <div className="flex items-center">
          <span className="font-bold mr-2">Score:</span>
          <motion.span
            key={score}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {score}/100
          </motion.span>
        </div>
        <div className={`font-mono ${timer < 30 ? 'text-red-600' : ''}`}>
          Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
        </div>
      </div>
      
      {/* Instructions screen */}
      {showInstructions ? (
        <div className="p-6">
          <h3 className="font-fredoka text-xl mb-4">Instructions</h3>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">PASS Technique:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>P</strong>ull the pin</li>
              <li><strong>A</strong>im at the base of the fire</li>
              <li><strong>S</strong>queeze the handle</li>
              <li><strong>S</strong>weep from side to side</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Select Fire Type:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {Object.values(FireType).map(fireType => (
                <div 
                  key={fireType} 
                  className={`p-3 border rounded cursor-pointer ${selectedFire === fireType ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}`}
                  onClick={() => handleSelectFire(fireType as FireType)}
                >
                  <p className="font-medium">{fireType}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Select Extinguisher Type:</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {Object.values(ExtinguisherType).map(extType => (
                <div 
                  key={extType} 
                  className={`p-3 border rounded cursor-pointer ${selectedExtinguisher === extType ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}`}
                  onClick={() => handleSelectExtinguisher(extType as ExtinguisherType)}
                >
                  <p className="font-medium">{extType}</p>
                </div>
              ))}
            </div>
            
            {!isCorrectExtinguisher && (
              <p className="text-red-500 mt-2">
                Warning: This extinguisher type is not suitable for {selectedFire} fires.
              </p>
            )}
          </div>
          
          <button 
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow"
            onClick={startSimulation}
          >
            Start Simulation
          </button>
        </div>
      ) : (
        <>
          {/* Simulation area */}
          <div 
            className="relative h-[400px] bg-gray-200 overflow-hidden"
            onPointerMove={handlePointerMove}
          >
            {/* Fire animation */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
              <div className={`w-48 h-48 flex items-center justify-center ${gameCompleted ? 'opacity-0' : 'animate-flame'}`}>
                <img 
                  src="https://placehold.co/200x200/FF4500/FFF?text=FIRE" 
                  alt="Fire" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            {/* Extinguisher */}
            {currentStep >= PassStep.AIM && (
              <motion.div 
                className="absolute cursor-pointer"
                style={{ 
                  left: extinguisherPosition.x, 
                  top: extinguisherPosition.y,
                  zIndex: 10
                }}
                animate={{ 
                  rotate: currentStep === PassStep.SWEEP ? [0, 15, -15, 15, -15, 0] : 0 
                }}
                transition={{ 
                  duration: 2,
                  repeat: currentStep === PassStep.SWEEP ? Infinity : 0
                }}
              >
                <img 
                  src="https://placehold.co/100x100/FF0000/FFF?text=Extinguisher" 
                  alt="Fire Extinguisher" 
                  className="w-24 h-24 object-contain"
                />
                
                {/* Spray effect */}
                {(currentStep === PassStep.SQUEEZE || currentStep === PassStep.SWEEP) && (
                  <motion.div 
                    className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full opacity-80 z-0"
                    animate={{ 
                      scale: [1, 15],
                      opacity: [0.8, 0],
                      y: [-10, -100]
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                )}
              </motion.div>
            )}
            
            {/* Animation effects */}
            {showAnimation && (
              <motion.div 
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>
          
          {/* Controls */}
          <div className="p-4 bg-white">
            <div className="mb-4">
              <h3 className="font-fredoka text-lg mb-2">Current Step:</h3>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-bold">{getStepInstruction()}</p>
              </div>
            </div>
            
            {feedback && (
              <motion.div 
                className="p-3 mb-4 bg-green-50 border border-green-200 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p>{feedback}</p>
              </motion.div>
            )}
            
            <div className="flex justify-between">
              {currentStep < PassStep.COMPLETE ? (
                <button 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow"
                  onClick={processStep}
                >
                  {currentStep === PassStep.PULL ? "Pull Pin" : 
                   currentStep === PassStep.AIM ? "Aim at Base" :
                   currentStep === PassStep.SQUEEZE ? "Squeeze Handle" : "Sweep Side-to-Side"}
                </button>
              ) : (
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow"
                  onClick={resetGame}
                >
                  {gameCompleted ? "Play Again" : "Continue"}
                </button>
              )}
              
              <button 
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                onClick={resetGame}
              >
                Reset
              </button>
            </div>
          </div>
          
          {/* Game completion modal */}
          {gameCompleted && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div 
                className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
              >
                <h3 className="font-fredoka text-2xl mb-2 text-center">
                  {score === 100 ? "Great Job!" : "Simulation Complete"}
                </h3>
                
                <div className="text-center mb-4">
                  <p className="text-lg font-bold mb-2">Your Score: {score}/100</p>
                  <p className="text-gray-600">
                    {score === 100 
                      ? "Perfect! You've mastered the PASS technique!"
                      : "Keep practicing to improve your fire extinguisher skills."}
                  </p>
                </div>
                
                <div className="mt-6 flex justify-center space-x-3">
                  <button 
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow"
                    onClick={resetGame}
                  >
                    Play Again
                  </button>
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow"
                    onClick={() => {
                      resetGame();
                      setShowInstructions(true);
                    }}
                  >
                    Change Settings
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}