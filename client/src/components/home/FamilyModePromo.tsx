import { motion } from "framer-motion";
import { useState } from "react";

export default function FamilyModePromo() {
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <section className="bg-gradient-to-r from-[#FFC107] to-[#FF5722] rounded-2xl p-6 text-white shadow-xl mb-8">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-2/3 mb-6 md:mb-0 text-center md:text-left">
          <motion.h2 
            className="font-bangers text-3xl md:text-4xl mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Play with Your Family!
          </motion.h2>
          <p className="font-nunito text-md sm:text-lg mb-4 max-w-2xl">
            Invite family members to join your team and complete safety missions together. 
            Create a home fire escape plan as a family activity!
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <motion.button 
              className="game-button bg-white text-[#FF5722] hover:bg-gray-100 px-6 py-3 rounded-xl font-fredoka text-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInfo(!showInfo)}
            >
              <i className="fas fa-users mr-2"></i> Activate Family Mode
            </motion.button>
            <button 
              className="game-button bg-white/30 hover:bg-white/40 text-white px-6 py-3 rounded-xl font-fredoka text-lg shadow-md"
              onClick={() => setShowInfo(!showInfo)}
            >
              <i className="fas fa-info-circle mr-2"></i> Learn More
            </button>
          </div>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <motion.img 
            src="https://placehold.co/300x300/E91E63/FFFFFF/svg?text=Family+Mode" 
            alt="Family playing together" 
            className="rounded-xl shadow-lg w-48 h-48 object-cover"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
      </div>
      
      {showInfo && (
        <motion.div 
          className="mt-4 bg-white/20 rounded-xl p-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="font-fredoka text-xl mb-2">About Family Mode:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
            <li>Create a family group and invite up to 6 family members</li>
            <li>Complete special family missions together</li>
            <li>Practice fire drills and escape plans</li>
            <li>Earn exclusive family badges and rewards</li>
            <li>Track everyone's progress in fire safety training</li>
          </ul>
          <p className="mt-3 text-white/80 text-sm italic">Family mode will be available in the next update!</p>
        </motion.div>
      )}
    </section>
  );
}
