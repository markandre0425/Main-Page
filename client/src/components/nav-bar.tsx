import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { FaFire } from "react-icons/fa";
import { LuUser, LuMenu } from "react-icons/lu";

interface NavBarProps {
  className?: string;
}

export default function NavBar({ className = "" }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Games", path: "/games" },
    { name: "Progress", path: "/progress" },
    { name: "Resources", path: "/resources" },
    { name: "About", path: "/about" },
  ];

  const getAgeGroupBadge = () => {
    if (!user) return null;

    const badgeColors = {
      kids: "bg-water-blue text-white",
      preteens: "bg-green-600 text-white",
      teens: "bg-fire-orange text-white", 
      adults: "bg-fire-red text-white",
    };

    const ageGroupLabel = {
      kids: "Kids",
      preteens: "Pre-teens",
      teens: "Teens",
      adults: "Adults"
    };

    return (
      <span className={`absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-xs font-bold px-2 py-1 rounded-full ${badgeColors[user.ageGroup] || 'bg-fire-red text-white'}`}>
        {ageGroupLabel[user.ageGroup] || 'User'}
      </span>
    );
  };

  return (
    <header className="bg-gradient-to-r from-fire-red to-fire-orange shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <FaFire className="text-white text-3xl mr-3" />
          <h1 className="text-white font-bold text-3xl">APULA</h1>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a className={`text-white hover:text-safety-yellow font-medium transition duration-300 ${location === item.path ? 'text-safety-yellow' : ''}`}>
                {item.name}
              </a>
            </Link>
          ))}
          {/* Only show admin link for admin users */}
          {user?.id === 1 && (
            <Link href="/admin">
              <a className={`text-white hover:text-safety-yellow font-medium transition duration-300 ${location === '/admin' ? 'text-safety-yellow' : ''}`}>
                Admin
              </a>
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative hidden md:block">
              <Button 
                variant="secondary" 
                className="bg-white text-fire-red px-4 py-2 rounded-full font-bold flex items-center shadow-lg hover:bg-gray-100 transition"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <LuUser className="mr-2" />
                <span>{user.name}</span>
              </Button>
              {getAgeGroupBadge()}

              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <Link href="/profile">
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                    </Link>
                    <Link href="/achievements">
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Achievements</a>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth">
              <Button variant="secondary" className="hidden md:block">Login</Button>
            </Link>
          )}

          <button className="md:hidden text-white" onClick={toggleMenu}>
            <LuMenu className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg mx-4">
          <div className="flex flex-col p-4 space-y-3">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a className={`text-fire-red hover:text-fire-orange font-medium px-4 py-2 rounded hover:bg-gray-100 ${location === item.path ? 'bg-gray-100' : ''}`}>
                  {item.name}
                </a>
              </Link>
            ))}

            {user ? (
              <>
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="flex items-center px-4 py-2">
                    <LuUser className="text-fire-red mr-2 text-xl" />
                    <span className="font-medium">{user.name}</span>
                    <span className={`ml-auto text-xs font-bold px-2 py-1 rounded-full ${getAgeGroupBadge()}`}>
                      {user.ageGroup}
                    </span>
                  </div>
                </div>
                <Link href="/profile">
                  <a className="text-fire-red hover:text-fire-orange font-medium px-4 py-2 rounded hover:bg-gray-100">
                    Profile
                  </a>
                </Link>
                <Link href="/achievements">
                  <a className="text-fire-red hover:text-fire-orange font-medium px-4 py-2 rounded hover:bg-gray-100">
                    Achievements
                  </a>
                </Link>
                {user?.id === 1 && (
                  <Link href="/admin">
                    <a className="text-fire-red hover:text-fire-orange font-medium px-4 py-2 rounded hover:bg-gray-100">
                      Admin Dashboard
                    </a>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-fire-red hover:text-fire-orange font-medium px-4 py-2 rounded hover:bg-gray-100 text-left w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth">
                <a className="text-fire-red hover:text-fire-orange font-medium px-4 py-2 rounded hover:bg-gray-100">
                  Login
                </a>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}