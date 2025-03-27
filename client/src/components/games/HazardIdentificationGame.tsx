import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';

// Room types
enum RoomType {
  KITCHEN = 'kitchen',
  LIVING_ROOM = 'living_room',
  BEDROOM = 'bedroom',
  BATHROOM = 'bathroom',
  GARAGE = 'garage'
}

// Hazard interface
interface Hazard {
  id: number;
  name: string;
  description: string;
  solution: string;
  x: number;
  y: number;
  width: number;
  height: number;
  found: boolean;
}

// Room config with hazards
interface RoomConfig {
  name: string;
  backgroundImage: string;
  hazards: Hazard[];
}

interface HazardIdentificationGameProps {
  previewMode?: boolean;
  onComplete?: () => void;
}

export default function HazardIdentificationGame({
  previewMode = false,
  onComplete
}: HazardIdentificationGameProps) {
  // References
  const gameAreaRef = useRef<HTMLDivElement>(null);
  
  // User state
  const { userData } = useUser();
  
  // Game state
  const [currentRoom, setCurrentRoom] = useState<RoomType>(RoomType.KITCHEN);
  const [showInstructions, setShowInstructions] = useState(true);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [selectedHazard, setSelectedHazard] = useState<Hazard | null>(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(180); // 3 minutes
  const [timerActive, setTimerActive] = useState(false);
  
  // UI state
  const [showHint, setShowHint] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [feedback, setFeedback] = useState('');
  
  // Room configurations - in a real app this would come from a database
  const roomConfigs: Record<RoomType, RoomConfig> = {
    [RoomType.KITCHEN]: {
      name: 'Kitchen',
      backgroundImage: 'https://placehold.co/800x600/E5A25A/FFF?text=Kitchen+Scene',
      hazards: [
        {
          id: 1,
          name: 'Unattended Stove',
          description: 'The stove has been left on and unattended, which is a major fire hazard.',
          solution: 'Never leave cooking unattended. Turn off the stove when not in use.',
          x: 20,
          y: 30,
          width: 15,
          height: 10,
          found: false
        },
        {
          id: 2,
          name: 'Flammable Items Near Stove',
          description: 'Paper towels and other flammable items are too close to the heat source.',
          solution: 'Keep flammable items at least 3 feet away from any heat source.',
          x: 40,
          y: 35,
          width: 10,
          height: 8,
          found: false
        },
        {
          id: 3,
          name: 'Overloaded Electrical Outlet',
          description: 'Too many appliances are plugged into a single outlet, creating an electrical hazard.',
          solution: 'Use only one high-wattage appliance per outlet and consider using a power strip with a circuit breaker.',
          x: 75,
          y: 60,
          width: 10,
          height: 8,
          found: false
        },
        {
          id: 4,
          name: 'Grease Buildup',
          description: 'Accumulated grease on the stovetop can easily catch fire.',
          solution: 'Clean cooking surfaces regularly to prevent grease buildup.',
          x: 30,
          y: 45,
          width: 12,
          height: 5,
          found: false
        }
      ]
    },
    [RoomType.LIVING_ROOM]: {
      name: 'Living Room',
      backgroundImage: 'https://placehold.co/800x600/8A9A5B/FFF?text=Living+Room+Scene',
      hazards: [
        {
          id: 1,
          name: 'Blocked Fire Exit',
          description: 'Furniture is blocking the quickest exit from the room.',
          solution: 'Keep all exits clear of furniture and obstructions.',
          x: 80,
          y: 50,
          width: 12,
          height: 30,
          found: false
        },
        {
          id: 2,
          name: 'Frayed Electrical Cord',
          description: 'The lamp has a frayed cord that could cause a spark.',
          solution: 'Replace damaged cords immediately; never use frayed or exposed wires.',
          x: 25,
          y: 60,
          width: 8,
          height: 5,
          found: false
        },
        {
          id: 3,
          name: 'Candles Near Curtains',
          description: 'Lit candles are placed too close to flammable curtains.',
          solution: 'Keep candles at least 12 inches away from anything that can burn.',
          x: 65,
          y: 30,
          width: 10,
          height: 10,
          found: false
        }
      ]
    },
    [RoomType.BEDROOM]: {
      name: 'Bedroom',
      backgroundImage: 'https://placehold.co/800x600/9A8A5B/FFF?text=Bedroom+Scene',
      hazards: [
        {
          id: 1,
          name: 'Space Heater Near Bedding',
          description: 'A space heater is placed too close to flammable bedding.',
          solution: 'Keep space heaters at least 3 feet away from flammable materials.',
          x: 30,
          y: 70,
          width: 12,
          height: 8,
          found: false
        },
        {
          id: 2,
          name: 'Covered Smoke Detector',
          description: 'The smoke detector has been covered, preventing it from working properly.',
          solution: 'Never cover or disable smoke detectors. Test them monthly.',
          x: 50,
          y: 10,
          width: 8,
          height: 5,
          found: false
        },
        {
          id: 3,
          name: 'Lamp With Wrong Bulb Wattage',
          description: 'The lamp has a bulb with higher wattage than recommended.',
          solution: 'Always use the recommended bulb wattage for lamps and fixtures.',
          x: 15,
          y: 50,
          width: 10,
          height: 15,
          found: false
        }
      ]
    },
    [RoomType.BATHROOM]: {
      name: 'Bathroom',
      backgroundImage: 'https://placehold.co/800x600/5B8A9A/FFF?text=Bathroom+Scene',
      hazards: [
        {
          id: 1,
          name: 'Hair Dryer Near Water',
          description: 'An electrical appliance is placed dangerously close to water.',
          solution: 'Keep electrical appliances away from water sources.',
          x: 35,
          y: 40,
          width: 10,
          height: 8,
          found: false
        },
        {
          id: 2,
          name: 'Overloaded Medicine Cabinet',
          description: 'The medicine cabinet is overfilled with potentially flammable products.',
          solution: 'Store flammable products properly and avoid overstocking.',
          x: 60,
          y: 30,
          width: 12,
          height: 15,
          found: false
        }
      ]
    },
    [RoomType.GARAGE]: {
      name: 'Garage',
      backgroundImage: 'https://placehold.co/800x600/5A5A5A/FFF?text=Garage+Scene',
      hazards: [
        {
          id: 1,
          name: 'Improperly Stored Gasoline',
          description: 'Gasoline is stored in an improper container.',
          solution: 'Store gasoline only in approved containers away from heat sources.',
          x: 25,
          y: 70,
          width: 8,
          height: 10,
          found: false
        },
        {
          id: 2,
          name: 'Paint Thinner Near Water Heater',
          description: 'Flammable chemicals are stored near an ignition source.',
          solution: 'Store flammable liquids away from heat sources or potential ignition.',
          x: 70,
          y: 60,
          width: 10,
          height: 12,
          found: false
        },
        {
          id: 3,
          name: 'Oily Rags in a Pile',
          description: 'Oily rags are piled together, which can lead to spontaneous combustion.',
          solution: 'Hang oily rags separately to dry or dispose of them in a metal container with a lid.',
          x: 40,
          y: 50,
          width: 12,
          height: 8,
          found: false
        },
        {
          id: 4,
          name: 'Damaged Electrical Wiring',
          description: 'The garage door opener has exposed wiring.',
          solution: 'Have any damaged wiring repaired immediately by a qualified electrician.',
          x: 55,
          y: 20,
          width: 10,
          height: 5,
          found: false
        }
      ]
    }
  };
  
  // Initialize the current room's hazards
  useEffect(() => {
    setHazards(roomConfigs[currentRoom].hazards.map(h => ({ ...h, found: false })));
  }, [currentRoom]);
  
  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
      setGameCompleted(true);
      setFeedback("Time's up! Let's see how many hazards you found.");
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timer]);
  
  // Check if all hazards in the current room have been found
  useEffect(() => {
    if (hazards.length > 0 && hazards.every(h => h.found) && !gameCompleted) {
      const roomScore = Math.floor((hazards.length / roomConfigs[currentRoom].hazards.length) * 100);
      setScore(prev => prev + roomScore);
      setFeedback(`Great job! You found all the hazards in the ${roomConfigs[currentRoom].name}!`);
      
      // Check if all rooms have been completed
      const allRooms = Object.values(RoomType);
      const currentRoomIndex = allRooms.indexOf(currentRoom);
      
      if (currentRoomIndex < allRooms.length - 1) {
        // Move to next room after a delay
        setTimeout(() => {
          setCurrentRoom(allRooms[currentRoomIndex + 1]);
          setFeedback('');
        }, 2000);
      } else {
        // Game completed
        setGameCompleted(true);
        setTimerActive(false);
        if (onComplete) onComplete();
      }
    }
  }, [hazards, currentRoom, gameCompleted, onComplete]);
  
  // Start the game
  const startGame = () => {
    setShowInstructions(false);
    setTimerActive(true);
    setScore(0);
    setCurrentRoom(RoomType.KITCHEN);
    setHazards(roomConfigs[RoomType.KITCHEN].hazards.map(h => ({ ...h, found: false })));
    setGameCompleted(false);
    setTimer(180);
    setHintsRemaining(3);
  };
  
  // Reset the game
  const resetGame = () => {
    setShowInstructions(true);
    setTimerActive(false);
    setScore(0);
    setCurrentRoom(RoomType.KITCHEN);
    setHazards(roomConfigs[RoomType.KITCHEN].hazards.map(h => ({ ...h, found: false })));
    setGameCompleted(false);
    setTimer(180);
    setHintsRemaining(3);
    setFeedback('');
  };
  
  // Handle area click to find hazards
  const handleAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameCompleted || !gameAreaRef.current) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Check if click is on a hazard
    const clickedHazard = hazards.find(h => 
      !h.found && 
      x >= h.x && 
      x <= (h.x + h.width) && 
      y >= h.y && 
      y <= (h.y + h.height)
    );
    
    if (clickedHazard) {
      // Mark hazard as found
      setHazards(hazards.map(h => 
        h.id === clickedHazard.id ? { ...h, found: true } : h
      ));
      
      // Show selected hazard details
      setSelectedHazard(clickedHazard);
      setFeedback(`Good job! You found ${clickedHazard.name}.`);
    } else {
      setFeedback('Try again! Click on a potential hazard.');
    }
  };
  
  // Show a hint (highlight a random unfound hazard)
  const showHintHandler = () => {
    if (hintsRemaining <= 0) return;
    
    const unfoundHazards = hazards.filter(h => !h.found);
    if (unfoundHazards.length > 0) {
      setShowHint(true);
      setHintsRemaining(prev => prev - 1);
      
      // Hide hint after 2 seconds
      setTimeout(() => {
        setShowHint(false);
      }, 2000);
    }
  };
  
  // Change room manually
  const changeRoom = (room: RoomType) => {
    setCurrentRoom(room);
    setSelectedHazard(null);
    setFeedback('');
  };
  
  // Preview mode simplified version
  if (previewMode) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-amber-100 p-4 rounded-lg shadow">
        <h3 className="font-fredoka text-xl text-amber-600 mb-2">Hazard Identification Game</h3>
        <p className="text-sm mb-4">Find fire and safety hazards in different rooms of a house</p>
        <div className="flex justify-center">
          <img 
            src="https://placehold.co/300x200/FFA500/FFF?text=Spot+The+Hazard" 
            alt="Hazard Identification Preview" 
            className="rounded-md mb-3"
          />
        </div>
        <p className="text-xs text-gray-600">Train your eye to identify potential fire hazards in everyday settings.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Game header */}
      <div className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white p-4">
        <h2 className="font-fredoka text-2xl">Hazard Identification Game</h2>
        <p className="text-sm opacity-90">Find all the fire and safety hazards in each room</p>
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
        <div className="font-fredoka">
          <span className="mr-4">Room: {roomConfigs[currentRoom].name}</span>
          <span className={`font-mono ${timer < 30 ? 'text-red-600' : ''}`}>
            Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      
      {/* Instructions screen */}
      {showInstructions ? (
        <div className="p-6">
          <h3 className="font-fredoka text-xl mb-4">Instructions</h3>
          
          <div className="mb-6">
            <p className="mb-4">
              In this game, you'll explore different rooms and identify potential fire hazards. 
              Click on areas you think might be dangerous. Work quickly, but carefully!
            </p>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>Identify all hazards in each room to progress</li>
              <li>You have 3 minutes to find as many hazards as possible</li>
              <li>Use hints wisely - you only have 3 for the entire game</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Select Room to Start:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {Object.values(RoomType).map(room => (
                <div 
                  key={room} 
                  className={`p-3 border rounded cursor-pointer text-center ${currentRoom === room ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}`}
                  onClick={() => setCurrentRoom(room)}
                >
                  <p className="font-medium capitalize">{roomConfigs[room].name}</p>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg shadow"
            onClick={startGame}
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          {/* Game area */}
          <div className="relative">
            {/* Room navigation */}
            <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
              {Object.values(RoomType).map(room => (
                <button
                  key={room}
                  className={`px-2 py-1 text-xs rounded ${currentRoom === room ? 'bg-amber-600 text-white' : 'bg-white/80 hover:bg-white'}`}
                  onClick={() => changeRoom(room)}
                >
                  {roomConfigs[room].name}
                </button>
              ))}
            </div>
            
            {/* Hint button */}
            <div className="absolute top-2 right-2 z-10">
              <button
                className={`px-3 py-1 rounded text-sm ${hintsRemaining > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                onClick={showHintHandler}
                disabled={hintsRemaining <= 0}
              >
                Hint ({hintsRemaining})
              </button>
            </div>
            
            {/* Progress indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {hazards.filter(h => h.found).length} / {hazards.length} Hazards Found
            </div>
            
            {/* Game area with background image */}
            <div 
              ref={gameAreaRef}
              className="relative w-full h-[450px] cursor-pointer"
              onClick={handleAreaClick}
              style={{
                backgroundImage: `url(${roomConfigs[currentRoom].backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Render found hazards */}
              {hazards.filter(h => h.found).map(hazard => (
                <div
                  key={hazard.id}
                  className="absolute border-2 border-green-500 bg-green-200/50 rounded-md"
                  style={{
                    left: `${hazard.x}%`,
                    top: `${hazard.y}%`,
                    width: `${hazard.width}%`,
                    height: `${hazard.height}%`
                  }}
                >
                  <div className="absolute -top-1 -left-1 bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                    ✓
                  </div>
                </div>
              ))}
              
              {/* Hint highlight */}
              {showHint && (
                <AnimatePresence>
                  {hazards.filter(h => !h.found).slice(0, 1).map(hazard => (
                    <motion.div
                      key={`hint-${hazard.id}`}
                      className="absolute border-2 border-yellow-500 bg-yellow-300/50 rounded-md"
                      style={{
                        left: `${hazard.x}%`,
                        top: `${hazard.y}%`,
                        width: `${hazard.width}%`,
                        height: `${hazard.height}%`
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
          
          {/* Information panel */}
          <div className="p-4 bg-white border-t">
            {selectedHazard ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 p-4 rounded-lg border border-amber-200"
              >
                <h3 className="font-fredoka text-xl text-amber-800 mb-2">{selectedHazard.name}</h3>
                <p className="mb-2 text-gray-700">{selectedHazard.description}</p>
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <h4 className="font-semibold text-green-800">Solution:</h4>
                  <p>{selectedHazard.solution}</p>
                </div>
                <button
                  className="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded"
                  onClick={() => setSelectedHazard(null)}
                >
                  Continue Searching
                </button>
              </motion.div>
            ) : (
              <>
                {feedback ? (
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <p>{feedback}</p>
                  </div>
                ) : (
                  <p className="text-gray-600">Click on areas of the room that might be fire hazards.</p>
                )}
              </>
            )}
            
            <div className="mt-4 flex justify-between">
              <button 
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                onClick={resetGame}
              >
                Reset Game
              </button>
              
              <div>
                {Object.values(RoomType).length > 1 && (
                  <div className="flex space-x-2">
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
                      onClick={() => {
                        const allRooms = Object.values(RoomType);
                        const currentIndex = allRooms.indexOf(currentRoom);
                        const prevIndex = (currentIndex - 1 + allRooms.length) % allRooms.length;
                        changeRoom(allRooms[prevIndex]);
                      }}
                    >
                      Previous Room
                    </button>
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
                      onClick={() => {
                        const allRooms = Object.values(RoomType);
                        const currentIndex = allRooms.indexOf(currentRoom);
                        const nextIndex = (currentIndex + 1) % allRooms.length;
                        changeRoom(allRooms[nextIndex]);
                      }}
                    >
                      Next Room
                    </button>
                  </div>
                )}
              </div>
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
                  {score >= 80 ? "Great Job!" : "Game Complete"}
                </h3>
                
                <div className="text-center mb-4">
                  <p className="text-lg font-bold mb-2">Your Score: {score}/100</p>
                  <p className="text-gray-600">
                    {score >= 80 
                      ? "You have a great eye for safety hazards!"
                      : "Keep practicing to improve your hazard spotting skills."}
                  </p>
                </div>
                
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mb-4">
                  <h4 className="font-semibold mb-2">Remember:</h4>
                  <p className="text-sm">Regular safety checks in your home can prevent fires and save lives. 
                  Check for these common hazards at least monthly.</p>
                </div>
                
                <div className="mt-6 flex justify-center space-x-3">
                  <button 
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg shadow"
                    onClick={resetGame}
                  >
                    Play Again
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