import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define user model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  ageGroup: text("age_group").notNull(),
  progress: integer("progress").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define quizzes model
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ageGroup: text("age_group").notNull(),
  difficulty: text("difficulty").notNull(),
});

// Define quiz questions model
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull(),
  question: text("question").notNull(),
  options: json("options").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  ageGroup: text("age_group").notNull(),
});

// Define crosswords model
export const crosswords = pgTable("crosswords", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ageGroup: text("age_group").notNull(),
  difficulty: text("difficulty").notNull(),
  grid: json("grid").notNull(),
  clues: json("clues").notNull(),
});

// Define word scramble model
export const wordScrambles = pgTable("word_scrambles", {
  id: serial("id").primaryKey(),
  word: text("word").notNull(),
  hint: text("hint").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  ageGroup: text("age_group").notNull(),
});

// Define 4 Pics 1 Word model
export const wordPics = pgTable("word_pics", {
  id: serial("id").primaryKey(),
  word: text("word").notNull(),
  imageUrls: json("image_urls").notNull(),
  difficulty: text("difficulty").notNull(),
  ageGroup: text("age_group").notNull(),
});

// Define user progress model
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  gameType: text("game_type").notNull(),
  gameId: integer("game_id").notNull(),
  completed: boolean("completed").default(false),
  score: integer("score").default(0),
  lastPlayed: timestamp("last_played").defaultNow(),
});

// Define achievements model
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  condition: text("condition").notNull(),
  threshold: integer("threshold").notNull(),
});

// Define user achievements model
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  achievementId: integer("achievement_id").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Add these to your schema
export const friends = pgTable("friends", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  friendId: integer("friend_id").notNull(),
  status: text("status").notNull(), // pending, accepted
  createdAt: timestamp("created_at").defaultNow()
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  challengerId: integer("challenger_id").notNull(),
  challengedId: integer("challenged_id").notNull(),
  gameType: text("game_type").notNull(),
  gameId: integer("game_id").notNull(),
  status: text("status").notNull(), // pending, completed, expired
  expiresAt: timestamp("expires_at").notNull()
});

export const leaderboards = pgTable("leaderboards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  gameType: text("game_type").notNull(),
  score: integer("score").notNull(),
  period: text("period").notNull(), // daily, weekly, monthly
  updatedAt: timestamp("updated_at").defaultNow()
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertQuizSchema = createInsertSchema(quizzes).omit({ id: true });
export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({ id: true });
export const insertCrosswordSchema = createInsertSchema(crosswords).omit({ id: true });
export const insertWordScrambleSchema = createInsertSchema(wordScrambles).omit({ id: true });
export const insertWordPicsSchema = createInsertSchema(wordPics).omit({ id: true });
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true, lastPlayed: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true });
export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({ id: true, earnedAt: true });

// Create types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type InsertCrossword = z.infer<typeof insertCrosswordSchema>;
export type InsertWordScramble = z.infer<typeof insertWordScrambleSchema>;
export type InsertWordPics = z.infer<typeof insertWordPicsSchema>;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

export type User = typeof users.$inferSelect & {
  lastActivityAt?: Date;
};
export type Quiz = typeof quizzes.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type Crossword = typeof crosswords.$inferSelect;
export type WordScramble = typeof wordScrambles.$inferSelect;
export type WordPic = typeof wordPics.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;

// Age group enum
export const ageGroups = {
  KIDS: "Kids (5-8)",
  PRETEENS: "Preteens (9-12)",
  TEENS: "Teens (13-17)",
  ADULTS: "Adults (18+)"
} as const;

export type AgeGroup = keyof typeof ageGroups;

// Game type enum
export const gameTypes = {
  QUIZ: "quiz",
  CROSSWORD: "crossword",
  WORD_SCRAMBLE: "wordScramble",
  WORD_PICS: "wordPics",
} as const;

// Auth schema
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
