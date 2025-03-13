export const gameEnhancements = {
  // Difficulty Progression System
  difficultyLevels: {
    BEGINNER: { timeLimit: 120, hints: 3, pointMultiplier: 1 },
    INTERMEDIATE: { timeLimit: 90, hints: 2, pointMultiplier: 1.5 },
    ADVANCED: { timeLimit: 60, hints: 1, pointMultiplier: 2 }
  },
  
  // Combo System
  comboSystem: {
    threshold: 3, // Consecutive correct answers needed
    multiplier: 1.5, // Score multiplier when combo is active
    duration: 10000 // Time window in milliseconds
  },
  
  // Power-ups
  powerUps: {
    EXTRA_TIME: { duration: 30, rarity: "common" },
    DOUBLE_POINTS: { duration: 15, rarity: "rare" },
    ELIMINATE_WRONG: { duration: 1, rarity: "epic" }
  }
};