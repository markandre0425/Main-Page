import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Trophy } from "lucide-react";

/**
 * Your Achievements: summary stats + recent activity from useUserProgress.
 * MVP: unified feed for reliability; architecture supports per-game cards in V2
 * via gameSessions.filter(by gameId). Consider normalizing scores if games use
 * different scales (e.g. quiz % vs card-game points).
 */
export default function PersonalStats() {
  const { user } = useAuth();
  const { progress, getRecentGames } = useUserProgress();

  if (!user) return null;

  const recentGames = getRecentGames(5);
  const hasAnyProgress = progress.quizzesTaken > 0 || progress.gamesPlayed > 0 || recentGames.length > 0;

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bangers text-3xl text-gray-800">Your Achievements</h2>
      </div>

      {hasAnyProgress ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#FF5722]">{progress.quizzesTaken}</p>
              <p className="text-sm text-gray-600">Quizzes completed</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#FF5722]">{progress.gamesPlayed}</p>
              <p className="text-sm text-gray-600">Games played</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#FF5722]">{progress.highestScore}%</p>
              <p className="text-sm text-gray-600">Best score</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#FF5722]">{progress.achievementsEarned}</p>
              <p className="text-sm text-gray-600">Achievements</p>
            </div>
          </div>
          {recentGames.length > 0 && (
            <div>
              <h3 className="font-fredoka text-lg text-gray-800 mb-2">Recent activity</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                {recentGames.map((g, i) => (
                  <li key={i}>
                    {g.gameName} — {g.score}%{g.completed ? " ✓" : ""}
                    <span className="ml-1 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(g.timestamp), { addSuffix: true })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <Trophy className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <h3 className="font-fredoka text-lg text-blue-800 mb-2">Start your journey</h3>
          <p className="text-blue-600 mb-4">Play Fire Safety Quiz or Matching Card Game to see your achievements here.</p>
          <Link href="/games">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-fredoka">
              Play games
            </button>
          </Link>
        </div>
      )}
    </section>
  );
}
