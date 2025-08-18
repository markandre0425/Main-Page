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

  return (
    <header className="bg-gradient-to-r from-[#FF5722] to-[#E91E63] text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <i className="fas fa-fire text-[#FFC107] text-3xl mr-2 animate-flame"></i>
            <h1 className="font-bangers text-3xl md:text-4xl">APULA</h1>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/about">
            <span className="font-fredoka text-white hover:text-[#FFC107] transition-colors">About</span>
          </Link>
          {!user ? (
            <Link href="/auth">
              <span className="font-fredoka text-white hover:text-[#FFC107] transition-colors">Login</span>
            </Link>
          ) : (
            <>
              <Link href="/games">
                <span className="font-fredoka text-white hover:text-[#FFC107] transition-colors">Games</span>
              </Link>
              <Link href="/leaderboard">
                <span className="font-fredoka text-white hover:text-[#FFC107] transition-colors">Leaderboard</span>
              </Link>
              {user.isAdmin && (
                <Link href="/admin">
                  <span className="font-fredoka text-white hover:text-[#FFC107] transition-colors bg-blue-700 px-2 py-0.5 rounded">Admin</span>
                </Link>
              )}
              <button 
                onClick={handleLogout} 
                className="font-fredoka text-white hover:text-[#FFC107] transition-colors flex items-center"
              >
                <LogOut size={16} className="mr-1" />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
        
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
            <Link href="/about">
              <span className="block text-gray-800 hover:text-[#FF5722] transition-colors py-2">About</span>
            </Link>
            <Link href="/leaderboard">
              <span className="block text-gray-800 hover:text-[#FF5722] transition-colors py-2">Leaderboard</span>
            </Link>
            {!user ? (
              <Link href="/auth">
                <span className="block text-gray-800 hover:text-[#FF5722] transition-colors py-2">Login</span>
              </Link>
            ) : (
              <>
                <Link href="/games">
                  <span className="block text-gray-800 hover:text-[#FF5722] transition-colors py-2">Games</span>
                </Link>
                <Link href="/leaderboard">
                  <span className="block text-gray-800 hover:text-[#FF5722] transition-colors py-2">Leaderboard</span>
                </Link>
                <Link href="/profile">
                  <span className="block text-gray-800 hover:text-[#FF5722] transition-colors py-2">Profile</span>
                </Link>
                {user.isAdmin && (
                  <Link href="/admin">
                    <span className="block text-gray-800 hover:text-[#FF5722] transition-colors py-2 bg-blue-100 px-2 py-1 rounded">Admin</span>
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left text-gray-800 hover:text-[#FF5722] transition-colors py-2"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={handleCloseSettings} />
    </header>
  );
}
