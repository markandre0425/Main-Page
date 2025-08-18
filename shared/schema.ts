import { pgTable, text, serial, integer, boolean, json, PgArray, bigint, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  points: integer("points").default(0),
  level: integer("level").default(1),
  progress: integer("progress").default(0),
  avatar: text("avatar").default("default"),
  outfits: json("outfits").$type<string[]>().default([]),
  accessories: json("accessories").$type<string[]>().default([]),
  completedMissions: json("completed_missions").$type<number[]>().default([]),
  earnedBadges: json("earned_badges").$type<number[]>().default([]),
  unlockedMiniGames: json("unlocked_mini_games").$type<number[]>().default([]),
  isAdmin: boolean("is_admin").default(false),
});

export const missions = pgTable("missions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  points: integer("points").notNull(),
  imageUrl: text("image_url"),
  steps: json("steps").$type<{ id: number; title: string; description: string; completed: boolean }[]>(),
});

export const miniGames = pgTable("mini_games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // spot-hazard, extinguisher-training, etc.
  bestScore: integer("best_score"),
  imageUrl: text("image_url"),
  externalUrl: text("external_url"), // For games hosted externally
  isExternal: boolean("is_external").default(false), // Flag to indicate if game is external
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  requirement: text("requirement").notNull(),
  color: text("color").notNull(),
});

export const safetyTips = pgTable("safety_tips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(), // prevention, escape, equipment, cooking, home, electrical, children
  sourceName: text("source_name"),
});

export const hazards = pgTable("hazards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(), // kitchen, bedroom, etc.
  xPosition: integer("x_position").notNull(),
  yPosition: integer("y_position").notNull(),
  imageUrl: text("image_url"),
});

export const leaderboards = pgTable("leaderboards", {
  id: serial("id").primaryKey(),
  gameKey: text("game_key").notNull(),
  userId: integer("user_id"),
  username: text("username").notNull(),
  timeMs: integer("time_ms").notNull(),
  objectivesCollected: integer("objectives_collected").notNull(),
  score: integer("score").notNull(),
  createdAt: integer("created_at").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users);

export const insertMissionSchema = createInsertSchema(missions);
export const insertMiniGameSchema = createInsertSchema(miniGames);
export const insertBadgeSchema = createInsertSchema(badges);
export const insertSafetyTipSchema = createInsertSchema(safetyTips);
export const insertHazardSchema = createInsertSchema(hazards);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Mission = typeof missions.$inferSelect;
export type MiniGame = typeof miniGames.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type SafetyTip = typeof safetyTips.$inferSelect;
export type Hazard = typeof hazards.$inferSelect;
export type Leaderboard = typeof leaderboards.$inferSelect;
