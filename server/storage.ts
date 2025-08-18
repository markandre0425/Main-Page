import { users, type User, type InsertUser, type MiniGame, leaderboards as lbTable } from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import pgPkg from "pg";
const { Pool } = pgPkg as unknown as { Pool: any };
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
  displayName?: string; // user's display name if available
  fullName: string; // preferred display name (displayName or username)
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
    
    // Create memory store for sessions (fallback)
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });

    // Add default APULA games that should always be available
    (async () => {
      // Add default admin user with hashed password
      await this.createUser({
        username: 'admin1',
        password: await hashPassword('admin1'),
        isAdmin: true
      });

      // Add default APULA games
      await this.createGame({
        title: "APULA Fire Safety Maze",
        description: "Navigate through a 3D maze while learning fire safety principles. Collect fire extinguishers, safety tips, and escape safely!",
        type: "3d-maze",
        bestScore: null,
        imageUrl: "https://placehold.co/400x300/FF5722/FFFFFF/svg?text=Fire+Safety+Maze",
        externalUrl: "https://apula-maze.onrender.com",
        isExternal: true
      });

      await this.createGame({
        title: "APULA Matching Cards",
        description: "Match fire safety concepts with their definitions. Learn important safety terms through fun card matching!",
        type: "matching-cards",
        bestScore: null,
        imageUrl: "https://placehold.co/400x300/2196F3/FFFFFF/svg?text=Matching+Cards",
        externalUrl: "https://apula-matching-cards.onrender.com",
        isExternal: true
      });

      await this.createGame({
        title: "3D Fire Main",
        description: "Experience immersive 3D fire safety training with realistic scenarios and interactive learning modules.",
        type: "3d-simulation",
        bestScore: null,
        imageUrl: "https://placehold.co/400x300/FF9800/FFFFFF/svg?text=3D+Fire+Main",
        externalUrl: "https://threed-fire-main.onrender.com",
        isExternal: true
      });

      console.log("✅ Default APULA games added successfully");
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
    
    // Try to get display names for users if we have userIds
    const entriesWithDisplayNames = await Promise.all(
      ranked.slice(0, limit).map(async (entry) => {
        if (entry.userId) {
          try {
            const user = await this.getUser(entry.userId);
            if (user && user.displayName) {
              return {
                ...entry,
                displayName: user.displayName,
                fullName: user.displayName || entry.username
              };
            }
          } catch (error) {
            console.warn(`Failed to get user ${entry.userId}:`, error);
          }
        }
        return {
          ...entry,
          displayName: entry.username,
          fullName: entry.username
        };
      })
    );
    
    return entriesWithDisplayNames;
  }
}

export const storage = new MemStorage();

// Optional: Postgres-backed leaderboard if DATABASE_URL is present (Render Postgres)
(async () => {
  try {
    if (process.env.DATABASE_URL) {
      const pool = new Pool({ 
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });
      const db = drizzle(pool);

      // Create sessions table if it doesn't exist
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS sessions (
          sid VARCHAR(255) PRIMARY KEY,
          sess JSON NOT NULL,
          expire TIMESTAMP(6) NOT NULL
        )
      `);

      // Create a PostgreSQL session store
      try {
        const PostgresStore = (await import('connect-pg-simple')).default(session);
        const postgresSessionStore = new PostgresStore({
          conObject: {
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
          },
          tableName: 'sessions'
        });
        
        // Replace the memory session store with PostgreSQL store
        storage.sessionStore = postgresSessionStore;
      } catch (sessionError) {
        console.warn("PostgreSQL session store unavailable, using memory store:", sessionError);
        // Keep using the memory store if PostgreSQL session store fails
      }

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
        
        // Convert to LeaderboardEntry format
        const dbEntry = inserted[0];
        return {
          id: dbEntry.id,
          gameKey: dbEntry.gameKey,
          userId: dbEntry.userId ?? undefined,
          username: dbEntry.username,
          displayName: dbEntry.username, // Will be updated when retrieved
          fullName: dbEntry.username, // Will be updated when retrieved
          timeMs: dbEntry.timeMs,
          objectivesCollected: dbEntry.objectivesCollected,
          score: dbEntry.score,
          createdAt: dbEntry.createdAt,
        } as LeaderboardEntry;
      };
      
      mem.getLeaderboard = async (gameKey: string, limit = 50) => {
        // Join with users table to get display names
        const rows = await db
          .select({
            id: lbTable.id,
            gameKey: lbTable.gameKey,
            userId: lbTable.userId,
            username: lbTable.username,
            timeMs: lbTable.timeMs,
            objectivesCollected: lbTable.objectivesCollected,
            score: lbTable.score,
            createdAt: lbTable.createdAt,
            displayName: users.displayName
          })
          .from(lbTable)
          .leftJoin(users, sql`${lbTable.userId} = ${users.id}`)
          .where(sql`${lbTable.gameKey} = ${gameKey}`)
          .limit(limit);
        
        // Convert to LeaderboardEntry format and sort
        const entries = rows.map(row => ({
          id: row.id,
          gameKey: row.gameKey,
          userId: row.userId ?? undefined,
          username: row.username,
          displayName: row.displayName,
          fullName: row.displayName || row.username,
          timeMs: row.timeMs,
          objectivesCollected: row.objectivesCollected,
          score: row.score,
          createdAt: row.createdAt,
        } as LeaderboardEntry));
        
        // Sort same as memory (time asc, objectives desc, created asc)
        return entries.sort((a, b) => {
          if (a.timeMs !== b.timeMs) return a.timeMs - b.timeMs;
          if (a.objectivesCollected !== b.objectivesCollected) return b.objectivesCollected - a.objectivesCollected;
          return a.createdAt - b.createdAt;
        });
      };
    }
  } catch (e) {
    console.warn("Postgres leaderboard unavailable, using in-memory fallback:", e);
  }
})();