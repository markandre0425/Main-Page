import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { userData } = useUser();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);

  // Close modal when pressing escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
    // In a real app, we would save this to user preferences
  };

  const handleMusicToggle = () => {
    setMusicEnabled(!musicEnabled);
    // In a real app, we would save this to user preferences
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
    // In a real app, we would save this to user preferences
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div 
            className="fixed inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="relative z-10 bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="absolute top-3 right-3">
              <button 
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                onClick={onClose}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="font-bangers text-2xl text-gray-800">Game Settings</h2>
              <p className="text-gray-600 text-sm">Customize your game experience</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-3 bg-blue-100 p-2 rounded-full">
                      <i className="fas fa-volume-up text-[#2196F3]"></i>
                    </div>
                    <div>
                      <h4 className="font-fredoka text-lg">Sound Effects</h4>
                      <p className="text-sm text-gray-500">Game sounds and effects</p>
                    </div>
                  </div>
                  <motion.button 
                    className={`w-14 h-7 rounded-full flex items-center px-1 ${soundEnabled ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'}`}
                    onClick={handleSoundToggle}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div 
                      className="w-5 h-5 rounded-full bg-white"
                      layout
                    ></motion.div>
                  </motion.button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-3 bg-purple-100 p-2 rounded-full">
                      <i className="fas fa-music text-[#9C27B0]"></i>
                    </div>
                    <div>
                      <h4 className="font-fredoka text-lg">Background Music</h4>
                      <p className="text-sm text-gray-500">Game music and themes</p>
                    </div>
                  </div>
                  <motion.button 
                    className={`w-14 h-7 rounded-full flex items-center px-1 ${musicEnabled ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'}`}
                    onClick={handleMusicToggle}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div 
                      className="w-5 h-5 rounded-full bg-white"
                      layout
                    ></motion.div>
                  </motion.button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-3 bg-red-100 p-2 rounded-full">
                      <i className="fas fa-bell text-[#E91E63]"></i>
                    </div>
                    <div>
                      <h4 className="font-fredoka text-lg">Notifications</h4>
                      <p className="text-sm text-gray-500">Game alerts and reminders</p>
                    </div>
                  </div>
                  <motion.button 
                    className={`w-14 h-7 rounded-full flex items-center px-1 ${notifications ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'}`}
                    onClick={handleNotificationsToggle}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div 
                      className="w-5 h-5 rounded-full bg-white"
                      layout
                    ></motion.div>
                  </motion.button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-fredoka text-lg mb-2">Account Info</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-user text-gray-500 w-6"></i>
                    <span className="text-gray-800">{userData.displayName}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <i className="fas fa-trophy text-gray-500 w-6"></i>
                    <span className="text-gray-800">Level {userData.level}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-star text-gray-500 w-6"></i>
                    <span className="text-gray-800">{userData.points} points</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <motion.button 
                className="game-button bg-[#2196F3] hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-fredoka"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close Settings
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}