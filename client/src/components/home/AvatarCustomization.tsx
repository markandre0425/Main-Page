import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Link } from "wouter";
import { motion } from "framer-motion";

const avatarOptions = [
  { id: "standard", name: "Standard", unlocked: true, previewUrl: "https://placehold.co/150x150/FF5722/FFFFFF/svg?text=Standard" },
  { id: "chief", name: "Chief", unlocked: false, unlockedAt: 10, previewUrl: "https://placehold.co/150x150/2196F3/FFFFFF/svg?text=Chief" },
  { id: "rescue", name: "Rescue", unlocked: true, previewUrl: "https://placehold.co/150x150/E91E63/FFFFFF/svg?text=Rescue" },
];

const accessoryOptions = [
  { id: "hat", icon: "fa-hat-cowboy" },
  { id: "glasses", icon: "fa-glasses" },
  { id: "shield", icon: "fa-shield-alt" },
  { id: "extinguisher", icon: "fa-fire-extinguisher", selected: true },
  { id: "walkie", icon: "fa-walkie-talkie" },
];

export default function AvatarCustomization() {
  const { userData, updateUserAvatar } = useUser();
  const [selectedOutfit, setSelectedOutfit] = useState(userData.avatar || "standard");

  const handleOutfitSelect = (outfitId: string) => {
    const outfit = avatarOptions.find(o => o.id === outfitId);
    if (outfit && outfit.unlocked) {
      setSelectedOutfit(outfitId);
      updateUserAvatar(outfitId);
    } else {
      alert(`This outfit will be unlocked at level ${outfit?.unlockedAt || "?"}`);
    }
  };

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bangers text-3xl text-gray-800">Customize Your Hero</h2>
        <Link href="/avatar">
          <button className="text-[#2196F3] hover:text-blue-700 font-fredoka flex items-center cursor-pointer">
            More Options <i className="fas fa-chevron-right ml-1"></i>
          </button>
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex justify-center">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-48 h-48 bg-gray-100 rounded-full overflow-hidden border-4 border-[#FF5722]">
                <img 
                  src={avatarOptions.find(o => o.id === selectedOutfit)?.previewUrl || "https://placehold.co/300x300/FF5722/FFFFFF/svg?text=Fire+Hero"} 
                  alt="Current Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-[#4CAF50] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                <i className="fas fa-check"></i>
              </div>
            </motion.div>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="font-fredoka text-xl text-gray-800 mb-3">Select Your Outfit</h3>
            
            <div className="grid grid-cols-3 gap-3">
              {avatarOptions.map((option) => (
                <div 
                  key={option.id}
                  className={`avatar-item p-2 rounded-lg border-2 ${selectedOutfit === option.id ? 'border-[#2196F3]' : 'border-transparent'} hover:border-[#2196F3]`}
                  onClick={() => handleOutfitSelect(option.id)}
                >
                  <div className="relative">
                    <img 
                      src={option.previewUrl} 
                      alt={`${option.name} Outfit`} 
                      className={`w-full h-24 object-cover rounded-lg ${!option.unlocked ? 'opacity-50' : ''}`} 
                    />
                    {!option.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-[#FFC107] text-gray-800 rounded-full px-2 py-1 text-xs font-fredoka">
                          <i className="fas fa-lock mr-1"></i> Level {option.unlockedAt}
                        </div>
                      </div>
                    )}
                    {option.id === 'rescue' && (
                      <div className="absolute top-1 right-1">
                        <div className="bg-[#FF5722] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          <i className="fas fa-star"></i>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-center mt-1 font-nunito text-sm">{option.name}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <h3 className="font-fredoka text-xl text-gray-800 mb-3">Accessories</h3>
              <div className="flex flex-wrap gap-3">
                {accessoryOptions.map((accessory) => (
                  <button 
                    key={accessory.id}
                    className={`${accessory.selected ? 'bg-[#2196F3] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} rounded-full p-2 h-10 w-10 flex items-center justify-center`}
                  >
                    <i className={`fas ${accessory.icon}`}></i>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
