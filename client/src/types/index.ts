export interface GameStats {
  gameType: string;
  bestScore: number;
  timesPlayed: number;
  lastPlayed: Date;
}

export interface MissionProgress {
  missionId: number;
  completed: boolean;
  stepsCompleted: number;
  totalSteps: number;
}

export interface UserProfile {
  username: string;
  displayName: string;
  avatar: string;
  level: number;
  points: number;
  progress: number;
  achievements: {
    completedMissions: number[];
    earnedBadges: number[];
    unlockedMiniGames: number[];
  };
}

export interface HazardPosition {
  id: number;
  x: number;
  y: number;
  found: boolean;
}

export interface PassTechnique {
  step: string;
  description: string;
  completed: boolean;
}
