import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// import GameNav from "@/components/layout/GameNav"; // Removed - now integrated into Header
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";

interface Outfit {
  id: string;
  name: string;
  unlocked: boolean;
  unlockedAt?: number;
  previewUrl: string;
  special?: boolean;
}

interface Accessory {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  selected?: boolean;
}

export default function AvatarPage() {
  const [, navigate] = useLocation();
  const { userData, updateUserAvatar } = useUser();
  const [selectedOutfit, setSelectedOutfit] = useState(userData.avatar || "standard");
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);

  useEffect(() => {
    // In a real app, we would fetch these from the API
    const avatarOutfits: Outfit[] = [
      { id: "standard", name: "Standard", unlocked: true, previewUrl: "https://placehold.co/300x300/FF5722/FFFFFF/svg?text=Standard" },
      { id: "chief", name: "Fire Chief", unlocked: userData.level >= 10, unlockedAt: 10, previewUrl: "https://placehold.co/300x300/2196F3/FFFFFF/svg?text=Chief" },
      { id: "rescue", name: "Rescue", unlocked: true, special: true, previewUrl: "https://placehold.co/300x300/E91E63/FFFFFF/svg?text=Rescue" },
      { id: "water", name: "Water Brigade", unlocked: userData.level >= 8, unlockedAt: 8, previewUrl: "https://placehold.co/300x300/4CAF50/FFFFFF/svg?text=Water+Brigade" },
      { id: "hazmat", name: "Hazmat", unlocked: userData.level >= 15, unlockedAt: 15, previewUrl: "https://placehold.co/300x300/FFC107/FFFFFF/svg?text=Hazmat" },
      { id: "cadet", name: "Cadet", unlocked: userData.level >= 3, unlockedAt: 3, previewUrl: "https://placehold.co/300x300/9C27B0/FFFFFF/svg?text=Cadet" },
    ];
    
    const avatarAccessories: Accessory[] = [
      { id: "hat", name: "Helmet", icon: "fa-hat-cowboy", unlocked: true, selected: false },
      { id: "glasses", name: "Safety Goggles", icon: "fa-glasses", unlocked: true, selected: false },
      { id: "shield", name: "Shield", icon: "fa-shield-alt", unlocked: userData.level >= 5, unlockedAt: 5, selected: false },
      { id: "extinguisher", name: "Extinguisher", icon: "fa-fire-extinguisher", unlocked: true, selected: true },
      { id: "walkie", name: "Radio", icon: "fa-walkie-talkie", unlocked: userData.level >= 7, unlockedAt: 7, selected: false },
      { id: "mask", name: "Oxygen Mask", icon: "fa-head-side-mask", unlocked: userData.level >= 12, unlockedAt: 12, selected: false },
      { id: "axe", name: "Fire Axe", icon: "fa-axe", unlocked: userData.level >= 20, unlockedAt: 20, selected: false },
      { id: "boots", name: "Boots", icon: "fa-boot", unlocked: true, selected: false },
    ];
    
    setOutfits(avatarOutfits);
    setAccessories(avatarAccessories);
  }, [userData.level]);

  const handleOutfitSelect = (outfitId: string) => {
    const outfit = outfits.find(o => o.id === outfitId);
    if (outfit && outfit.unlocked) {
      setSelectedOutfit(outfitId);
      updateUserAvatar(outfitId);
    } else {
      alert(`This outfit will be unlocked at level ${outfit?.unlockedAt || "?"}`);
    }
  };

  const handleAccessoryToggle = (accessoryId: string) => {
    const accessory = accessories.find(a => a.id === accessoryId);
    if (accessory && accessory.unlocked) {
      setAccessories(prev => 
        prev.map(a => ({
          ...a,
          selected: a.id === accessoryId ? !a.selected : a.selected
        }))
      );
    } else {
      alert(`This accessory will be unlocked at level ${accessory?.unlockedAt || "?"}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="font-bangers text-3xl text-gray-800 mb-6">Customize Your Hero</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <motion.div 
                className="relative mb-6"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-64 h-64 bg-gray-100 rounded-full overflow-hidden border-4 border-[#FF5722]">
                  <img 
                    src={outfits.find(o => o.id === selectedOutfit)?.previewUrl || "https://placehold.co/300x300/FF5722/FFFFFF/svg?text=Fire+Hero"} 
                    alt="Current Avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="absolute bottom-2 right-2 bg-[#4CAF50] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                  <i className="fas fa-check"></i>
                </div>
              </motion.div>
              
              <div className="text-center">
                <h2 className="font-fredoka text-xl mb-2">Fire Hero</h2>
                <p className="text-gray-600 mb-4">Level {userData.level || 5}</p>
                <button 
                  className="game-button bg-[#4CAF50] hover:bg-green-600 text-white px-6 py-2 rounded-lg font-fredoka"
                  onClick={() => navigate("/")}
                >
                  Save Changes
                </button>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h2 className="font-fredoka text-2xl text-gray-800 mb-4">Outfits</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {outfits.map((outfit) => (
                  <div 
                    key={outfit.id}
                    className={`avatar-item p-2 rounded-lg border-2 ${selectedOutfit === outfit.id ? 'border-[#2196F3]' : 'border-transparent'} hover:border-[#2196F3]`}
                    onClick={() => handleOutfitSelect(outfit.id)}
                  >
                    <div className="relative">
                      <img 
                        src={outfit.previewUrl} 
                        alt={`${outfit.name} Outfit`} 
                        className={`w-full h-32 object-cover rounded-lg ${!outfit.unlocked ? 'opacity-50' : ''}`} 
                      />
                      {!outfit.unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-[#FFC107] text-gray-800 rounded-full px-2 py-1 text-xs font-fredoka">
                            <i className="fas fa-lock mr-1"></i> Level {outfit.unlockedAt}
                          </div>
                        </div>
                      )}
                      {outfit.special && (
                        <div className="absolute top-1 right-1">
                          <div className="bg-[#FF5722] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            <i className="fas fa-star"></i>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-center mt-2 font-nunito">{outfit.name}</p>
                  </div>
                ))}
              </div>
              
              <h2 className="font-fredoka text-2xl text-gray-800 mb-4">Accessories</h2>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {accessories.map((accessory) => (
                  <div 
                    key={accessory.id}
                    className={`p-3 rounded-lg ${
                      !accessory.unlocked 
                        ? 'bg-gray-100 opacity-50 cursor-not-allowed' 
                        : accessory.selected 
                          ? 'bg-[#2196F3]/10 border-2 border-[#2196F3]' 
                          : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
                    }`}
                    onClick={() => handleAccessoryToggle(accessory.id)}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-2 ${
                        accessory.selected ? 'bg-[#2196F3] text-white' : 'bg-white'
                      }`}>
                        <i className={`fas ${accessory.icon} text-lg`}></i>
                      </div>
                      <p className="text-center text-sm font-nunito">{accessory.name}</p>
                      {!accessory.unlocked && (
                        <span className="text-xs text-gray-500 mt-1">Level {accessory.unlockedAt}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
