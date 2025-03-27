import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GameNav from "@/components/layout/GameNav";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Flame, ShieldAlert, Route, HelpCircle, BookOpen, ExternalLink } from "lucide-react";
import { MiniGame } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn } from "@/lib/queryClient";

// Import game components
import FireExtinguisherSimulator from "@/components/games/FireExtinguisherSimulator";
import HazardIdentificationGame from "@/components/games/HazardIdentificationGame";
import EscapePlanDesigner from "@/components/games/EscapePlanDesigner";
import FireSafetyQuiz from "@/components/games/FireSafetyQuiz";

interface BuiltInGame {
  id: number;
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  path: string;
}

export default function GamesPage() {
  const [builtInGames, setBuiltInGames] = useState<BuiltInGame[]>([
    {
      id: 1,
      title: "Fire Extinguisher Simulator",
      description: "Learn the PASS technique and practice using different types of fire extinguishers.",
      color: "bg-gradient-to-br from-red-500 to-orange-600",
      icon: <Flame className="w-8 h-8 text-white/80" />,
      path: "/games/fire-extinguisher-simulator"
    },
    {
      id: 2,
      title: "Fire Safety Quiz",
      description: "Test your knowledge with interactive quizzes about fire prevention and safety procedures.",
      color: "bg-gradient-to-br from-[#FF5722] to-orange-700",
      icon: <HelpCircle className="w-8 h-8 text-white/80" />,
      path: "/games/fire-safety-quiz"
    },
    {
      id: 3,
      title: "Escape Plan Designer",
      description: "Create and practice a personalized fire escape plan for your home or building.",
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
      icon: <Route className="w-8 h-8 text-white/80" />,
      path: "/games/escape-plan-designer"
    },
    {
      id: 4,
      title: "Hazard Identification Game",
      description: "Identify fire hazards in different rooms and learn how to prevent dangerous situations.",
      color: "bg-gradient-to-br from-amber-500 to-yellow-600",
      icon: <ShieldAlert className="w-8 h-8 text-white/80" />,
      path: "/games/hazard-identification"
    },
    {
      id: 5,
      title: "Safety Tips Library",
      description: "Browse our comprehensive collection of fire safety tips and educational resources.",
      color: "bg-gradient-to-br from-emerald-500 to-green-600",
      icon: <BookOpen className="w-8 h-8 text-white/80" />,
      path: "/safety-tips"
    },
  ]);
  
  const { toast } = useToast();

  // Fetch external games from API
  const { data: allGames = [], isLoading, error } = useQuery<MiniGame[]>({
    queryKey: ['/api/games'],
    queryFn: getQueryFn({ on401: "throw" })
  });
  
  // Filter external games
  const externalGames = allGames.filter(game => game.isExternal);

  return (
    <div id="app" className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <GameNav />
        
        <div className="mb-8">
          <h1 className="font-bangers text-4xl text-gray-800 mb-6">Games Collection</h1>
          <p className="mb-8 text-gray-600 max-w-3xl">
            Explore our collection of interactive games designed to teach fire safety in a fun and engaging way.
            These games will help you practice important safety skills while having fun.
          </p>
          
          {/* Built-in games section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {builtInGames.map((game) => (
              <motion.div
                key={game.id}
                className={`${game.color} rounded-xl overflow-hidden shadow-lg`}
                whileHover={{ translateY: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-6 text-white">
                  <div className="flex items-center mb-4">
                    {game.icon}
                    <h3 className="font-fredoka text-2xl ml-2">{game.title}</h3>
                  </div>
                  <p className="mb-6 font-nunito opacity-90">{game.description}</p>
                  
                  <div className="flex justify-end">
                    <Link href={game.path}>
                      <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-fredoka text-white border border-white/30">
                        Play Now
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* External games section - only show if there are any */}
          {externalGames.length > 0 && (
            <>
              <h2 className="font-bangers text-3xl text-gray-800 mb-4">Partner Games</h2>
              <p className="mb-6 text-gray-600 max-w-3xl">
                Explore additional fire safety games from our trusted partners.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {externalGames.map((game) => (
                  <motion.div
                    key={game.id}
                    className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200"
                    whileHover={{ translateY: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img 
                        src={game.imageUrl || "https://placehold.co/500x300/cccccc/gray?text=No+Image"} 
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs py-1 px-2 rounded-full flex items-center">
                        <ExternalLink size={12} className="mr-1" />
                        <span>External</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-fredoka text-xl text-gray-800 mb-2">{game.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{game.description}</p>
                      
                      <div className="flex justify-end">
                        <a 
                          href={game.externalUrl || "#"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-fredoka flex items-center"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Visit Game
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
          
          {/* Loading state for external games */}
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          )}
          
          {/* Error state */}
          {error && !isLoading && externalGames.length === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <h3 className="font-fredoka text-lg text-red-800 mb-2">Unable to load partner games</h3>
              <p className="text-red-600">Please try again later or contact support if the problem persists.</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="font-bangers text-2xl text-gray-800 mb-4">Game Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-fredoka text-lg text-gray-800 mb-3">Most Played</h3>
              <div className="h-32 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">Play some games to see stats</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-fredoka text-lg text-gray-800 mb-3">Best Scores</h3>
              <div className="h-32 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">Play some games to see stats</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}