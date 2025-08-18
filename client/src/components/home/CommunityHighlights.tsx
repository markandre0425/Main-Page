import { motion } from "framer-motion";

export default function CommunityHighlights() {
  const highlights = [
    {
      id: 1,
      type: "achievement",
      user: "Sarah M.",
      action: "completed the Fire Safety Maze",
      time: "2 hours ago",
      icon: "🎯",
      color: "from-green-500 to-emerald-600"
    },
    {
      id: 2,
      type: "leaderboard",
      user: "Mike R.",
      action: "set a new record in 3D Fire Main",
      time: "5 hours ago",
      icon: "🏆",
      color: "from-yellow-400 to-orange-500"
    },
    {
      id: 3,
      type: "mission",
      user: "Emma L.",
      action: "started learning about kitchen safety",
      time: "1 day ago",
      icon: "📚",
      color: "from-blue-500 to-indigo-600"
    },
    {
      id: 4,
      type: "community",
      user: "Alex K.",
      action: "shared a fire safety tip",
      time: "2 days ago",
      icon: "💡",
      color: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <section className="mb-8">
      <motion.h2 
        className="font-bangers text-3xl text-[#4CAF50] mb-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Community Highlights
      </motion.h2>
      
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.id}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${highlight.color} flex items-center justify-center text-white text-xl`}>
                  {highlight.icon}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">
                    <span className="text-[#4CAF50] font-bold">{highlight.user}</span>
                    <span className="text-gray-600"> {highlight.action}</span>
                  </p>
                  <p className="text-gray-500 text-sm">{highlight.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <motion.button 
            className="bg-gradient-to-r from-[#4CAF50] to-emerald-600 text-white px-6 py-3 rounded-lg font-fredoka hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join the Community! 🌟
          </motion.button>
        </div>
      </div>
    </section>
  );
}
