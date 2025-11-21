import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';

export interface UserProgress {
  levelProgress: number;
  missionsCompleted: number;
  quizzesTaken: number;
  gamesPlayed: number;
  achievementsEarned: number;
  totalTimeSpent: number; // in minutes
  highestScore: number;
  lastActivity: string;
}

export interface GameSession {
  gameId: string;
  gameName: string;
  score: number;
  timeSpent: number; // in minutes
  completed: boolean;
  timestamp: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export function useUserProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress>({
    levelProgress: 0,
    missionsCompleted: 0,
    quizzesTaken: 0,
    gamesPlayed: 0,
    achievementsEarned: 0,
    totalTimeSpent: 0,
    highestScore: 0,
    lastActivity: new Date().toISOString()
  });

  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    if (!user) return;

    const loadProgress = () => {
      const savedProgress = localStorage.getItem(`userProgress_${user.id}`);
      const savedSessions = localStorage.getItem(`gameSessions_${user.id}`);
      const savedAchievements = localStorage.getItem(`achievements_${user.id}`);

      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }

      if (savedSessions) {
        setGameSessions(JSON.parse(savedSessions));
      }

      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements));
      } else {
        // Initialize default achievements
        const defaultAchievements: Achievement[] = [
          {
            id: 'first_game',
            title: 'First Steps',
            description: 'Play your first game',
            icon: '🎮',
            earned: false,
            progress: 0,
            maxProgress: 1
          },
          {
            id: 'quiz_master',
            title: 'Quiz Master',
            description: 'Complete 5 quizzes',
            icon: '📚',
            earned: false,
            progress: 0,
            maxProgress: 5
          },
          {
            id: 'mission_complete',
            title: 'Mission Complete',
            description: 'Complete 3 missions',
            icon: '🎯',
            earned: false,
            progress: 0,
            maxProgress: 3
          },
          {
            id: 'high_scorer',
            title: 'High Scorer',
            description: 'Score 90% or higher on any game',
            icon: '⭐',
            earned: false,
            progress: 0,
            maxProgress: 90
          },
          {
            id: 'time_master',
            title: 'Time Master',
            description: 'Spend 2 hours playing games',
            icon: '⏰',
            earned: false,
            progress: 0,
            maxProgress: 120
          }
        ];
        setAchievements(defaultAchievements);
        localStorage.setItem(`achievements_${user.id}`, JSON.stringify(defaultAchievements));
      }
    };

    loadProgress();
  }, [user]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`userProgress_${user.id}`, JSON.stringify(progress));
  }, [progress, user]);

  // Save game sessions to localStorage whenever it changes
  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`gameSessions_${user.id}`, JSON.stringify(gameSessions));
  }, [gameSessions, user]);

  // Save achievements to localStorage whenever it changes
  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`achievements_${user.id}`, JSON.stringify(achievements));
  }, [achievements, user]);

  const recordGameSession = (session: Omit<GameSession, 'timestamp'>) => {
    const newSession: GameSession = {
      ...session,
      timestamp: new Date().toISOString()
    };

    setGameSessions(prev => [...prev, newSession]);

    // Update progress based on game session
    setProgress(prev => {
      const newProgress = { ...prev };
      
      // Update games played
      newProgress.gamesPlayed += 1;
      
      // Update total time spent
      newProgress.totalTimeSpent += session.timeSpent;
      
      // Update highest score
      if (session.score > newProgress.highestScore) {
        newProgress.highestScore = session.score;
      }
      
      // Update last activity
      newProgress.lastActivity = newSession.timestamp;
      
      // Update level progress (simplified calculation)
      newProgress.levelProgress = Math.min(100, Math.floor((newProgress.gamesPlayed * 10) + (newProgress.totalTimeSpent / 2)));
      
      return newProgress;
    });

    // Check for achievements
    checkAchievements(newSession);
  };

  const recordQuizCompletion = (score: number, timeSpent: number) => {
    setProgress(prev => ({
      ...prev,
      quizzesTaken: prev.quizzesTaken + 1,
      totalTimeSpent: prev.totalTimeSpent + timeSpent,
      highestScore: Math.max(prev.highestScore, score),
      lastActivity: new Date().toISOString()
    }));

    // Check quiz-related achievements
    checkQuizAchievements(score);
  };

  const recordMissionCompletion = (missionId: string) => {
    setProgress(prev => ({
      ...prev,
      missionsCompleted: prev.missionsCompleted + 1,
      lastActivity: new Date().toISOString()
    }));

    // Check mission-related achievements
    checkMissionAchievements();
  };

  const checkAchievements = (session: GameSession) => {
    setAchievements(prev => {
      const updated = [...prev];
      
      // First game achievement
      const firstGame = updated.find(a => a.id === 'first_game');
      if (firstGame && !firstGame.earned && progress.gamesPlayed >= 0) {
        firstGame.earned = true;
        firstGame.earnedAt = session.timestamp;
        firstGame.progress = 1;
      }
      
      // High scorer achievement
      const highScorer = updated.find(a => a.id === 'high_scorer');
      if (highScorer && !highScorer.earned && session.score >= 90) {
        highScorer.earned = true;
        highScorer.earnedAt = session.timestamp;
        highScorer.progress = session.score;
      }
      
      // Time master achievement
      const timeMaster = updated.find(a => a.id === 'time_master');
      if (timeMaster && !timeMaster.earned) {
        const totalMinutes = progress.totalTimeSpent + session.timeSpent;
        timeMaster.progress = totalMinutes;
        if (totalMinutes >= 120) {
          timeMaster.earned = true;
          timeMaster.earnedAt = session.timestamp;
        }
      }
      
      return updated;
    });
  };

  const checkQuizAchievements = (score: number) => {
    setAchievements(prev => {
      const updated = [...prev];
      
      const quizMaster = updated.find(a => a.id === 'quiz_master');
      if (quizMaster) {
        quizMaster.progress = progress.quizzesTaken + 1;
        if (quizMaster.progress >= quizMaster.maxProgress!) {
          quizMaster.earned = true;
          quizMaster.earnedAt = new Date().toISOString();
        }
      }
      
      return updated;
    });
  };

  const checkMissionAchievements = () => {
    setAchievements(prev => {
      const updated = [...prev];
      
      const missionComplete = updated.find(a => a.id === 'mission_complete');
      if (missionComplete) {
        missionComplete.progress = progress.missionsCompleted + 1;
        if (missionComplete.progress >= missionComplete.maxProgress!) {
          missionComplete.earned = true;
          missionComplete.earnedAt = new Date().toISOString();
        }
      }
      
      return updated;
    });
  };

  const getFormattedTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getRecentGames = (limit: number = 5): GameSession[] => {
    return gameSessions
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  };

  const getEarnedAchievements = (): Achievement[] => {
    return achievements.filter(a => a.earned);
  };

  return {
    progress,
    gameSessions,
    achievements,
    recordGameSession,
    recordQuizCompletion,
    recordMissionCompletion,
    getFormattedTime,
    getRecentGames,
    getEarnedAchievements
  };
}
