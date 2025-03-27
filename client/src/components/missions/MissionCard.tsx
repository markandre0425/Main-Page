import { Link } from "wouter";
import { motion } from "framer-motion";
import { Mission } from "@shared/schema";

interface MissionCardProps {
  mission: Mission;
}

export default function MissionCard({ mission }: MissionCardProps) {
  const difficultyColors = {
    beginner: 'bg-[#FF5722] text-white',
    intermediate: 'bg-[#FFC107] text-gray-800',
    advanced: 'bg-[#E91E63] text-white'
  };

  return (
    <motion.div 
      className="mission-card bg-white rounded-xl overflow-hidden shadow-lg"
      whileHover={{ translateY: -10, rotateY: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative">
        <img 
          src={mission.imageUrl || `https://placehold.co/500x240/2196F3/FFFFFF/svg?text=${mission.title}`}
          alt={mission.title} 
          className="w-full h-48 object-cover" 
        />
        <div className={`absolute top-2 left-2 ${difficultyColors[mission.difficulty as keyof typeof difficultyColors]} px-3 py-1 rounded-full font-fredoka text-sm`}>
          {mission.difficulty.charAt(0).toUpperCase() + mission.difficulty.slice(1)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-fredoka text-xl text-gray-800 mb-2">{mission.title}</h3>
        <p className="text-gray-600 mb-3">{mission.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <i className="fas fa-star text-[#FFC107] mr-1"></i>
            <span className="font-fredoka">{mission.points} points</span>
          </div>
          <Link href={`/mission/${mission.id}`}>
            <button className="game-button bg-[#4CAF50] hover:bg-green-600 text-white px-4 py-2 rounded-lg font-fredoka">
              Start
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
