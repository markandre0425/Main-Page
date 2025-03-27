import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

type NavItem = {
  name: string;
  path: string;
  icon: string;
  adminOnly?: boolean;
};

export default function GameNav() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  // Check if user is admin
  const isAdmin = user?.isAdmin;
  
  const navItems: NavItem[] = [
    { name: "Home", path: "/", icon: "fa-home" },
    { name: "Missions", path: "/mission/list", icon: "fa-tasks" },
    { name: "Games", path: "/games", icon: "fa-gamepad" },
    { name: "My Hero", path: "/avatar", icon: "fa-user-astronaut" },
    { name: "Profile", path: "/profile", icon: "fa-id-card" },
    { name: "Rewards", path: "/rewards", icon: "fa-trophy" },
    { name: "Admin", path: "/admin", icon: "fa-lock", adminOnly: true },
  ];

  return (
    <nav className="mb-6">
      <ul className="flex overflow-x-auto pb-2 space-x-2 md:space-x-4 md:justify-center">
        {navItems.filter(item => !item.adminOnly || isAdmin).map((item) => (
          <li key={item.path}>
            <Link href={item.path}>
              <button 
                className={`game-button ${
                  location === item.path 
                    ? "bg-[#E91E63] text-white" 
                    : "bg-white text-gray-700"
                } px-4 py-2 rounded-xl font-fredoka shadow-md flex items-center`}
              >
                <i className={`fas ${item.icon} mr-2`}></i> {item.name}
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
