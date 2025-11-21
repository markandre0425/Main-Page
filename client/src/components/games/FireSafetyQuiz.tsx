import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { useUserProgress } from '@/hooks/useUserProgress';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle, Award, ChevronRight, RotateCcw, Star } from 'lucide-react';

// Age-appropriate difficulty levels for kindergarten to grade 3
enum Difficulty {
  KINDERGARTEN = 'kindergarten',    // Ages 4-5
  GRADE1 = 'grade1',                // Ages 6-7
  GRADE2 = 'grade2',                // Ages 7-8
  GRADE3 = 'grade3'                 // Ages 8-9
}

// Child-friendly question categories
enum Category {
  FIRE_BASICS = 'fire_basics',      // What is fire, hot/cold
  STOP_DROP_ROLL = 'stop_drop_roll', // Emergency response
  FIREFIGHTERS = 'firefighters',     // Helpers and heroes
  HOME_SAFETY = 'home_safety',       // Safe vs unsafe
  EMERGENCY = 'emergency'            // Call 911, get help
}

// Child-friendly question interface
interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: Difficulty;
  category: Category;
  emoji: string;
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
  const { recordQuizCompletion } = useUserProgress();
  
  // Quiz state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.KINDERGARTEN);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<number>(Date.now());
  
  // Age-appropriate quiz questions based on BFP Philippines guidelines
  const quizQuestions: Question[] = [
    // KINDERGARTEN Questions (Ages 4-5)
    {
      id: 1,
      text: "What color is fire?",
      options: [
        "Blue",
        "Red and orange",
        "Green",
        "Purple"
      ],
      correctAnswer: 1,
      explanation: "Fire is red and orange! Fire is very hot and bright.",
      difficulty: Difficulty.KINDERGARTEN,
      category: Category.FIRE_BASICS,
      emoji: "🔥"
    },
    {
      id: 2,
      text: "What should you do if your clothes catch fire?",
      options: [
        "Run fast",
        "Stop, drop, and roll",
        "Jump up and down",
        "Take off your clothes"
      ],
      correctAnswer: 1,
      explanation: "Stop, drop, and roll! This helps put out the fire on your clothes.",
      difficulty: Difficulty.KINDERGARTEN,
      category: Category.STOP_DROP_ROLL,
      emoji: "🛑"
    },
    {
      id: 3,
      text: "Who helps us when there's a fire?",
      options: [
        "Teachers",
        "Doctors",
        "Firefighters",
        "Police officers"
      ],
      correctAnswer: 2,
      explanation: "Firefighters help us when there's a fire! They wear special clothes and drive big red trucks. BFP firefighters are our heroes!",
      difficulty: Difficulty.KINDERGARTEN,
      category: Category.FIREFIGHTERS,
      emoji: "👨‍🚒"
    },
    {
      id: 4,
      text: "Is it safe to play with matches?",
      options: [
        "Yes, they are fun",
        "No, they can start fires",
        "Only with grown-ups",
        "Only outside"
      ],
      correctAnswer: 1,
      explanation: "No! Matches can start fires. Only grown-ups should use matches.",
      difficulty: Difficulty.KINDERGARTEN,
      category: Category.HOME_SAFETY,
      emoji: "🚫"
    },
    {
      id: 5,
      text: "What number do you call for help?",
      options: [
        "911",
        "123",
        "555",
        "999"
      ],
      correctAnswer: 0,
      explanation: "Call 911 when you need help! This is the emergency number.",
      difficulty: Difficulty.KINDERGARTEN,
      category: Category.EMERGENCY,
      emoji: "🚨"
    },

    // GRADE 1 Questions (Ages 6-7)
    {
      id: 6,
      text: "Fire is very...",
      options: [
        "Cold",
        "Hot",
        "Wet",
        "Soft"
      ],
      correctAnswer: 1,
      explanation: "Fire is very hot! It can burn you and hurt you. Never touch fire!",
      difficulty: Difficulty.GRADE1,
      category: Category.FIRE_BASICS,
      emoji: "🔥"
    },
    {
      id: 7,
      text: "When you stop, drop, and roll, what do you cover?",
      options: [
        "Your ears",
        "Your face",
        "Your feet",
        "Your hands"
      ],
      correctAnswer: 1,
      explanation: "Cover your face with your hands when you stop, drop, and roll!",
      difficulty: Difficulty.GRADE1,
      category: Category.STOP_DROP_ROLL,
      emoji: "🤲"
    },
    {
      id: 8,
      text: "Firefighters wear special clothes to...",
      options: [
        "Look pretty",
        "Stay safe from fire",
        "Keep warm",
        "Hide from people"
      ],
      correctAnswer: 1,
      explanation: "Firefighters wear special clothes to stay safe from fire and help people! BFP firefighters are trained to help us!",
      difficulty: Difficulty.GRADE1,
      category: Category.FIREFIGHTERS,
      emoji: "👨‍🚒"
    },
    {
      id: 9,
      text: "Where should you keep toys?",
      options: [
        "Near the stove",
        "Away from the stove",
        "In the kitchen",
        "On the stove"
      ],
      correctAnswer: 1,
      explanation: "Keep toys away from the stove! The stove gets very hot and can start fires.",
      difficulty: Difficulty.GRADE1,
      category: Category.HOME_SAFETY,
      emoji: "🧸"
    },
    {
      id: 10,
      text: "If you see fire, what should you do first?",
      options: [
        "Tell a grown-up",
        "Try to put it out",
        "Hide under the bed",
        "Take a picture"
      ],
      correctAnswer: 0,
      explanation: "Tell a grown-up right away! Grown-ups know how to help when there's fire.",
      difficulty: Difficulty.GRADE1,
      category: Category.EMERGENCY,
      emoji: "👨‍👩‍👧‍👦"
    },

    // GRADE 2 Questions (Ages 7-8)
    {
      id: 11,
      text: "What happens when fire touches things?",
      options: [
        "They get cold",
        "They burn and turn black",
        "They turn blue",
        "They disappear"
      ],
      correctAnswer: 1,
      explanation: "Fire burns things and makes them turn black! Fire can destroy things.",
      difficulty: Difficulty.GRADE2,
      category: Category.FIRE_BASICS,
      emoji: "🔥"
    },
    {
      id: 12,
      text: "When you stop, drop, and roll, you should roll...",
      options: [
        "Back and forth",
        "In circles",
        "Only once",
        "Very slowly"
      ],
      correctAnswer: 0,
      explanation: "Roll back and forth until the fire goes out! Keep rolling until you're safe.",
      difficulty: Difficulty.GRADE2,
      category: Category.STOP_DROP_ROLL,
      emoji: "🔄"
    },
    {
      id: 13,
      text: "Firefighters drive big trucks that are...",
      options: [
        "Blue",
        "Red",
        "Green",
        "Yellow"
      ],
      correctAnswer: 1,
      explanation: "Firefighters drive big red trucks! The trucks have ladders and water to help put out fires. BFP trucks are ready to help!",
      difficulty: Difficulty.GRADE2,
      category: Category.FIREFIGHTERS,
      emoji: "🚒"
    },
    {
      id: 14,
      text: "What should you do if you see smoke?",
      options: [
        "Stay where you are",
        "Crawl low to the ground",
        "Stand up tall",
        "Run very fast"
      ],
      correctAnswer: 1,
      explanation: "Crawl low to the ground! Smoke rises up, so the air near the floor is cleaner.",
      difficulty: Difficulty.GRADE2,
      category: Category.HOME_SAFETY,
      emoji: "🚪"
    },
    {
      id: 15,
      text: "When you call 911, what should you tell them?",
      options: [
        "Your favorite color",
        "Your name and that there's a fire",
        "What you had for lunch",
        "Your pet's name"
      ],
      correctAnswer: 1,
      explanation: "Tell them your name and that there's a fire! They need to know where to send help.",
      difficulty: Difficulty.GRADE2,
      category: Category.EMERGENCY,
      emoji: "📞"
    },

    // GRADE 3 Questions (Ages 8-9)
    {
      id: 16,
      text: "Fire needs three things to burn. What are they?",
      options: [
        "Water, air, and food",
        "Heat, fuel, and oxygen",
        "Matches, paper, and wind",
        "Fire, smoke, and ash"
      ],
      correctAnswer: 1,
      explanation: "Fire needs heat, fuel (something to burn), and oxygen (air) to keep burning!",
      difficulty: Difficulty.GRADE3,
      category: Category.FIRE_BASICS,
      emoji: "🔥"
    },
    {
      id: 17,
      text: "If you're trapped in a room with fire, what should you do?",
      options: [
        "Hide under the bed",
        "Close the door and go to a window",
        "Open all the windows",
        "Try to run through the fire"
      ],
      correctAnswer: 1,
      explanation: "Close the door to keep smoke out, then go to a window to call for help!",
      difficulty: Difficulty.GRADE3,
      category: Category.STOP_DROP_ROLL,
      emoji: "🚪"
    },
    {
      id: 18,
      text: "Firefighters use special tools like...",
      options: [
        "Toys and games",
        "Hoses, ladders, and axes",
        "Books and pencils",
        "Food and drinks"
      ],
      correctAnswer: 1,
      explanation: "Firefighters use hoses to spray water, ladders to reach high places, and axes to break things! BFP firefighters have special tools!",
      difficulty: Difficulty.GRADE3,
      category: Category.FIREFIGHTERS,
      emoji: "🪓"
    },
    {
      id: 19,
      text: "What should you do if you hear a smoke alarm?",
      options: [
        "Turn it off",
        "Get out of the house right away",
        "Go back to sleep",
        "Call your friends"
      ],
      correctAnswer: 1,
      explanation: "Get out of the house right away! Smoke alarms make noise to warn you about fire.",
      difficulty: Difficulty.GRADE3,
      category: Category.HOME_SAFETY,
      emoji: "🚨"
    },
    {
      id: 20,
      text: "Where should your family meet if there's a fire?",
      options: [
        "Inside the house",
        "At a neighbor's house",
        "At a safe place outside",
        "In the car"
      ],
      correctAnswer: 2,
      explanation: "Meet at a safe place outside, like a tree or mailbox! Everyone should know where to meet.",
      difficulty: Difficulty.GRADE3,
      category: Category.EMERGENCY,
      emoji: "🌳"
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
      
      // Shuffle and limit to 8 questions for children (shorter quiz)
      const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
      setQuestions(shuffled.slice(0, 8));
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
    setQuizStartTime(Date.now());
  };
  
  // Select an answer
  const selectOption = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    if (optionIndex === questions[currentQuestionIndex].correctAnswer) {
      // Calculate points based on difficulty (simpler scoring for children)
      const difficultyPoints = 
        questions[currentQuestionIndex].difficulty === Difficulty.KINDERGARTEN ? 1 :
        questions[currentQuestionIndex].difficulty === Difficulty.GRADE1 ? 2 :
        questions[currentQuestionIndex].difficulty === Difficulty.GRADE2 ? 3 : 4;
      
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
      // Quiz completed - record real data
      const correctAnswers = questions.filter((q, i) => {
        const selectedOpt = i === currentQuestionIndex ? selectedOption : null;
        return i < currentQuestionIndex || (i === currentQuestionIndex && isAnswered) ? 
          (i === currentQuestionIndex ? selectedOpt : null) === q.correctAnswer : false;
      }).length;
      
      const finalScore = Math.round((correctAnswers / questions.length) * 100);
      const timeSpent = Math.floor((Date.now() - quizStartTime) / 60000); // Convert to minutes
      
      // Record quiz completion with real data
      recordQuizCompletion(finalScore, timeSpent);
      
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
  
  // Get badge based on score percentage (child-friendly badges)
  const getBadge = () => {
    const maxPossibleScore = questions.reduce((total, q) => {
      return total + (q.difficulty === Difficulty.KINDERGARTEN ? 1 : 
                       q.difficulty === Difficulty.GRADE1 ? 2 :
                       q.difficulty === Difficulty.GRADE2 ? 3 : 4);
    }, 0);
    
    const percentage = (score / maxPossibleScore) * 100;
    
    if (percentage >= 90) return { name: "Fire Safety Superstar", color: "bg-yellow-500", emoji: "⭐" };
    if (percentage >= 75) return { name: "Fire Safety Hero", color: "bg-blue-500", emoji: "🦸‍♂️" };
    if (percentage >= 60) return { name: "Fire Safety Helper", color: "bg-green-500", emoji: "👨‍🚒" };
    return { name: "Fire Safety Learner", color: "bg-purple-500", emoji: "🎓" };
  };
  
  // Preview mode simplified version
  if (previewMode) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-orange-100 p-4 rounded-lg shadow">
        <h3 className="font-fredoka text-xl text-red-600 mb-2">🔥 Fire Safety Quiz 🔥</h3>
        <p className="text-sm mb-4">Learn about fire safety with fun questions!</p>
        <div className="flex justify-center">
          <img 
            src="https://placehold.co/300x200/FF4500/FFF?text=Fire+Safety+Quiz" 
            alt="Fire Safety Quiz Preview" 
            className="rounded-md mb-3"
          />
        </div>
        <p className="text-xs text-gray-600">Perfect for ages 4-9! Learn about firefighters, stop-drop-roll, and staying safe.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Quiz header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-4">
        <h2 className="font-fredoka text-3xl">🔥 Fire Safety Quiz 🔥</h2>
        <p className="text-lg opacity-90">Learn about fire safety with BFP Philippines and become a safety hero!</p>
      </div>
      
      {/* Instructions screen */}
      {showInstructions ? (
        <div className="p-6">
          <h3 className="font-fredoka text-2xl mb-4">🌟 Welcome to Fire Safety Quiz! 🌟</h3>
          
          <div className="mb-6">
            <p className="mb-4 text-lg">
              Let's learn about fire safety together! Choose your grade level and what you want to learn about.
              Answer the questions and earn stars! ⭐
            </p>
            
            <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-300 mb-4">
              <h4 className="font-bold text-yellow-800 mb-2">🎯 How to Play:</h4>
              <ul className="list-disc pl-5 space-y-1 text-yellow-800">
                <li>Choose your grade level</li>
                <li>Pick what you want to learn about</li>
                <li>Answer 8 fun questions</li>
                <li>Earn stars for correct answers!</li>
              </ul>
            </div>
            
            <div className="bg-red-100 p-4 rounded-lg border-2 border-red-300 mb-4">
              <h4 className="font-bold text-red-800 mb-2">🏛️ BFP Philippines Partnership</h4>
              <p className="text-sm text-red-700">
                This quiz is created with the Bureau of Fire Protection (BFP) Philippines. 
                All content follows official BFP fire safety guidelines for children.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-2 text-lg">🎓 Choose Your Grade:</h4>
              <div className="space-y-2">
                {Object.values(Difficulty).map(difficulty => (
                  <div 
                    key={difficulty} 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedDifficulty === difficulty ? 'bg-red-100 border-red-500 scale-105' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedDifficulty(difficulty)}
                  >
                    <p className="font-bold text-lg capitalize">
                      {difficulty === Difficulty.KINDERGARTEN ? 'Kindergarten (Ages 4-5)' :
                       difficulty === Difficulty.GRADE1 ? 'Grade 1 (Ages 6-7)' :
                       difficulty === Difficulty.GRADE2 ? 'Grade 2 (Ages 7-8)' :
                       'Grade 3 (Ages 8-9)'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {difficulty === Difficulty.KINDERGARTEN ? 'Basic fire safety' : 
                       difficulty === Difficulty.GRADE1 ? 'Simple safety rules' : 
                       difficulty === Difficulty.GRADE2 ? 'More safety knowledge' :
                       'Advanced safety concepts'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-lg">📚 What to Learn:</h4>
              <div className="space-y-2">
                <div 
                  className={`p-3 border-2 rounded-lg cursor-pointer ${
                    selectedCategory === 'all' ? 'bg-red-100 border-red-500' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCategory('all')}
                >
                  <p className="font-medium">🌟 All Topics</p>
                </div>
                {Object.values(Category).map(category => (
                  <div 
                    key={category} 
                    className={`p-3 border-2 rounded-lg cursor-pointer ${
                      selectedCategory === category ? 'bg-red-100 border-red-500' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <p className="font-medium">
                      {category === Category.FIRE_BASICS ? '🔥 About Fire' :
                       category === Category.STOP_DROP_ROLL ? '🛑 Stop, Drop & Roll' :
                       category === Category.FIREFIGHTERS ? '👨‍🚒 Firefighters' :
                       category === Category.HOME_SAFETY ? '🏠 Home Safety' :
                       '🚨 Emergency Help'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg text-xl font-fredoka"
              onClick={startQuiz}
            >
              🚀 Start Learning!
            </button>
          </div>
        </div>
      ) : quizCompleted ? (
        // Quiz results screen
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h3 className="font-fredoka text-3xl mb-2">🎉 Great Job! 🎉</h3>
            <p className="text-lg text-gray-600 mb-4">
              You earned {score} stars in {formatTime(timer)}!
            </p>
            
            <div className="inline-block rounded-full p-2 mb-4 mt-2">
              <motion.div 
                className={`rounded-full p-6 ${getBadge().color}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-4xl">{getBadge().emoji}</span>
              </motion.div>
            </div>
            
            <h4 className="text-2xl font-bold mb-6">{getBadge().name}</h4>
            
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
              <div className="flex justify-between mb-2">
                <span>Stars Earned:</span>
                <span className="font-bold">{score} ⭐</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg py-3"
                onClick={restartQuiz}
              >
                <RotateCcw className="w-5 h-5 mr-2" /> Play Again!
              </Button>
              <Button 
                variant="outline"
                className="text-lg py-3"
                onClick={() => {
                  alert("🌟 You're a Fire Safety Hero! Keep learning and stay safe! 🌟");
                }}
              >
                <Star className="w-5 h-5 mr-2" /> Get Certificate
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
              <Progress value={(currentQuestionIndex / questions.length) * 100} className="h-3" />
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Time</div>
              <div className="font-mono text-lg">{formatTime(timer)}</div>
            </div>
          </div>
          
          {/* Current score */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 py-3 px-4 rounded-lg mb-6 flex justify-between items-center">
            <span className="text-lg">⭐ Stars: <span className="font-bold text-xl">{score}</span></span>
            <span className="text-sm">
              Grade: <span className="capitalize font-bold">{questions[currentQuestionIndex]?.difficulty}</span>
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
              <Card className="mb-6 border-2">
                <CardHeader className="pb-2">
                  <div className="text-sm text-gray-500 capitalize mb-1 flex items-center">
                    <span className="text-2xl mr-2">{questions[currentQuestionIndex]?.emoji}</span>
                    <span className="font-bold">
                      {questions[currentQuestionIndex]?.category === Category.FIRE_BASICS ? 'About Fire' :
                       questions[currentQuestionIndex]?.category === Category.STOP_DROP_ROLL ? 'Stop, Drop & Roll' :
                       questions[currentQuestionIndex]?.category === Category.FIREFIGHTERS ? 'Firefighters' :
                       questions[currentQuestionIndex]?.category === Category.HOME_SAFETY ? 'Home Safety' :
                       'Emergency Help'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-fredoka">{questions[currentQuestionIndex]?.text}</h3>
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
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-lg ${
                          isAnswered
                            ? index === questions[currentQuestionIndex].correctAnswer
                              ? 'bg-green-100 border-green-500 scale-105'
                              : selectedOption === index
                                ? 'bg-red-100 border-red-500'
                                : 'bg-gray-50 border-gray-200'
                            : selectedOption === index
                              ? 'bg-blue-100 border-blue-500 scale-105'
                              : 'hover:bg-gray-50 hover:scale-102'
                        }`}
                        onClick={() => selectOption(index)}
                      >
                        <div className="flex items-start">
                          <div className="mr-3 mt-1">
                            {isAnswered ? (
                              index === questions[currentQuestionIndex].correctAnswer ? (
                                <CheckCircle className="w-6 h-6 text-green-600" />
                              ) : selectedOption === index ? (
                                <XCircle className="w-6 h-6 text-red-600" />
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-bold">
                                  {String.fromCharCode(65 + index)}
                                </div>
                              )
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-bold">
                                {String.fromCharCode(65 + index)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 font-medium">{option}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                {isAnswered && (
                  <CardFooter className="block">
                    <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 mb-4">
                      <div className="flex items-start">
                        <AlertCircle className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                        <p className="text-lg font-medium">{questions[currentQuestionIndex].explanation}</p>
                      </div>
                    </div>
                    
                    <Button 
                      className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg py-3 px-6 ml-auto"
                      onClick={nextQuestion}
                    >
                      {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz!'}
                      <ChevronRight className="w-5 h-5 ml-2" />
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