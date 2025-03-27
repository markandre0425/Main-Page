import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

// Ensure all User properties are properly typed
type SafeUser = {
  id: number;
  username: string;
  password: string;
  displayName: string;
  points: number;
  level: number;
  progress: number;
  avatar: string;
  outfits: string[];
  accessories: string[];
  completedMissions: number[];
  earnedBadges: number[];
  unlockedMiniGames: number[];
};

interface UserContextProps {
  userData: SafeUser;
  isLoading: boolean;
  error: string | null;
  updateUserAvatar: (avatarId: string) => void;
  updateUserScore: (gameType: string, score: number) => void;
  completeMission: (missionId: number) => void;
}

// Default data with explicit types
const defaultUserData: SafeUser = {
  id: 0,
  username: "guest",
  password: "",
  displayName: "",
  points: 0,
  level: 1,
  progress: 0,
  avatar: "standard",
  outfits: [],
  accessories: [],
  completedMissions: [],
  earnedBadges: [],
  unlockedMiniGames: []
};

// Create context with default values
const UserContext = createContext<UserContextProps>({
  userData: defaultUserData,
  isLoading: false,
  error: null,
  updateUserAvatar: () => {},
  updateUserScore: () => {},
  completeMission: () => {}
});

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<SafeUser>(defaultUserData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // If user is authenticated, use their data
    if (user) {
      setUserData(prevData => ({
        ...prevData,
        id: user.id || prevData.id,
        username: user.username || prevData.username,
        displayName: user.displayName || user.username || prevData.username,
        // Ensure these values are taken from the authenticated user when available
        level: user.level || 1,
        points: user.points || 0,
        progress: user.progress || 0
      }));
    } else {
      setUserData(defaultUserData);
    }
  }, [user]);

  // Update avatar
  const updateUserAvatar = async (avatarId: string) => {
    try {
      setIsLoading(true);
      setUserData(prev => ({
        ...prev,
        avatar: avatarId
      }));
      setIsLoading(false);
    } catch (err) {
      setError("Failed to update avatar");
      setIsLoading(false);
    }
  };

  // Update score
  const updateUserScore = async (gameType: string, score: number) => {
    try {
      setIsLoading(true);
      setUserData(prev => {
        const pointsEarned = gameType === "spot-hazard" ? score * 10 : score * 20;
        return {
          ...prev,
          points: prev.points + pointsEarned,
          progress: Math.min(100, prev.progress + 5)
        };
      });
      setIsLoading(false);
    } catch (err) {
      setError("Failed to update score");
      setIsLoading(false);
    }
  };

  // Complete mission
  const completeMission = async (missionId: number) => {
    try {
      setIsLoading(true);
      setUserData(prev => {
        const completedMissions = prev.completedMissions.includes(missionId)
          ? prev.completedMissions
          : [...prev.completedMissions, missionId];
        
        const pointsEarned = missionId % 3 === 0 ? 75 : missionId % 2 === 0 ? 60 : 50;
        const newPoints = prev.points + pointsEarned;
        const pointsForNextLevel = prev.level * 100;
        const shouldLevelUp = newPoints >= pointsForNextLevel;
        
        return {
          ...prev,
          completedMissions,
          points: newPoints,
          level: shouldLevelUp ? prev.level + 1 : prev.level,
          progress: shouldLevelUp ? 0 : Math.min(100, prev.progress + 25),
          earnedBadges: shouldLevelUp 
            ? [...prev.earnedBadges, prev.level + 5]
            : prev.earnedBadges
        };
      });
      setIsLoading(false);
    } catch (err) {
      setError("Failed to complete mission");
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ 
      userData, 
      isLoading, 
      error, 
      updateUserAvatar,
      updateUserScore,
      completeMission
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = () => useContext(UserContext);
