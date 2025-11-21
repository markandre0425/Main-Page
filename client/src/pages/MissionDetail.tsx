import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Mission } from "@shared/schema";
import { missions } from "@/lib/gameData";
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";

interface MissionStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default function MissionDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { userData, completeMission } = useUser();
  const [mission, setMission] = useState<Mission | null>(null);
  const [missionSteps, setMissionSteps] = useState<MissionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch mission details from the API
    const foundMission = missions.find(m => m.id === Number(id));
    if (foundMission) {
      setMission(foundMission);
      
      // Generate steps for the mission
      const steps = foundMission.steps || [
        { id: 1, title: "Learn", description: "Learn about the hazards", completed: false },
        { id: 2, title: "Identify", description: "Identify the safety measures", completed: false },
        { id: 3, title: "Practice", description: "Practice the safety techniques", completed: false },
        { id: 4, title: "Quiz", description: "Test your knowledge", completed: false }
      ];
      
      setMissionSteps(steps);
    } else {
      navigate("/");
    }
  }, [id, navigate]);

  const handleCompleteStep = () => {
    if (currentStep < missionSteps.length) {
      setMissionSteps(prev => {
        const updated = [...prev];
        updated[currentStep].completed = true;
        return updated;
      });
      
      if (currentStep === missionSteps.length - 1) {
        handleCompleteMission();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleCompleteMission = () => {
    setIsComplete(true);
    
    // Update user progress in context/backend
    if (mission) {
      completeMission(mission.id);
    }
  };

  const difficultyColors = {
    beginner: 'bg-[#FF5722] text-white',
    intermediate: 'bg-[#FFC107] text-gray-800',
    advanced: 'bg-[#E91E63] text-white'
  };

  if (!mission) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading mission...</p>
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative">
            <img 
              src={mission.imageUrl || `https://placehold.co/1200x300/2196F3/FFFFFF/svg?text=${mission.title}`}
              alt={mission.title} 
              className="w-full h-48 md:h-64 object-cover" 
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h1 className="font-bangers text-4xl md:text-5xl text-white text-center">{mission.title}</h1>
            </div>
            <div className={`absolute bottom-4 right-4 ${difficultyColors[mission.difficulty as keyof typeof difficultyColors]} px-4 py-2 rounded-xl font-fredoka`}>
              {mission.difficulty.charAt(0).toUpperCase() + mission.difficulty.slice(1)}
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h2 className="font-fredoka text-2xl text-gray-800 mb-2">Mission Briefing</h2>
              <p className="text-gray-600">{mission.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="font-fredoka text-2xl text-gray-800 mb-4">Mission Progress</h2>
              <div className="space-y-4">
                {missionSteps.map((step, index) => (
                  <div 
                    key={step.id} 
                    className={`p-4 rounded-lg border-2 ${
                      currentStep === index 
                        ? 'border-[#2196F3] bg-blue-50' 
                        : step.completed 
                          ? 'border-[#4CAF50] bg-green-50' 
                          : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`rounded-full w-8 h-8 flex items-center justify-center mr-3 ${
                        step.completed ? 'bg-[#4CAF50] text-white' : currentStep === index ? 'bg-[#2196F3] text-white' : 'bg-gray-200'
                      }`}>
                        {step.completed ? <i className="fas fa-check"></i> : index + 1}
                      </div>
                      <div>
                        <h3 className="font-fredoka text-lg text-gray-800">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                        
                        {currentStep === index && !step.completed && (
                          <div className="mt-4">
                            <motion.button 
                              className="game-button bg-[#4CAF50] hover:bg-green-600 text-white px-4 py-2 rounded-lg font-fredoka"
                              onClick={handleCompleteStep}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Complete Step
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {isComplete && (
              <motion.div 
                className="bg-[#4CAF50]/10 border-2 border-[#4CAF50] rounded-xl p-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="rounded-full w-16 h-16 bg-[#4CAF50] text-white flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-trophy text-2xl"></i>
                </div>
                <h2 className="font-bangers text-3xl text-[#4CAF50] mb-2">Mission Complete!</h2>
                <p className="text-gray-600 mb-4">You've earned {mission.points} points!</p>
                <motion.button 
                  className="game-button bg-[#2196F3] hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-fredoka"
                  onClick={() => navigate("/")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Home
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
