import { users, type User, type InsertUser, type MiniGame } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

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
  
  // Session management
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: MiniGame[];
  private userIdCounter: number;
  private gameIdCounter: number;
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.games = [];
    this.userIdCounter = 1;
    this.gameIdCounter = 1;
    
    // Create memory store for sessions
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
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
}

export const storage = new MemStorage();