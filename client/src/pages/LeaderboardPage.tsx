import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";

type Entry = {
  id: number;
  username: string;
  displayName?: string;
  fullName: string;
  timeMs: number;
  objectivesCollected: number;
  score: number;
  createdAt: number;
};

type PersonalStats = {
  bestTime: number;
  totalObjectives: number;
  gamesPlayed: number;
  averageScore: number;
  rank: number;
};

function formatTime(ms: number) {
  const sec = Math.floor(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const msRem = ms % 1000;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(msRem).padStart(3, "0")}`;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const gameKey = params.get("game") || "maze";
  const [entries, setEntries] = useState<Entry[]>([]);
  const [personalStats, setPersonalStats] = useState<PersonalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    
    // Fetch global leaderboard
    fetch(`/api/leaderboard/${encodeURIComponent(gameKey)}?limit=50`, { 
      signal: controller.signal,
      credentials: 'include'
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Failed: ${r.status}`);
        return r.json();
      })
      .then(setEntries)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
      
    // Fetch personal stats (you'll need to implement this API endpoint)
    if (user) {
      fetch(`/api/leaderboard/${encodeURIComponent(gameKey)}/personal`, { 
        signal: controller.signal,
        credentials: 'include'
      })
        .then(async (r) => {
          if (r.ok) return r.json();
          return null;
        })
        .then(setPersonalStats)
        .catch(() => setPersonalStats(null));
    }
    
    return () => controller.abort();
  }, [gameKey, user]);

  // Find user's rank in the global leaderboard
  const userRank = user ? entries.findIndex(entry => entry.username === user.username) + 1 : 0;
  const userEntry = user ? entries.find(entry => entry.username === user.username) : null;

  return (
    <div id="app" className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">My Leaderboard</h1>
            
            {/* Game Selector */}
            <div className="flex items-center space-x-2">
              <label htmlFor="game-select" className="font-medium text-gray-700">
                Select Game:
              </label>
              <select
                id="game-select"
                value={gameKey}
                onChange={(e) => {
                  const newGame = e.target.value;
                  const url = newGame === 'maze' ? '/leaderboard' : `/leaderboard?game=${newGame}`;
                  window.location.href = url;
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
              >
                <option value="maze">Fire Safety Maze</option>
                <option value="matching-cards">Matching Cards</option>
                <option value="crossword">Crossword Puzzle</option>
              </select>
            </div>
          </div>

          {/* Personal Stats Section */}
          {user && (
            <div className="bg-gradient-to-r from-[#FF5722] to-[#E91E63] text-white rounded-xl p-6 mb-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">
                {user.displayName ? `${user.displayName}'s Performance` : 'Your Performance'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{userRank || 'N/A'}</div>
                  <div className="text-sm opacity-90">Global Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {userEntry ? formatTime(userEntry.timeMs) : 'N/A'}
                  </div>
                  <div className="text-sm opacity-90">Best Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {userEntry ? userEntry.objectivesCollected : 'N/A'}
                  </div>
                  <div className="text-sm opacity-90">Objectives</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {userEntry ? userEntry.score : 'N/A'}
                  </div>
                  <div className="text-sm opacity-90">Score</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Global Leaderboard */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Global Rankings</h2>
            {loading && <div className="text-center py-8">Loading…</div>}
            {error && <div className="text-red-600 text-center py-4">{error}</div>}
            {!loading && !error && (
              <>
                {entries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg">No scores yet for this game!</p>
                    <p className="text-sm mt-2">Be the first to complete the game and set a record!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="p-3 font-semibold">Rank</th>
                          <th className="p-3 font-semibold">Player Name</th>
                          <th className="p-3 font-semibold">Time</th>
                          <th className="p-3 font-semibold">Objectives</th>
                          <th className="p-3 font-semibold">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entries.map((e, i) => (
                          <tr 
                            key={e.id} 
                            className={`border-b hover:bg-gray-50 ${
                              user && e.username === user.username ? 'bg-blue-50 border-blue-200' : ''
                            }`}
                          >
                            <td className="p-3">
                              <div className="flex items-center">
                                {i < 3 && (
                                  <span className="mr-2">
                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                                  </span>
                                )}
                                {i + 1}
                              </div>
                            </td>
                            <td className="p-3 font-medium">
                              {e.fullName}
                              {user && e.username === user.username && (
                                <span className="ml-2 text-blue-600 text-sm">(You)</span>
                              )}
                            </td>
                            <td className="p-3 font-mono">{formatTime(e.timeMs)}</td>
                            <td className="p-3">{e.objectivesCollected}</td>
                            <td className="p-3 font-semibold">{e.score}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}


