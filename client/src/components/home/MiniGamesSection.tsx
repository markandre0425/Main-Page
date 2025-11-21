import { useState, useEffect } from "react";
import { Link } from "wouter";
import { MiniGame } from "@shared/schema";
import { miniGames } from "@/lib/gameData";

export default function MiniGamesSection() {
  const [featuredGames, setFeaturedGames] = useState<MiniGame[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call
    setFeaturedGames(miniGames.slice(0, 2));
  }, []);

  const renderGamePreview = (game: MiniGame) => {
    switch (game.type) {
      case "spot-hazard":
        return <SpotTheHazard previewMode={true} gameId={game.id} />;
      case "extinguisher-training":
        return <FireExtinguisherTraining previewMode={true} gameId={game.id} />;
      default:
        return (
          <div className="game-canvas mb-3 flex items-center justify-center bg-gray-100">
            <p>Game preview unavailable</p>
          </div>
        );
    }
  };

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bangers text-3xl text-gray-800">Mini Games</h2>
        <div className="flex items-center space-x-4">
          <Link href="/minigame/list">
            <button className="text-[#2196F3] hover:text-blue-700 font-fredoka flex items-center cursor-pointer">
              See All <i className="fas fa-chevron-right ml-1"></i>
            </button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featuredGames.map((game) => (
          <div key={game.id} className="bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="p-4">
              <h3 className="font-fredoka text-xl text-gray-800 mb-2">{game.title}</h3>
              <p className="text-gray-600 mb-3 line-clamp-2">{game.description}</p>
              
              {renderGamePreview(game)}
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center">
                  <span className="font-fredoka text-gray-600 text-sm sm:text-base">
                    Best Score: {game.bestScore ? `${game.bestScore}/10` : "Not played yet"}
                  </span>
                </div>
                <Link href={`/minigame/${game.id}`}>
                  <button className="game-button bg-[#2196F3] hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-fredoka w-full sm:w-auto">
                    Play Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
