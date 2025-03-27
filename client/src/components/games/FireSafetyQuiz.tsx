import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle, Award, ChevronRight, RotateCcw } from 'lucide-react';

// Question difficulty levels
enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

// Question categories
enum Category {
  PREVENTION = 'prevention',
  ESCAPE = 'escape',
  EQUIPMENT = 'equipment',
  COOKING = 'cooking',
  GENERAL = 'general'
}

// Question interface
interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: Difficulty;
  category: Category;
  imageUrl?: string;
}

interface FireSafetyQuizProps {
  previewMode?: boolean;
  onComplete?: () => void;
}

export default function FireSafetyQuiz({
  previewMode = false,
  onComplete
}: FireSafetyQuizProps) {
  // User state
  const { userData } = useUser();
  
  // Quiz state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  
  // Quiz database - in a real app this would come from a database
  const quizQuestions: Question[] = [
    // EASY Prevention Questions
    {
      id: 1,
      text: "What should you do with flammable liquids in your home?",
      options: [
        "Store them near the stove for easy access",
        "Store them in a cool, well-ventilated area away from heat sources",
        "Keep them in your bedroom closet",
        "Leave them uncapped for proper ventilation"
      ],
      correctAnswer: 1,
      explanation: "Flammable liquids should always be stored in a cool, well-ventilated area away from any heat sources or open flames to prevent accidental ignition.",
      difficulty: Difficulty.EASY,
      category: Category.PREVENTION
    },
    {
      id: 2,
      text: "Which of these is a safe practice for electrical cords?",
      options: [
        "Running them under carpets to hide them",
        "Using them even if they are frayed",
        "Stapling them to walls for neatness",
        "Keeping them untangled and away from water"
      ],
      correctAnswer: 3,
      explanation: "Electrical cords should be kept untangled and away from water to prevent electrical fires. Never run cords under carpets, use damaged cords, or attach them to surfaces with staples or nails.",
      difficulty: Difficulty.EASY,
      category: Category.PREVENTION
    },
    
    // EASY Escape Questions
    {
      id: 3,
      text: "What is the first thing you should do when you hear a fire alarm?",
      options: [
        "Call the fire department",
        "Open windows to let smoke out",
        "Gather valuables to take with you",
        "Exit the building immediately"
      ],
      correctAnswer: 3,
      explanation: "When a fire alarm sounds, you should exit the building immediately. Don't waste time gathering possessions or making phone calls. Call emergency services once you're safely outside.",
      difficulty: Difficulty.EASY,
      category: Category.ESCAPE
    },
    {
      id: 4,
      text: "If your clothes catch fire, what should you do?",
      options: [
        "Run to find water",
        "Stop, drop, and roll",
        "Remove your clothes immediately",
        "Wave your arms to extinguish the flames"
      ],
      correctAnswer: 1,
      explanation: "If your clothes catch fire, you should stop, drop, and roll. This helps smother the flames by depriving them of oxygen. Running will only fan the flames and make the fire worse.",
      difficulty: Difficulty.EASY,
      category: Category.ESCAPE
    },
    
    // EASY Equipment Questions
    {
      id: 5,
      text: "How often should you test smoke alarms in your home?",
      options: [
        "Once a year",
        "Every 5 years",
        "At least once a month",
        "Only when the batteries are changed"
      ],
      correctAnswer: 2,
      explanation: "Smoke alarms should be tested at least once a month to ensure they're working properly. Batteries should be replaced at least once a year, and the entire unit should be replaced every 10 years.",
      difficulty: Difficulty.EASY,
      category: Category.EQUIPMENT
    },
    {
      id: 6,
      text: "Where should fire extinguishers be stored in the home?",
      options: [
        "Hidden away so children can't reach them",
        "In easily accessible locations near exit routes",
        "In the garage only",
        "Near stoves and fireplaces only"
      ],
      correctAnswer: 1,
      explanation: "Fire extinguishers should be stored in easily accessible locations near exit routes. This way, you can grab them quickly in an emergency but also have a clear path to exit if the fire cannot be controlled.",
      difficulty: Difficulty.EASY,
      category: Category.EQUIPMENT
    },
    
    // MEDIUM Prevention Questions
    {
      id: 7,
      text: "What is the recommended safe distance to keep flammable items from a space heater?",
      options: [
        "6 inches",
        "1 foot",
        "At least 3 feet",
        "5 feet"
      ],
      correctAnswer: 2,
      explanation: "Flammable items should be kept at least 3 feet away from space heaters. This includes furniture, curtains, papers, and other combustible materials that could ignite from the heat.",
      difficulty: Difficulty.MEDIUM,
      category: Category.PREVENTION
    },
    {
      id: 8,
      text: "Which of these cooking practices helps prevent kitchen fires?",
      options: [
        "Leaving cooking food unattended if it's on low heat",
        "Wearing loose-fitting clothing while cooking",
        "Storing cooking oil above the stove",
        "Keeping a lid nearby when cooking with oil"
      ],
      correctAnswer: 3,
      explanation: "Keeping a lid nearby when cooking with oil is a good safety practice. If an oil fire occurs, you can slide the lid over the pan to smother the flames. Never leave cooking unattended, wear loose clothing near stoves, or store oil above heat sources.",
      difficulty: Difficulty.MEDIUM,
      category: Category.COOKING
    },
    
    // MEDIUM Escape Questions
    {
      id: 9,
      text: "If smoke is filling a room during a fire, how should you move through it?",
      options: [
        "Run quickly to minimize exposure time",
        "Crawl low on the floor where air is clearer",
        "Hold your breath and walk normally",
        "Cover your face with a wet cloth and stand upright"
      ],
      correctAnswer: 1,
      explanation: "During a fire, you should crawl low under smoke, keeping your nose 12-24 inches above the floor where the air is clearer and cooler. Smoke rises, so staying low can help you breathe better and see more clearly.",
      difficulty: Difficulty.MEDIUM,
      category: Category.ESCAPE
    },
    {
      id: 10,
      text: "What should you do if you're trapped in a room during a fire?",
      options: [
        "Hide in a closet or under the bed",
        "Open the window to jump out",
        "Break the window immediately",
        "Close the door, seal cracks, and signal for help from a window"
      ],
      correctAnswer: 3,
      explanation: "If trapped, close the door and use towels or clothing to seal cracks around the door and vents. Then go to a window to signal for help. Only break the window if necessary for ventilation, as this can't be undone and may allow smoke in later.",
      difficulty: Difficulty.MEDIUM,
      category: Category.ESCAPE
    },
    
    // MEDIUM Equipment Questions
    {
      id: 11,
      text: "What does the 'P' stand for in the P.A.S.S. method for using a fire extinguisher?",
      options: [
        "Prepare",
        "Push",
        "Pull",
        "Press"
      ],
      correctAnswer: 2,
      explanation: "In the P.A.S.S. method, 'P' stands for Pull the pin. The complete method is: Pull the pin, Aim at the base of the fire, Squeeze the handle, and Sweep from side to side.",
      difficulty: Difficulty.MEDIUM,
      category: Category.EQUIPMENT
    },
    {
      id: 12,
      text: "Which type of fire extinguisher is appropriate for electrical fires?",
      options: [
        "Class A",
        "Class B",
        "Class C",
        "Class D"
      ],
      correctAnswer: 2,
      explanation: "Class C fire extinguishers are designed for electrical fires. They use non-conductive agents that won't conduct electricity back to the user. Many modern fire extinguishers are rated for multiple classes (like ABC extinguishers).",
      difficulty: Difficulty.MEDIUM,
      category: Category.EQUIPMENT
    },
    
    // HARD Prevention Questions
    {
      id: 13,
      text: "Which of these materials can spontaneously combust under certain conditions?",
      options: [
        "Aluminum foil",
        "Oil-soaked rags",
        "Plastic containers",
        "Ceramic tiles"
      ],
      correctAnswer: 1,
      explanation: "Oil-soaked rags can spontaneously combust through a process called oxidation. As the oil breaks down, it generates heat. If the rags are balled up, this heat can't escape and can eventually reach the ignition temperature of the oil.",
      difficulty: Difficulty.HARD,
      category: Category.PREVENTION
    },
    {
      id: 14,
      text: "What is the primary hazard in a backdraft situation?",
      options: [
        "Toxic smoke inhalation",
        "Structural collapse",
        "Sudden explosive ignition of gases",
        "Electrical failure"
      ],
      correctAnswer: 2,
      explanation: "A backdraft occurs when a fire in an enclosed space has consumed most of the oxygen but continues to produce flammable gases. When a new oxygen source is introduced (like opening a door), the gases can ignite explosively.",
      difficulty: Difficulty.HARD,
      category: Category.GENERAL
    },
    
    // HARD Escape Questions
    {
      id: 15,
      text: "In a high-rise building fire, when should you NOT use the elevator as an escape route?",
      options: [
        "When you're above the 10th floor",
        "Almost always - use stairs instead",
        "When the fire alarm is sounding",
        "When you're with small children"
      ],
      correctAnswer: 1,
      explanation: "In almost all fire situations, you should NOT use elevators. Elevators can malfunction during fires, stop on the fire floor, or become smoke-filled traps. Always use the stairs unless specifically instructed otherwise by fire officials.",
      difficulty: Difficulty.HARD,
      category: Category.ESCAPE
    },
    {
      id: 16,
      text: "Which of these fire escape plan elements is most critical for multi-story homes?",
      options: [
        "Having fire extinguishers on each floor",
        "Secondary escape routes from upper floors",
        "A designated outside meeting place",
        "Fireproof safes for valuables"
      ],
      correctAnswer: 1,
      explanation: "For multi-story homes, secondary escape routes from upper floors are critical. This might include escape ladders, access to lower roofs, or other alternative exits in case stairs are blocked by fire or smoke.",
      difficulty: Difficulty.HARD,
      category: Category.ESCAPE
    },
    
    // HARD Equipment Questions
    {
      id: 17,
      text: "What is the purpose of a fire damper in a building's HVAC system?",
      options: [
        "To increase airflow during a fire",
        "To prevent the spread of fire through ductwork",
        "To trigger the sprinkler system",
        "To extract smoke from the building"
      ],
      correctAnswer: 1,
      explanation: "Fire dampers are passive fire protection devices installed in HVAC ductwork that automatically close when they detect heat. Their purpose is to prevent the spread of fire and smoke through the ductwork of a building.",
      difficulty: Difficulty.HARD,
      category: Category.EQUIPMENT
    },
    {
      id: 18,
      text: "How do photoelectric smoke detectors differ from ionization smoke detectors?",
      options: [
        "They are more expensive but last longer",
        "They detect fast, flaming fires better",
        "They are better at detecting smoldering fires with larger smoke particles",
        "They only need battery replacement every 5 years"
      ],
      correctAnswer: 2,
      explanation: "Photoelectric smoke detectors are better at detecting smoldering fires that produce larger smoke particles. Ionization detectors are more responsive to fast, flaming fires. For complete protection, homes should have both types or dual-sensor detectors.",
      difficulty: Difficulty.HARD,
      category: Category.EQUIPMENT
    }
  ];
  
  // Initialize quiz based on selected category and difficulty
  useEffect(() => {
    if (!showInstructions && !quizCompleted) {
      let filteredQuestions = [...quizQuestions];
      
      // Filter by category if not 'all'
      if (selectedCategory !== 'all') {
        filteredQuestions = filteredQuestions.filter(q => q.category === selectedCategory);
      }
      
      // Filter by difficulty
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === selectedDifficulty);
      
      // If we don't have enough questions at this difficulty, add some from other difficulties
      if (filteredQuestions.length < 5) {
        const additionalQuestions = quizQuestions.filter(
          q => (selectedCategory === 'all' || q.category === selectedCategory) && 
               q.difficulty !== selectedDifficulty
        );
        
        // Combine and shuffle
        filteredQuestions = [...filteredQuestions, ...additionalQuestions];
      }
      
      // Shuffle and limit to 10 questions
      const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
      setQuestions(shuffled.slice(0, 10));
      setCurrentQuestionIndex(0);
      setScore(0);
      setIsAnswered(false);
      setSelectedOption(null);
      
      // Start timer
      setTimer(0);
      setTimerActive(true);
    }
  }, [showInstructions, quizCompleted, selectedCategory, selectedDifficulty]);
  
  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (timerActive && !quizCompleted) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, quizCompleted]);
  
  // Start the quiz
  const startQuiz = () => {
    setShowInstructions(false);
  };
  
  // Select an answer
  const selectOption = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    if (optionIndex === questions[currentQuestionIndex].correctAnswer) {
      // Calculate points based on difficulty
      const difficultyPoints = 
        questions[currentQuestionIndex].difficulty === Difficulty.EASY ? 5 :
        questions[currentQuestionIndex].difficulty === Difficulty.MEDIUM ? 10 : 15;
      
      setScore(prev => prev + difficultyPoints);
    }
  };
  
  // Move to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz completed
      setQuizCompleted(true);
      setTimerActive(false);
      if (onComplete) onComplete();
    }
  };
  
  // Restart the quiz
  const restartQuiz = () => {
    setShowInstructions(true);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
  };
  
  // Format timer display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get badge based on score percentage
  const getBadge = () => {
    // Calculate maximum possible score (assuming all questions are correct)
    const maxPossibleScore = questions.reduce((total, q) => {
      return total + (q.difficulty === Difficulty.EASY ? 5 : 
                       q.difficulty === Difficulty.MEDIUM ? 10 : 15);
    }, 0);
    
    const percentage = (score / maxPossibleScore) * 100;
    
    if (percentage >= 90) return { name: "Fire Safety Expert", color: "bg-yellow-500" };
    if (percentage >= 75) return { name: "Fire Safety Pro", color: "bg-blue-500" };
    if (percentage >= 60) return { name: "Fire Safety Apprentice", color: "bg-green-500" };
    return { name: "Fire Safety Novice", color: "bg-gray-500" };
  };
  
  // Preview mode simplified version
  if (previewMode) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg shadow">
        <h3 className="font-fredoka text-xl text-red-600 mb-2">Fire Safety Quiz</h3>
        <p className="text-sm mb-4">Test your knowledge with questions about fire prevention and safety</p>
        <div className="flex justify-center">
          <img 
            src="https://placehold.co/300x200/FF4500/FFF?text=Fire+Safety+Quiz" 
            alt="Fire Safety Quiz Preview" 
            className="rounded-md mb-3"
          />
        </div>
        <p className="text-xs text-gray-600">Questions range from basic fire prevention to advanced emergency procedures.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Quiz header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-4">
        <h2 className="font-fredoka text-2xl">Fire Safety Quiz</h2>
        <p className="text-sm opacity-90">Test your knowledge about fire safety and prevention</p>
      </div>
      
      {/* Instructions screen */}
      {showInstructions ? (
        <div className="p-6">
          <h3 className="font-fredoka text-xl mb-4">Quiz Instructions</h3>
          
          <div className="mb-6">
            <p className="mb-4">
              This quiz will test your knowledge of fire safety concepts. Select the category and difficulty 
              you'd like to be tested on. You'll receive points based on correct answers and the difficulty level.
            </p>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>Easy questions: 5 points each</li>
              <li>Medium questions: 10 points each</li>
              <li>Hard questions: 15 points each</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-2">Select Category:</h4>
              <div className="space-y-2">
                <div 
                  className={`p-3 border rounded cursor-pointer ${selectedCategory === 'all' ? 'bg-red-100 border-red-500' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  <p className="font-medium">All Categories</p>
                </div>
                {Object.values(Category).map(category => (
                  <div 
                    key={category} 
                    className={`p-3 border rounded cursor-pointer ${selectedCategory === category ? 'bg-red-100 border-red-500' : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <p className="font-medium capitalize">{category}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Select Difficulty:</h4>
              <div className="space-y-2">
                {Object.values(Difficulty).map(difficulty => (
                  <div 
                    key={difficulty} 
                    className={`p-3 border rounded cursor-pointer ${selectedDifficulty === difficulty ? 'bg-red-100 border-red-500' : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedDifficulty(difficulty)}
                  >
                    <p className="font-medium capitalize">{difficulty}</p>
                    <p className="text-xs text-gray-500">
                      {difficulty === Difficulty.EASY ? 'Basic fire safety knowledge' : 
                       difficulty === Difficulty.MEDIUM ? 'Intermediate concepts and scenarios' : 
                       'Advanced knowledge and specialized situations'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <button 
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow"
            onClick={startQuiz}
          >
            Start Quiz
          </button>
        </div>
      ) : quizCompleted ? (
        // Quiz results screen
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h3 className="font-fredoka text-2xl mb-2">Quiz Complete!</h3>
            <p className="text-gray-600 mb-4">
              You scored {score} points in {formatTime(timer)}
            </p>
            
            <div className="inline-block rounded-full p-2 mb-4 mt-2">
              <motion.div 
                className={`rounded-full p-6 ${getBadge().color}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                <Award className="w-16 h-16 text-white" />
              </motion.div>
            </div>
            
            <h4 className="text-xl font-bold mb-6">{getBadge().name}</h4>
            
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h5 className="font-semibold mb-2">Your Performance:</h5>
              <div className="flex justify-between mb-2">
                <span>Correct Answers:</span>
                <span className="font-bold">{questions.filter((q, i) => {
                  const selectedOpt = i === currentQuestionIndex ? selectedOption : null;
                  return i < currentQuestionIndex || (i === currentQuestionIndex && isAnswered) ? 
                    (i === currentQuestionIndex ? selectedOpt : null) === q.correctAnswer : false;
                }).length} / {questions.length}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Time Taken:</span>
                <span className="font-bold">{formatTime(timer)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                className="bg-red-600 hover:bg-red-700"
                onClick={restartQuiz}
              >
                <RotateCcw className="w-4 h-4 mr-2" /> Take Another Quiz
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  // Here you could implement logic to share results or get a certificate
                  alert("Feature coming soon: Share your results or get a certificate!");
                }}
              >
                <Award className="w-4 h-4 mr-2" /> Get Certificate
              </Button>
            </div>
          </motion.div>
        </div>
      ) : (
        // Quiz question screen
        <div className="p-6">
          {/* Progress and timer */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1 mr-4">
              <div className="flex justify-between mb-1 text-sm">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round((currentQuestionIndex / questions.length) * 100)}% Complete</span>
              </div>
              <Progress value={(currentQuestionIndex / questions.length) * 100} className="h-2" />
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Time</div>
              <div className="font-mono">{formatTime(timer)}</div>
            </div>
          </div>
          
          {/* Current score */}
          <div className="bg-gray-100 py-2 px-4 rounded mb-6 flex justify-between">
            <span>Score: <span className="font-bold">{score}</span></span>
            <span className="text-sm">
              Difficulty: <span className="capitalize">{questions[currentQuestionIndex]?.difficulty}</span>
            </span>
          </div>
          
          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <div className="text-sm text-gray-500 capitalize mb-1">
                    Category: {questions[currentQuestionIndex]?.category}
                  </div>
                  <h3 className="text-xl font-bold">{questions[currentQuestionIndex]?.text}</h3>
                </CardHeader>
                
                {questions[currentQuestionIndex]?.imageUrl && (
                  <CardContent className="pb-2">
                    <img 
                      src={questions[currentQuestionIndex].imageUrl} 
                      alt="Question illustration" 
                      className="rounded-md my-2 max-h-48 mx-auto"
                    />
                  </CardContent>
                )}
                
                <CardContent>
                  <div className="space-y-3">
                    {questions[currentQuestionIndex]?.options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isAnswered
                            ? index === questions[currentQuestionIndex].correctAnswer
                              ? 'bg-green-100 border-green-500'
                              : selectedOption === index
                                ? 'bg-red-100 border-red-500'
                                : 'bg-gray-50 border-gray-200'
                            : selectedOption === index
                              ? 'bg-blue-100 border-blue-500'
                              : 'hover:bg-gray-50'
                        }`}
                        onClick={() => selectOption(index)}
                      >
                        <div className="flex items-start">
                          <div className="mr-2 mt-0.5">
                            {isAnswered ? (
                              index === questions[currentQuestionIndex].correctAnswer ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : selectedOption === index ? (
                                <XCircle className="w-5 h-5 text-red-600" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-xs">
                                  {String.fromCharCode(65 + index)}
                                </div>
                              )
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-xs">
                                {String.fromCharCode(65 + index)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">{option}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                {isAnswered && (
                  <CardFooter className="block">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p>{questions[currentQuestionIndex].explanation}</p>
                      </div>
                    </div>
                    
                    <Button 
                      className="bg-red-600 hover:bg-red-700 ml-auto"
                      onClick={nextQuestion}
                    >
                      {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}