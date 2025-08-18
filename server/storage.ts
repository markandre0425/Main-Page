import { users, type User, type InsertUser, type MiniGame, leaderboards as lbTable } from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { Pool } from "pg";
import session from "express-session";
import createMemoryStore from "memorystore";
import { hashPassword } from "./auth";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<Map<number, User>>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<boolean>;
  
  // Game management
  getAllGames(): Promise<MiniGame[]>;
  getGame(id: number): Promise<MiniGame | undefined>;
  createGame(game: Omit<MiniGame, 'id'>): Promise<MiniGame>;
  updateGame(id: number, gameData: Partial<MiniGame>): Promise<MiniGame>;
  deleteGame(id: number): Promise<boolean>;
  
  // Leaderboards
  submitLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'createdAt' | 'score'>): Promise<LeaderboardEntry>;
  getLeaderboard(gameKey: string, limit?: number): Promise<LeaderboardEntry[]>;

  // Session management
  sessionStore: session.Store;
}

export interface LeaderboardEntry {
  id: number;
  gameKey: string; // e.g. "maze", "escape-room", "matching-cards"
  userId?: number;
  username: string; // fallback/display name
  timeMs: number; // total time to finish (lower is better)
  objectivesCollected: number; // number of objectives collected (higher is better)
  score: number; // derived score, optional for display
  createdAt: number; // epoch ms
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: MiniGame[];
  private userIdCounter: number;
  private gameIdCounter: number;
  private leaderboards: Map<string, LeaderboardEntry[]>;
  private leaderboardIdCounter: number;
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.games = [];
    this.userIdCounter = 1;
    this.gameIdCounter = 1;
    this.leaderboards = new Map();
    this.leaderboardIdCounter = 1;
    
    // Create memory store for sessions
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });

    // Add default admin user with hashed password
    (async () => {
      await this.createUser({
        username: 'admin1',
        password: await hashPassword('admin1'),
        isAdmin: true
      });
    })();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getAllUsers(): Promise<Map<number, User>> {
    return this.users;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;

    // Create a fully formed user object with default values
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      displayName: insertUser.displayName || null,
      points: insertUser.points ?? 0,
      level: insertUser.level ?? 1,
      progress: insertUser.progress ?? 0,
      avatar: insertUser.avatar ?? "default",
      outfits: insertUser.outfits ? [...insertUser.outfits] : [],
      accessories: insertUser.accessories ? [...insertUser.accessories] : [],
      completedMissions: insertUser.completedMissions ? [...insertUser.completedMissions] : [],
      earnedBadges: insertUser.earnedBadges ? [...insertUser.earnedBadges] : [],
      unlockedMiniGames: insertUser.unlockedMiniGames ? [...insertUser.unlockedMiniGames] : [],
      isAdmin: insertUser.isAdmin ?? false,
    };

    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    // Update the user with the new data
    const updatedUser = { ...user, ...userData };
    
    // Save the updated user
    this.users.set(id, updatedUser);
    
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    const user = await this.getUser(id);
    
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    // Delete the user
    const result = this.users.delete(id);
    
    return result;
  }

  // Game management methods
  
  async getAllGames(): Promise<MiniGame[]> {
    return this.games;
  }
  
  async getGame(id: number): Promise<MiniGame | undefined> {
    return this.games.find(game => game.id === id);
  }
  
  async createGame(gameData: Omit<MiniGame, 'id'>): Promise<MiniGame> {
    const id = this.gameIdCounter++;
    
    const game: MiniGame = {
      ...gameData,
      id
    };
    
    this.games.push(game);
    return game;
  }
  
  async updateGame(id: number, gameData: Partial<MiniGame>): Promise<MiniGame> {
    const gameIndex = this.games.findIndex(game => game.id === id);
    
    if (gameIndex === -1) {
      throw new Error(`Game with ID ${id} not found`);
    }
    
    // Update the game with the new data
    const updatedGame = { ...this.games[gameIndex], ...gameData };
    
    // Save the updated game
    this.games[gameIndex] = updatedGame;
    
    return updatedGame;
  }
  
  async deleteGame(id: number): Promise<boolean> {
    const gameIndex = this.games.findIndex(game => game.id === id);
    
    if (gameIndex === -1) {
      throw new Error(`Game with ID ${id} not found`);
    }
    
    // Delete the game
    this.games.splice(gameIndex, 1);
    
    return true;
  }

  // Leaderboard methods
  private static rankEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
    // Sort by: time ascending, objectives desc, createdAt asc
    return [...entries].sort((a, b) => {
      if (a.timeMs !== b.timeMs) return a.timeMs - b.timeMs;
      if (a.objectivesCollected !== b.objectivesCollected) return b.objectivesCollected - a.objectivesCollected;
      return a.createdAt - b.createdAt;
    });
  }

  async submitLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'createdAt' | 'score'>): Promise<LeaderboardEntry> {
    const id = this.leaderboardIdCounter++;
    const createdAt = Date.now();
    // Simple derived score example: more objectives and faster time
    const score = entry.objectivesCollected * 1000 - Math.floor(entry.timeMs / 100);

    const fullEntry: LeaderboardEntry = {
      id,
      createdAt,
      score,
      ...entry,
    };

    const list = this.leaderboards.get(entry.gameKey) ?? [];
    list.push(fullEntry);
    this.leaderboards.set(entry.gameKey, list);

    return fullEntry;
  }

  async getLeaderboard(gameKey: string, limit = 50): Promise<LeaderboardEntry[]> {
    const list = this.leaderboards.get(gameKey) ?? [];
    const ranked = MemStorage.rankEntries(list);
    return ranked.slice(0, limit);
  }
}

export const storage = new MemStorage();

// Optional: Postgres-backed leaderboard if DATABASE_URL is present (Render Postgres)
try {
  if (process.env.DATABASE_URL) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    // Extend storage with DB methods for leaderboard
    const mem = storage as MemStorage;
    mem.submitLeaderboardEntry = async (entry) => {
      const createdAt = Date.now();
      const score = entry.objectivesCollected * 1000 - Math.floor(entry.timeMs / 100);
      const inserted = await db
        .insert(lbTable)
        .values({
          gameKey: entry.gameKey,
          userId: entry.userId ?? null,
          username: entry.username,
          timeMs: entry.timeMs,
          objectivesCollected: entry.objectivesCollected,
          score,
          createdAt,
        })
        .returning();
      return inserted[0] as any;
    };
    mem.getLeaderboard = async (gameKey: string, limit = 50) => {
      const rows = await db
        .select()
        .from(lbTable)
        .where(sql`${lbTable.gameKey} = ${gameKey}`)
        .limit(limit);
      // Sort same as memory (time asc, objectives desc, created asc)
      return rows.sort((a, b) => {
        if (a.timeMs !== b.timeMs) return a.timeMs - b.timeMs;
        if (a.objectivesCollected !== b.objectivesCollected) return b.objectivesCollected - a.objectivesCollected;
        return a.createdAt - b.createdAt;
      });
    };
  }
} catch (e) {
  console.warn("Postgres leaderboard unavailable, using in-memory fallback:", e);
}