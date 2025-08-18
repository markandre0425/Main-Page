import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Trophy, Clock, Target, TrendingUp, Award } from "lucide-react";

type GameStats = {
  gameKey: string;
  gameName: string;
  bestTime: number;
  bestScore: number;
  objectivesCollected: number;
  rank: number;
  lastPlayed: string;
};

export default function PersonalStats() {
  const { user } = useAuth();
  const [gameStats, setGameStats] = useState<GameStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch user's stats for all games
    const fetchStats = async () => {
      try {
        const games = ['maze', 'escape-room', 'matching-cards', 'crossword'];
        const statsPromises = games.map(async (gameKey) => {
          try {
            const response = await fetch(`/api/leaderboard/${gameKey}/personal`, {
              credentials: 'include'
            });
            if (response.ok) {
              const data = await response.json();
              return {
                gameKey,
                gameName: getGameName(gameKey),
                bestTime: data.bestTime || 0,
                bestScore: data.bestScore || 0,
                objectivesCollected: data.objectivesCollected || 0,
                rank: data.rank || 0,
                lastPlayed: data.lastPlayed || 'Never'
              };
            }
          } catch (error) {
            console.warn(`Failed to fetch stats for ${gameKey}:`, error);
          }
          
          // Return default stats if API call fails
          return {
            gameKey,
            gameName: getGameName(gameKey),
            bestTime: 0,
            bestScore: 0,
            objectivesCollected: 0,
            rank: 0,
            lastPlayed: 'Never'
          };
        });

        const stats = await Promise.all(statsPromises);
        setGameStats(stats);
      } catch (error) {
        console.error('Failed to fetch game stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const getGameName = (gameKey: string) => {
    const gameNames: Record<string, string> = {
      'maze': 'Fire Safety Maze',
      'escape-room': 'Escape Room',
      'matching-cards': 'Matching Cards',
      'crossword': 'Crossword Puzzle'
    };
    return gameNames[gameKey] || gameKey;
  };

  const formatTime = (ms: number) => {
    if (ms === 0) return 'N/A';
    const sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  if (!user) return null;

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bangers text-3xl text-gray-800">Your Achievements</h2>
        <Link href="/leaderboard">
          <button className="bg-[#FF5722] hover:bg-[#E91E63] text-white px-4 py-2 rounded-lg font-fredoka transition-colors flex items-center">
            <Trophy className="w-4 h-4 mr-2" />
            View All Leaderboards
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#FF5722] rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your achievements...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gameStats.map((game) => (
            <div key={game.gameKey} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-fredoka text-lg text-gray-800">{game.gameName}</h3>
                {game.rank > 0 && game.rank <= 3 && (
                  <span className="text-2xl">
                    {game.rank === 1 ? '🥇' : game.rank === 2 ? '🥈' : '🥉'}
                  </span>
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Best Time:
                  </span>
                  <span className="font-semibold">{formatTime(game.bestTime)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    Objectives:
                  </span>
                  <span className="font-semibold">{game.objectivesCollected}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Best Score:
                  </span>
                  <span className="font-semibold">{game.bestScore || 'N/A'}</span>
                </div>
                
                {game.rank > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      Rank:
                    </span>
                    <span className="font-semibold text-[#FF5722]">#{game.rank}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100">
                <Link href={`/leaderboard?game=${game.gameKey}`}>
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-fredoka text-sm transition-colors">
                    View Rankings
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && gameStats.every(game => game.bestTime === 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <Trophy className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <h3 className="font-fredoka text-lg text-blue-800 mb-2">Start Your Journey!</h3>
          <p className="text-blue-600 mb-4">Play some games to see your achievements and rankings here.</p>
          <Link href="/games">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-fredoka">
              Play Games
            </button>
          </Link>
        </div>
      )}
    </section>
  );
}
