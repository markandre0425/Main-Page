import { useState, useEffect } from "react";
import MissionCard from "../missions/MissionCard";
import { Link } from "wouter";
import { Mission } from "@shared/schema";
import { missions } from "@/lib/gameData";

export default function MissionSection() {
  const [todaysMissions, setTodaysMissions] = useState<Mission[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call
    setTodaysMissions(missions.slice(0, 3));
  }, []);

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bangers text-3xl text-gray-800">Today's Missions</h2>
        <Link href="/mission/list">
          <button className="text-[#2196F3] hover:text-blue-700 font-fredoka flex items-center cursor-pointer">
            See All <i className="fas fa-chevron-right ml-1"></i>
          </button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {todaysMissions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>
    </section>
  );
}
