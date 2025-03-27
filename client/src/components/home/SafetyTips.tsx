import { useState, useEffect } from "react";
import { SafetyTip } from "@shared/schema";
import { safetyTips } from "@/lib/gameData";
import { Link } from "wouter";

export default function SafetyTips() {
  const [todaysTip, setTodaysTip] = useState<SafetyTip | null>(null);

  useEffect(() => {
    // In a real app, we would call an API to get today's tip
    // For now, grab a random tip from the hard-coded data
    const randomIndex = Math.floor(Math.random() * safetyTips.length);
    setTodaysTip(safetyTips[randomIndex]);
  }, []);

  if (!todaysTip) {
    return (
      <section className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="font-bangers text-2xl text-gray-800 mb-4">Today's Safety Tip</h2>
        <div className="bg-[#F5F5F5] rounded-lg p-4 mb-4 flex items-center justify-center h-32">
          <div className="animate-pulse">Loading safety tip...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="font-bangers text-2xl text-gray-800 mb-4">Today's Safety Tip</h2>
      <div className="bg-[#F5F5F5] rounded-lg p-4 mb-4">
        <div className="flex flex-col sm:flex-row items-start">
          <div className="bg-[#FFC107] rounded-full p-2 mr-3 mb-2 sm:mb-0 flex-shrink-0">
            <i className={`fas ${todaysTip.icon} text-xl text-gray-800`}></i>
          </div>
          <div>
            <h3 className="font-fredoka text-lg text-gray-800 mb-1">{todaysTip.title}</h3>
            <p className="text-gray-600 text-sm sm:text-base">{todaysTip.content}</p>
          </div>
        </div>
      </div>
      <Link href="/safety-tips">
        <button className="w-full game-button bg-[#FF5722] hover:bg-orange-600 text-white py-2 rounded-lg font-fredoka">
          More Safety Tips
        </button>
      </Link>
    </section>
  );
}
