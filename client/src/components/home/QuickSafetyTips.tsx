import { motion } from "framer-motion";

export default function QuickSafetyTips() {
  const safetyTips = [
    {
      id: 1,
      icon: "🔥",
      title: "Kitchen Safety",
      tip: "Never leave cooking unattended. Keep a lid nearby to smother small grease fires."
    },
    {
      id: 2,
      icon: "🏠",
      title: "Home Safety",
      tip: "Keep flammable items away from heat sources and never leave cooking unattended."
    },
    {
      id: 3,
      icon: "🔋",
      title: "Smoke Alarms",
      tip: "Test monthly and replace batteries yearly. Install on every level of your home."
    },
    {
      id: 4,
      icon: "🧯",
      title: "Fire Extinguisher",
      tip: "Remember PASS: Pull, Aim, Squeeze, Sweep. Keep one in your kitchen."
    }
  ];

  return (
    <section className="mb-8">
      <motion.h2 
        className="font-bangers text-3xl text-[#FF5722] mb-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Quick Safety Tips
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {safetyTips.map((tip, index) => (
          <motion.div
            key={tip.id}
            className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-l-4 border-[#FF5722] hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ translateY: -5 }}
          >
            <div className="text-4xl mb-3">{tip.icon}</div>
            <h3 className="font-fredoka text-lg text-gray-800 mb-2">{tip.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{tip.tip}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
