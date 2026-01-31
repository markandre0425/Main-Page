import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// import GameNav from "@/components/layout/GameNav"; // Removed - now integrated into Header
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ShieldAlert, Route, HelpCircle, ExternalLink } from "lucide-react";
import { MiniGame } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn } from "@/lib/queryClient";

// Import game components

import FireSafetyQuiz from "@/components/games/FireSafetyQuiz";

interface BuiltInGame {
  id: number;
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  path: string;
  imageUrl?: string;
}

export default function GamesPage() {
  const [builtInGames, setBuiltInGames] = useState<BuiltInGame[]>([
    {
      id: 2,
      title: "Fire Safety Quiz",
      description: "Test your knowledge with interactive quizzes about fire prevention and safety procedures.",
      color: "bg-gradient-to-br from-[#FF5722] to-orange-700",
      icon: <HelpCircle className="w-8 h-8 text-white/80" />,
      path: "/games/fire-safety-quiz",
      imageUrl: "/images/games/fire-safety-quiz.png"
    },
  ]);
  
  const { toast } = useToast();

  // Debug: Log built-in games
  console.log('Built-in games:', builtInGames);

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
        
        <div className="mb-8">
          <h1 className="font-bangers text-4xl text-gray-800 mb-6">Games Collection</h1>
          <p className="mb-8 text-gray-600 max-w-3xl">
            Explore our collection of interactive games designed to teach fire safety in a fun and engaging way.
            These games will help you practice important safety skills while having fun.
          </p>
          
          {/* All games section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Built-in games */}
            {builtInGames.length > 0 ? builtInGames.map((game) => (
              <motion.div
                key={game.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200"
                whileHover={{ translateY: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-40 overflow-hidden relative">
                  {game.imageUrl ? (
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`${game.color} h-full flex items-center justify-center`}>
                      <div className="text-center text-white">
                        <div className="flex items-center justify-center gap-2">
                          {game.icon}
                          <h3 className="font-fredoka text-2xl">{game.title}</h3>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-fredoka text-xl text-gray-800 mb-2">{game.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{game.description}</p>
                  
                  <div className="flex justify-end">
                    <Link href={game.path}>
                      <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-fredoka flex items-center">
                        Play Now
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No built-in games available</p>
              </div>
            )}
            
            {/* External games */}
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
      </main>
      
      <Footer />
    </div>
  );
}