import { Link, useLocation } from "wouter";
import { useState } from "react";
import SettingsModal from "./SettingsModal";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Menu, X } from "lucide-react";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const [, navigate] = useLocation();

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/auth');
      }
    });
  };

  // Navigation items from GameNav
  const navItems = [
    { name: "Home", path: "/", icon: "fa-home" },
    { name: "Games", path: "/games", icon: "fa-gamepad" },
    { name: "Learn", path: "/safety-tips", icon: "fa-book" },
    { name: "Profile", path: "/profile", icon: "fa-id-card" },
    { name: "Admin", path: "/admin", icon: "fa-lock", adminOnly: true },
  ];

  return (
    <header className="bg-gradient-to-r from-[#FF5722] to-[#E91E63] text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <i className="fas fa-fire text-[#FFC107] text-3xl mr-2 animate-flame"></i>
            <h1 className="font-bangers text-3xl md:text-4xl">APULA</h1>
          </div>
        </Link>
        
        {/* Integrated GameNav */}
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.filter(item => !item.adminOnly || user?.isAdmin).map((item) => (
            <Link key={item.path} href={item.path}>
              <motion.button 
                className={`game-button ${
                  location === item.path 
                    ? "bg-[#FFC107] text-gray-800" 
                    : "bg-white/20 text-white hover:bg-white/30"
                } px-4 py-2 rounded-full font-fredoka shadow-md flex items-center text-sm transition-all duration-200`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className={`fas ${item.icon} mr-2`}></i> 
                {item.name}
              </motion.button>
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-3">
          {user && (
            <>
              <div className="hidden md:flex items-center bg-white/20 rounded-full px-3 py-1">
                <i className="fas fa-star text-[#FFC107]"></i>
                <span className="ml-1 font-fredoka">{user.points || 0}</span>
              </div>
              <motion.button 
                className="bg-[#2196F3] hover:bg-blue-600 text-white px-3 py-1 rounded-full font-fredoka game-button flex items-center"
                onClick={handleOpenSettings}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-cog mr-1"></i> 
                <span className="hidden md:inline">Settings</span>
              </motion.button>
              <Link href="/avatar">
                <div className="rounded-full bg-white p-1 w-10 h-10 flex items-center justify-center overflow-hidden cursor-pointer">
                  {user.avatar ? (
                    <img 
                      src={`/assets/avatars/${user.avatar}.svg`} 
                      alt="Player Avatar" 
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = "https://ui-avatars.com/api/?name=Fire+Hero&background=E91E63&color=fff";
                      }}
                    />
                  ) : (
                    <img 
                      src="https://ui-avatars.com/api/?name=Fire+Hero&background=E91E63&color=fff" 
                      alt="Default Avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  )}
                </div>
              </Link>
            </>
          )}
          
          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {/* GameNav items for mobile */}
            {navItems.filter(item => !item.adminOnly || user?.isAdmin).map((item) => (
              <Link key={item.path} href={item.path}>
                <span 
                  className="block text-gray-800 hover:text-[#FF5722] transition-colors py-2 flex items-center"
                >
                  <i className={`fas ${item.icon} mr-3 text-lg`}></i>
                  {item.name}
                </span>
              </Link>
            ))}
            
            {/* Additional links */}
            <Link href="/about">
              <span 
                className="block text-gray-800 hover:text-[#FF5722] transition-colors py-2"
              >
                About
              </span>
            </Link>
          </div>
        </div>
      )}
      
      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={handleCloseSettings} />
    </header>
  );
}
