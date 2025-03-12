import { useState } from "react";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import AgeSelector from "@/components/age-selector";
import GameModules from "@/components/game-modules";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { gameTypes } from "@shared/schema";
import { gameInfo } from "@/lib/data";

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-baloo font-bold text-dark-navy mb-6">Fire Safety Games</h1>
        
        {/* Age selector */}
        <AgeSelector />
        
        {/* Game type filter */}
        <div className="mt-8">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-5 mb-8">
              <TabsTrigger value="all">All Games</TabsTrigger>
              <TabsTrigger value={gameTypes.QUIZ}>Quizzes</TabsTrigger>
              <TabsTrigger value={gameTypes.CROSSWORD}>Crosswords</TabsTrigger>
              <TabsTrigger value={gameTypes.WORD_PICS}>4 Pics 1 Word</TabsTrigger>
              <TabsTrigger value={gameTypes.WORD_SCRAMBLE}>Word Scrambles</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <GameModules />
            </TabsContent>
            
            {Object.keys(gameInfo).map(gameType => (
              <TabsContent key={gameType} value={gameType}>
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-2">
                    <h2 className="text-2xl font-baloo font-bold text-dark-navy">{gameInfo[gameType].title}</h2>
                  </div>
                  <p className="text-gray-600">{gameInfo[gameType].description}</p>
                </div>
                
                <GameModules />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
