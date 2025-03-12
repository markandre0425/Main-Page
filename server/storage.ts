import { 
  users, quizzes, quizQuestions, crosswords, wordScrambles, wordPics, 
  userProgress, achievements, userAchievements,
  type User, type InsertUser, type Quiz, type InsertQuiz,
  type QuizQuestion, type InsertQuizQuestion, type Crossword, type InsertCrossword,
  type WordScramble, type InsertWordScramble, type WordPic, type InsertWordPics,
  type UserProgress, type InsertUserProgress, type Achievement, type InsertAchievement,
  type UserAchievement, type InsertUserAchievement, ageGroups, gameTypes
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;

  // Quiz operations
  getQuizzes(ageGroup?: string): Promise<Quiz[]>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;

  // Quiz question operations
  getQuizQuestions(quizId: number): Promise<QuizQuestion[]>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;

  // Crossword operations
  getCrosswords(ageGroup?: string): Promise<Crossword[]>;
  getCrossword(id: number): Promise<Crossword | undefined>;
  createCrossword(crossword: InsertCrossword): Promise<Crossword>;

  // Word scramble operations
  getWordScrambles(ageGroup?: string): Promise<WordScramble[]>;
  getWordScramble(id: number): Promise<WordScramble | undefined>;
  createWordScramble(wordScramble: InsertWordScramble): Promise<WordScramble>;

  // Word pics operations
  getWordPics(ageGroup?: string): Promise<WordPic[]>;
  getWordPic(id: number): Promise<WordPic | undefined>;
  createWordPic(wordPic: InsertWordPics): Promise<WordPic>;

  // User progress operations
  getUserProgress(userId: number): Promise<UserProgress[]>;
  updateUserProgress(userId: number, gameType: string, gameId: number, data: Partial<UserProgress>): Promise<UserProgress>;

  // Achievement operations
  getAchievements(): Promise<Achievement[]>;
  getAchievement(id: number): Promise<Achievement | undefined>;
  createAchievement(data: InsertAchievement): Promise<Achievement>;
  deleteAchievement(id: number): Promise<boolean>;
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  awardAchievement(userId: number, achievementId: number): Promise<UserAchievement>;
  removeUserAchievement(userId: number, achievementId: number): Promise<boolean>;

  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private quizzes: Map<number, Quiz>;
  private quizQuestions: Map<number, QuizQuestion>;
  private crosswords: Map<number, Crossword>;
  private wordScrambles: Map<number, WordScramble>;
  private wordPics: Map<number, WordPic>;
  private userProgress: Map<number, UserProgress>;
  private achievements: Map<number, Achievement>;
  private userAchievements: Map<number, UserAchievement>;

  sessionStore: session.SessionStore;

  currentUserId: number;
  currentQuizId: number;
  currentQuizQuestionId: number;
  currentCrosswordId: number;
  currentWordScrambleId: number;
  currentWordPicId: number;
  currentUserProgressId: number;
  currentAchievementId: number;
  currentUserAchievementId: number;

  constructor() {
    this.users = new Map();
    this.quizzes = new Map();
    this.quizQuestions = new Map();
    this.crosswords = new Map();
    this.wordScrambles = new Map();
    this.wordPics = new Map();
    this.userProgress = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();

    this.currentUserId = 1;
    this.currentQuizId = 1;
    this.currentQuizQuestionId = 1;
    this.currentCrosswordId = 1;
    this.currentWordScrambleId = 1;
    this.currentWordPicId = 1;
    this.currentUserProgressId = 1;
    this.currentAchievementId = 1;
    this.currentUserAchievementId = 1;

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Seed some default achievements
    this.seedAchievements();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now, progress: 0 };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Quiz operations
  async getQuizzes(ageGroup?: string): Promise<Quiz[]> {
    const quizzes = Array.from(this.quizzes.values());
    if (ageGroup) {
      return quizzes.filter(quiz => quiz.ageGroup === ageGroup || quiz.ageGroup === ageGroups.ALL);
    }
    return quizzes;
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = this.currentQuizId++;
    const quiz: Quiz = { ...insertQuiz, id };
    this.quizzes.set(id, quiz);
    return quiz;
  }

  // Quiz question operations
  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values()).filter(
      (q) => q.quizId === quizId,
    );
  }

  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const id = this.currentQuizQuestionId++;
    const question: QuizQuestion = { ...insertQuestion, id };
    this.quizQuestions.set(id, question);
    return question;
  }

  // Crossword operations
  async getCrosswords(ageGroup?: string): Promise<Crossword[]> {
    const crosswords = Array.from(this.crosswords.values());
    if (ageGroup) {
      return crosswords.filter(cw => cw.ageGroup === ageGroup || cw.ageGroup === ageGroups.ALL);
    }
    return crosswords;
  }

  async getCrossword(id: number): Promise<Crossword | undefined> {
    return this.crosswords.get(id);
  }

  async createCrossword(insertCrossword: InsertCrossword): Promise<Crossword> {
    const id = this.currentCrosswordId++;
    const crossword: Crossword = { ...insertCrossword, id };
    this.crosswords.set(id, crossword);
    return crossword;
  }

  // Word scramble operations
  async getWordScrambles(ageGroup?: string): Promise<WordScramble[]> {
    const wordScrambles = Array.from(this.wordScrambles.values());
    if (ageGroup) {
      return wordScrambles.filter(ws => ws.ageGroup === ageGroup || ws.ageGroup === ageGroups.ALL);
    }
    return wordScrambles;
  }

  async getWordScramble(id: number): Promise<WordScramble | undefined> {
    return this.wordScrambles.get(id);
  }

  async createWordScramble(insertWordScramble: InsertWordScramble): Promise<WordScramble> {
    const id = this.currentWordScrambleId++;
    const wordScramble: WordScramble = { ...insertWordScramble, id };
    this.wordScrambles.set(id, wordScramble);
    return wordScramble;
  }

  // Word pics operations
  async getWordPics(ageGroup?: string): Promise<WordPic[]> {
    const wordPics = Array.from(this.wordPics.values());
    if (ageGroup) {
      return wordPics.filter(wp => wp.ageGroup === ageGroup || wp.ageGroup === ageGroups.ALL);
    }
    return wordPics;
  }

  async getWordPic(id: number): Promise<WordPic | undefined> {
    return this.wordPics.get(id);
  }

  async createWordPic(insertWordPic: InsertWordPics): Promise<WordPic> {
    const id = this.currentWordPicId++;
    const wordPic: WordPic = { ...insertWordPic, id };
    this.wordPics.set(id, wordPic);
    return wordPic;
  }

  // User progress operations
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(
      (up) => up.userId === userId,
    );
  }

  async updateUserProgress(userId: number, gameType: string, gameId: number, data: Partial<UserProgress>): Promise<UserProgress> {
    // Check if progress exists
    const existingProgress = Array.from(this.userProgress.values()).find(
      (up) => up.userId === userId && up.gameType === gameType && up.gameId === gameId,
    );

    if (existingProgress) {
      const updatedProgress = { ...existingProgress, ...data, lastPlayed: new Date() };
      this.userProgress.set(existingProgress.id, updatedProgress);
      return updatedProgress;
    } else {
      const id = this.currentUserProgressId++;
      const newProgress: UserProgress = {
        id,
        userId,
        gameType,
        gameId,
        completed: data.completed || false,
        score: data.score || 0,
        lastPlayed: new Date(),
      };
      this.userProgress.set(id, newProgress);
      return newProgress;
    }
  }

  // Achievement operations
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getAchievement(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }

  async createAchievement(data: InsertAchievement): Promise<Achievement> {
    const achievement: Achievement = {
      id: this.currentAchievementId++,
      ...data,
    };

    this.achievements.set(achievement.id, achievement);
    return achievement;
  }

  async deleteAchievement(id: number): Promise<boolean> {
    const exists = this.achievements.has(id);
    if (!exists) {
      return false;
    }

    this.achievements.delete(id);

    // Also delete related user achievements
    const userAchievementsToDelete = Array.from(this.userAchievements.values())
      .filter(userAchievement => userAchievement.achievementId === id);

    for (const userAchievement of userAchievementsToDelete) {
      this.userAchievements.delete(userAchievement.id);
    }

    return true;
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values()).filter(
      (ua) => ua.userId === userId,
    );
  }

  async awardAchievement(
    userId: number,
    achievementId: number,
  ): Promise<UserAchievement> {
    // Check if already awarded
    const existingAward = Array.from(this.userAchievements.values()).find(
      (ua) => ua.userId === userId && ua.achievementId === achievementId,
    );

    if (existingAward) {
      return existingAward;
    }

    const userAchievement: UserAchievement = {
      id: this.currentUserAchievementId++,
      userId,
      achievementId,
      earnedAt: new Date(),
    };

    this.userAchievements.set(userAchievement.id, userAchievement);
    return userAchievement;
  }

  async removeUserAchievement(userId: number, achievementId: number): Promise<boolean> {
    const userAchievement = Array.from(this.userAchievements.values()).find(
      (ua) => ua.userId === userId && ua.achievementId === achievementId,
    );

    if (!userAchievement) {
      return false;
    }

    this.userAchievements.delete(userAchievement.id);
    return true;
  }

  // Helper to seed achievements
  async seedAchievements() {
    if (this.achievements.size === 0) {
      const achievements = [
        {
          title: "First Day",
          description: "Created an account to start learning about fire safety",
          icon: "🔥",
          condition: "ACCOUNT_CREATED",
          threshold: 1,
        },
        {
          title: "Quiz Master",
          description: "Completed 5 fire safety quizzes",
          icon: "🏆",
          condition: "QUIZZES_COMPLETED",
          threshold: 5,
        },
        {
          title: "Crossword Expert",
          description: "Completed 3 fire safety crosswords",
          icon: "📝",
          condition: "CROSSWORDS_COMPLETED",
          threshold: 3,
        },
        {
          title: "Picture Perfect",
          description: "Completed 3 word pics games",
          icon: "🖼️",
          condition: "WORD_PICS_COMPLETED",
          threshold: 3,
        },
        {
          title: "Word Wizard",
          description: "Completed 5 word scramble games",
          icon: "🔤",
          condition: "WORD_SCRAMBLES_COMPLETED",
          threshold: 5,
        },
        {
          title: "Perfect Scorer",
          description: "Achieved a perfect score in 3 different games",
          icon: "⭐",
          condition: "PERFECT_SCORE",
          threshold: 3,
        }
      ];

      for (const achievement of achievements) {
        await this.createAchievement(achievement);
      }
    }
  }
}

export const storage = new MemStorage();