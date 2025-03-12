import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { gameTypes, ageGroups } from "@shared/schema";

// Function to initialize game data if none exists
async function initializeGameData() {
  try {
    // Check if there's any quiz data
    const quizzes = await storage.getQuizzes();
    if (quizzes.length === 0) {
      console.log('No game data found. Seeding initial game data...');
      await seedGameData();
      console.log('Game data seeded successfully');
    }
  } catch (error) {
    console.error('Error initializing game data:', error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up authentication routes
  setupAuth(app);

  // Initialize game data if none exists
  await initializeGameData();

  // API Routes

  // Age group validation middleware
  const validateAgeGroup = (req, res, next) => {
    const { ageGroup } = req.query;
    if (ageGroup && !Object.values(ageGroups).includes(ageGroup)) {
      return res.status(400).json({ message: "Invalid age group" });
    }
    next();
  };

  // Admin validation middleware
  const requireAdmin = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // For simplicity, we're considering user with ID 1 as admin
    // In a real app, you would have a proper role system
    if (req.user.id !== 1 && req.user.username !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  };

  // Quiz routes
  app.get("/api/quizzes", validateAgeGroup, async (req, res, next) => {
    try {
      const ageGroup = req.query.ageGroup as string | undefined;
      const quizzes = await storage.getQuizzes(ageGroup);
      res.json(quizzes);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/quizzes/:id", async (req, res, next) => {
    try {
      const quizId = parseInt(req.params.id);
      const quiz = await storage.getQuiz(quizId);

      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      const questions = await storage.getQuizQuestions(quizId);
      res.json({ ...quiz, questions });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/quizzes", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const quiz = await storage.createQuiz(req.body);
      res.status(201).json(quiz);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/quizzes/:id/questions", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const quizId = parseInt(req.params.id);
      const quiz = await storage.getQuiz(quizId);

      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      const question = await storage.createQuizQuestion({
        ...req.body,
        quizId,
      });

      res.status(201).json(question);
    } catch (err) {
      next(err);
    }
  });

  // Crossword routes
  app.get("/api/crosswords", validateAgeGroup, async (req, res, next) => {
    try {
      const ageGroup = req.query.ageGroup as string | undefined;
      const crosswords = await storage.getCrosswords(ageGroup);
      res.json(crosswords);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/crosswords/:id", async (req, res, next) => {
    try {
      const crosswordId = parseInt(req.params.id);
      const crossword = await storage.getCrossword(crosswordId);

      if (!crossword) {
        return res.status(404).json({ message: "Crossword not found" });
      }

      res.json(crossword);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/crosswords", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const crossword = await storage.createCrossword(req.body);
      res.status(201).json(crossword);
    } catch (err) {
      next(err);
    }
  });

  // Word scramble routes
  app.get("/api/word-scrambles", validateAgeGroup, async (req, res, next) => {
    try {
      const ageGroup = req.query.ageGroup as string | undefined;
      const wordScrambles = await storage.getWordScrambles(ageGroup);
      res.json(wordScrambles);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/word-scrambles/:id", async (req, res, next) => {
    try {
      const wordScrambleId = parseInt(req.params.id);
      const wordScramble = await storage.getWordScramble(wordScrambleId);

      if (!wordScramble) {
        return res.status(404).json({ message: "Word scramble not found" });
      }

      res.json(wordScramble);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/word-scrambles", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const wordScramble = await storage.createWordScramble(req.body);
      res.status(201).json(wordScramble);
    } catch (err) {
      next(err);
    }
  });

  // Word pics routes
  app.get("/api/word-pics", validateAgeGroup, async (req, res, next) => {
    try {
      const ageGroup = req.query.ageGroup as string | undefined;
      const wordPics = await storage.getWordPics(ageGroup);
      res.json(wordPics);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/word-pics/:id", async (req, res, next) => {
    try {
      const wordPicId = parseInt(req.params.id);
      const wordPic = await storage.getWordPic(wordPicId);

      if (!wordPic) {
        return res.status(404).json({ message: "Word pics not found" });
      }

      res.json(wordPic);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/word-pics", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const wordPic = await storage.createWordPic(req.body);
      res.status(201).json(wordPic);
    } catch (err) {
      next(err);
    }
  });

  // Progress routes
  app.get("/api/progress", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const userProgress = await storage.getUserProgress(req.user!.id);
      res.json(userProgress);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/progress", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const { gameType, gameId, completed, score } = req.body;

      if (!gameType || !Object.values(gameTypes).includes(gameType)) {
        return res.status(400).json({ message: "Invalid game type" });
      }

      if (!gameId) {
        return res.status(400).json({ message: "Game ID is required" });
      }

      // Add timestamp to track when progress was updated
      const now = new Date();

      const progress = await storage.updateUserProgress(
        req.user!.id,
        gameType,
        gameId,
        { 
          completed, 
          score,
          updatedAt: now.toISOString() 
        }
      );

      // Get latest progress to return the most up-to-date data
      const latestProgress = await storage.getUserProgress(req.user!.id);

      // Send response with real-time updates
      res.json({
        updatedItem: progress,
        allProgress: latestProgress,
        timestamp: now.toISOString()
      });

      // Check for achievements
      await checkAchievements(req.user!.id);
    } catch (err) {
      next(err);
    }
  });

  // User routes
  // Update user basic information
  app.patch("/api/user", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const { name, email } = req.body;

      // Basic validation
      if ((!name && !email) || (name && name.length < 2) || (email && !email.includes('@'))) {
        return res.status(400).json({ message: "Invalid user data" });
      }

      // Create an update object with only the provided fields
      const updateData: Partial<User> = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;

      const updatedUser = await storage.updateUser(req.user!.id, updateData);

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update the user in the session
      req.login(updatedUser, (err) => {
        if (err) return next(err);

        // Return the updated user without the password
        const { password, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
      });
    } catch (err) {
      next(err);
    }
  });

  // Update user age group
  app.put("/api/user/age-group", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const { ageGroup } = req.body;

      if (!ageGroup || !Object.values(ageGroups).includes(ageGroup)) {
        return res.status(400).json({ message: "Invalid age group" });
      }

      const updatedUser = await storage.updateUser(req.user!.id, { ageGroup });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update the user in the session
      req.login(updatedUser, (err) => {
        if (err) return next(err);

        // Return the updated user without the password
        const { password, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
      });
    } catch (err) {
      next(err);
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (_req, res, next) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/user/achievements", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const userAchievements = await storage.getUserAchievements(req.user!.id);
      res.json(userAchievements);
    } catch (err) {
      next(err);
    }
  });

  // Admin routes

  // Get all users (admin only)
  app.get("/api/admin/users", requireAdmin, async (req, res, next) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const sanitizedUsers = users.map(({ password, ...user }) => user);
      res.json(sanitizedUsers);
    } catch (err) {
      next(err);
    }
  });

  // Get user count (admin only)
  app.get("/api/admin/users/count", requireAdmin, async (req, res, next) => {
    try {
      const users = await storage.getAllUsers();
      res.json({ count: users.length });
    } catch (err) {
      next(err);
    }
  });

  // Create user (admin only)
  app.post("/api/admin/users", requireAdmin, async (req, res, next) => {
    try {
      const { username, name, email, ageGroup, isAdmin } = req.body;

      // Check if user exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Use a default password (in a real app, you'd send an invite with a temporary password)
      const password = "password123";

      // Create user
      const user = await storage.createUser({
        username,
        password, // In a real app, this would be hashed
        name,
        email,
        ageGroup
      });

      // Don't send the password back
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json(userWithoutPassword);
    } catch (err) {
      next(err);
    }
  });

  // Delete user (admin only)
  app.delete("/api/admin/users/:id", requireAdmin, async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id);

      // Don't allow deleting the admin user
      if (userId === 1) {
        return res.status(403).json({ message: "Cannot delete admin user" });
      }

      const success = await storage.deleteUser(userId);

      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (err) {
      next(err);
    }
  });

  // Create achievement (admin only)
  app.post("/api/admin/achievements", requireAdmin, async (req, res, next) => {
    try {
      const { title, description, icon, condition, threshold } = req.body;

      const achievement = await storage.createAchievement({
        title,
        description,
        icon,
        condition,
        threshold
      });

      res.status(201).json(achievement);
    } catch (err) {
      next(err);
    }
  });

  // Delete achievement (admin only)
  app.delete("/api/admin/achievements/:id", requireAdmin, async (req, res, next) => {
    try {
      const achievementId = parseInt(req.params.id);

      const success = await storage.deleteAchievement(achievementId);

      if (!success) {
        return res.status(404).json({ message: "Achievement not found" });
      }

      res.json({ message: "Achievement deleted successfully" });
    } catch (err) {
      next(err);
    }
  });

  // Get game counts (admin only)
  app.get("/api/admin/games/count", requireAdmin, async (req, res, next) => {
    try {
      const [quizzes, crosswords, wordScrambles, wordPics] = await Promise.all([
        storage.getQuizzes(),
        storage.getCrosswords(),
        storage.getWordScrambles(),
        storage.getWordPics()
      ]);

      res.json({
        quizzes: quizzes.length,
        crosswords: crosswords.length,
        wordScrambles: wordScrambles.length,
        wordPics: wordPics.length
      });
    } catch (err) {
      next(err);
    }
  });

  // Get progress summary (admin only)
  app.get("/api/admin/progress/summary", requireAdmin, async (req, res, next) => {
    try {
      // In a real app, you would compute these values from actual progress data
      // For this example, we'll return mock data
      res.json({
        completionRate: 68,
        averageScore: 82,
        byAgeGroup: {
          [ageGroups.KIDS]: 75,
          [ageGroups.PRETEENS]: 82,
          [ageGroups.TEENS]: 65,
          [ageGroups.ADULTS]: 90
        }
      });
    } catch (err) {
      next(err);
    }
  });

  // Seed initial game data (admin only)
  app.post("/api/admin/seed", requireAdmin, async (req, res, next) => {
    try {
      await seedGameData();
      res.json({ message: "Game data seeded successfully" });
    } catch (err) {
      next(err);
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to check and award achievements
async function checkAchievements(userId: number) {
  const userProgress = await storage.getUserProgress(userId);
  const achievements = await storage.getAchievements();

  // Check quiz achievements
  const quizCompletions = userProgress.filter(
    up => up.gameType === gameTypes.QUIZ && up.completed
  ).length;

  const quizMasterAchievement = achievements.find(a => a.condition === "QUIZZES_COMPLETED");
  if (quizMasterAchievement && quizCompletions >= quizMasterAchievement.threshold) {
    await storage.awardAchievement(userId, quizMasterAchievement.id);
  }

  // Check crossword achievements
  const crosswordCompletions = userProgress.filter(
    up => up.gameType === gameTypes.CROSSWORD && up.completed
  ).length;

  const crosswordExpertAchievement = achievements.find(a => a.condition === "CROSSWORDS_COMPLETED");
  if (crosswordExpertAchievement && crosswordCompletions >= crosswordExpertAchievement.threshold) {
    await storage.awardAchievement(userId, crosswordExpertAchievement.id);
  }

  // Check word pics achievements
  const wordPicsCompletions = userProgress.filter(
    up => up.gameType === gameTypes.WORD_PICS && up.completed
  ).length;

  const picturePerfectAchievement = achievements.find(a => a.condition === "WORD_PICS_COMPLETED");
  if (picturePerfectAchievement && wordPicsCompletions >= picturePerfectAchievement.threshold) {
    await storage.awardAchievement(userId, picturePerfectAchievement.id);
  }

  // Check word scramble achievements
  const wordScrambleCompletions = userProgress.filter(
    up => up.gameType === gameTypes.WORD_SCRAMBLE && up.completed
  ).length;

  const wordWizardAchievement = achievements.find(a => a.condition === "WORD_SCRAMBLES_COMPLETED");
  if (wordWizardAchievement && wordScrambleCompletions >= wordWizardAchievement.threshold) {
    await storage.awardAchievement(userId, wordWizardAchievement.id);
  }

  // Check perfect score achievements
  const perfectScores = userProgress.filter(
    up => up.score === 100
  ).length;

  const perfectScoreAchievement = achievements.find(a => a.condition === "PERFECT_SCORE");
  if (perfectScoreAchievement && perfectScores >= perfectScoreAchievement.threshold) {
    await storage.awardAchievement(userId, perfectScoreAchievement.id);
  }
}

// Function to seed initial game data
async function seedGameData() {
  // Seed quiz data
  const basicQuiz = await storage.createQuiz({
    title: "Fire Safety Basics",
    description: "Learn the fundamental principles of fire safety with this quiz",
    ageGroup: ageGroups.ALL,
    difficulty: "beginner",
  });

  await storage.createQuizQuestion({
    quizId: basicQuiz.id,
    question: "What should you do if your clothes catch fire?",
    options: ["Run outside for help", "Stop, drop, and roll", "Take off your clothes immediately", "Find water to pour on yourself"],
    correctAnswer: "Stop, drop, and roll",
    explanation: "Stop, drop, and roll is the safest way to extinguish flames on your clothing.",
    ageGroup: ageGroups.ALL,
  });

  await storage.createQuizQuestion({
    quizId: basicQuiz.id,
    question: "What number should you call in case of a fire emergency in the US?",
    options: ["911", "811", "711", "411"],
    correctAnswer: "911",
    explanation: "In the United States, dial 911 for any emergency services including fire, police, and medical.",
    ageGroup: ageGroups.ALL,
  });

  // Seed crossword data
  await storage.createCrossword({
    title: "Fire Safety Terms",
    description: "Test your knowledge of fire safety vocabulary",
    ageGroup: ageGroups.PRETEENS,
    difficulty: "intermediate",
    grid: [
      ["", "", "F", "", "", "", ""],
      ["", "", "I", "", "", "", ""],
      ["", "", "R", "", "", "", ""],
      ["S", "M", "E", "L", "D", "E", "R"],
      ["", "", "", "A", "", "", ""],
      ["", "", "", "D", "", "", ""],
      ["", "", "", "D", "", "", ""],
      ["", "", "", "E", "", "", ""],
      ["", "", "", "R", "", "", ""]
    ],
    clues: {
      across: [
        { number: 1, clue: "To burn slowly without flame", answer: "SMOLDER", row: 3, col: 0 }
      ],
      down: [
        { number: 2, clue: "A combustible material", answer: "FIRE", row: 0, col: 2 },
        { number: 3, clue: "An escape route", answer: "LADDER", row: 3, col: 3 }
      ]
    }
  });

  // Seed word scramble data
  await storage.createWordScramble({
    word: "EXTINGUISHER",
    hint: "Use this to put out small fires",
    category: "Equipment",
    difficulty: "intermediate",
    ageGroup: ageGroups.PRETEENS,
  });

  await storage.createWordScramble({
    word: "SMOKE",
    hint: "This rises from fire",
    category: "Basic",
    difficulty: "beginner",
    ageGroup: ageGroups.KIDS,
  });

  // Seed word pics data
  await storage.createWordPic({
    word: "ALARM",
    imageUrls: [
      "https://cdn.pixabay.com/photo/2014/04/02/10/41/bell-304200_960_720.png",
      "https://cdn.pixabay.com/photo/2012/04/12/20/56/warning-30915_960_720.png",
      "https://cdn.pixabay.com/photo/2013/07/13/10/07/bell-156596_960_720.png",
      "https://cdn.pixabay.com/photo/2012/04/16/13/42/alarm-36106_960_720.png"
    ],
    difficulty: "beginner",
    ageGroup: ageGroups.ALL,
  });

  // Seed achievements if they don't exist
  const existingAchievements = await storage.getAchievements();

  if (existingAchievements.length === 0) {
    await storage.createAchievement({
      title: "First Day",
      description: "Welcome to your fire safety journey!",
      icon: "FaFire",
      condition: "ACCOUNT_CREATED",
      threshold: 1
    });

    await storage.createAchievement({
      title: "Quiz Master",
      description: "Complete 5 fire safety quizzes",
      icon: "FaTrophy",
      condition: "QUIZZES_COMPLETED",
      threshold: 5
    });

    await storage.createAchievement({
      title: "Crossword Expert",
      description: "Complete 3 fire safety crossword puzzles",
      icon: "FaPuzzlePiece",
      condition: "CROSSWORDS_COMPLETED",
      threshold: 3
    });

    await storage.createAchievement({
      title: "Word Wizard",
      description: "Solve 5 word scrambles",
      icon: "FaSpellCheck",
      condition: "WORD_SCRAMBLES_COMPLETED",
      threshold: 5
    });

    await storage.createAchievement({
      title: "Picture Perfect",
      description: "Complete 3 word pics games",
      icon: "FaCamera",
      condition: "WORD_PICS_COMPLETED",
      threshold: 3
    });

    await storage.createAchievement({
      title: "Perfect Score",
      description: "Achieve a perfect score on 3 different games",
      icon: "FaStar",
      condition: "PERFECT_SCORE",
      threshold: 3
    });
  }
}