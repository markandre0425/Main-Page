import { useEffect, useState } from "react";
import { useLocation } from "wouter";

type Entry = {
  id: number;
  username: string;
  timeMs: number;
  objectivesCollected: number;
  score: number;
  createdAt: number;
};

function formatTime(ms: number) {
  const sec = Math.floor(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const msRem = ms % 1000;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(msRem).padStart(3, "0")}`;
}

export default function LeaderboardPage() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] || "");
  const gameKey = params.get("game") || "maze";
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetch(`/api/leaderboard/${encodeURIComponent(gameKey)}?limit=50`, { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Failed: ${r.status}`);
        return r.json();
      })
      .then(setEntries)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [gameKey]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Leaderboard - {gameKey}</h1>
        {loading && <div>Loading…</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Rank</th>
                  <th className="p-2">Player</th>
                  <th className="p-2">Time</th>
                  <th className="p-2">Objectives</th>
                  <th className="p-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={e.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{e.username}</td>
                    <td className="p-2">{formatTime(e.timeMs)}</td>
                    <td className="p-2">{e.objectivesCollected}</td>
                    <td className="p-2">{e.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


