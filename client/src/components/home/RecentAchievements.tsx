import { motion } from "framer-motion";
import { Link } from "wouter";

export default function RecentAchievements() {
  const achievements = [
    {
      id: 1,
      icon: "🏆",
      title: "Safety Champion",
      description: "Complete 5 fire safety missions",
      progress: 3,
      total: 5,
      color: "from-yellow-400 to-orange-500"
    },
    {
      id: 2,
      icon: "🔥",
      title: "Fire Fighter",
      description: "Successfully use fire extinguisher in training",
      progress: 1,
      total: 1,
      color: "from-red-500 to-pink-600"
    },
    {
      id: 3,
      icon: "🎮",
      title: "Game Master",
      description: "Complete 3 different mini-games",
      progress: 1,
      total: 3,
      color: "from-blue-500 to-indigo-600"
    },
    {
      id: 4,
      icon: "🔔",
      title: "Alarm Master",
      description: "Test all smoke detectors in home",
      progress: 0,
      total: 1,
      color: "from-green-500 to-teal-600"
    },
    {
      id: 5,
      icon: "📚",
      title: "Quiz Master",
      description: "Complete the Fire Safety Quiz",
      progress: 0,
      total: 1,
      color: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <motion.h2 
          className="font-bangers text-3xl text-[#9C27B0]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Recent Achievements
        </motion.h2>
        <Link href="/profile">
          <button className="text-[#9C27B0] hover:text-purple-700 font-fredoka flex items-center cursor-pointer">
            View All <i className="fas fa-trophy ml-1"></i>
          </button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ translateY: -5 }}
          >
            <div className="text-4xl mb-3">{achievement.icon}</div>
            <h3 className="font-fredoka text-lg text-gray-800 mb-2">{achievement.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{achievement.description}</p>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{achievement.progress}/{achievement.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 bg-gradient-to-r ${achievement.color} rounded-full transition-all duration-500`}
                  style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {achievement.progress === achievement.total && (
              <div className="text-center">
                <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  COMPLETED! 🎉
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
