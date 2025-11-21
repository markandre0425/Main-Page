import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { missions, miniGames, badges, safetyTips, hazards } from "../client/src/lib/gameData";
import { insertUserSchema, type User } from "@shared/schema";
import { setupAuth, hashPassword } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth/role middleware
  const requireAuth: RequestHandler = (req, res, next) => {
    const isAuthed = (req as any).isAuthenticated?.();
    if (!isAuthed) return res.status(401).json({ message: "Unauthorized" });
    next();
  };

  const requireAdmin: RequestHandler = (req, res, next) => {
    const isAuthed = (req as any).isAuthenticated?.();
    if (!isAuthed) return res.status(401).json({ message: "Unauthorized" });
    const user = (req as any).user;
    if (!user?.isAdmin) return res.status(403).json({ message: "Forbidden" });
    next();
  };


  // Setup authentication with sessions
  setupAuth(app);

  // Get missions
  app.get("/api/missions", (req, res) => {
    res.json(missions);
  });

  // Get specific mission
  app.get("/api/missions/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const mission = missions.find(m => m.id === id);
    
    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }
    
    res.json(mission);
  });

  // Get mini-games
  app.get("/api/mini-games", (req, res) => {
    res.json(miniGames);
  });

  // Get specific mini-game
  app.get("/api/mini-games/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const game = miniGames.find(g => g.id === id);
    
    if (!game) {
      return res.status(404).json({ message: "Mini-game not found" });
    }
    
    res.json(game);
  });

  // Get badges
  app.get("/api/badges", (req, res) => {
    res.json(badges);
  });

  // Get safety tips
  app.get("/api/safety-tips", (req, res) => {
    res.json(safetyTips);
  });

  // Get today's safety tip
  app.get("/api/safety-tips/today", (req, res) => {
    const randomIndex = Math.floor(Math.random() * safetyTips.length);
    res.json(safetyTips[randomIndex]);
  });

  // Get hazards for a specific location
  app.get("/api/hazards/:location", (req, res) => {
    const location = req.params.location;
    const locationHazards = hazards.filter(h => h.location === location);
    
    res.json(locationHazards);
  });

  // Update user avatar
  app.patch("/api/user/avatar", (req, res) => {
    const schema = z.object({
      avatarId: z.string()
    });
    
    try {
      const { avatarId } = schema.parse(req.body);
      
      // In a real app, this would update the user in the database
      // For now, just return success
      res.json({ success: true, avatar: avatarId });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // User Management Routes (to be used by the admin dashboard)
  
  // Get all users
  app.get("/api/users", async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const users = Array.from(allUsers.values()).map(user => {
        // Remove password before sending response
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to retrieve users" });
    }
  });
  
  // Get a specific user
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password before sending response
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to retrieve user" });
    }
  });
  
  // Create a new user
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash the password
      const hashedPassword = await hashPassword(userData.password);
      
      // Create the user with hashed password
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Remove password before sending response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Create user error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(400).json({ message: "Invalid user data" });
    }
  });
  
  // Update a user
  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updateSchema = z.object({
        username: z.string().optional(),
        displayName: z.string().optional().nullable(),
        level: z.number().optional(),
        points: z.number().optional(),
        progress: z.number().optional(),
        avatar: z.string().optional(),
        outfits: z.array(z.string()).optional(),
        accessories: z.array(z.string()).optional(),
        completedMissions: z.array(z.number()).optional(),
        earnedBadges: z.array(z.number()).optional(),
        unlockedMiniGames: z.array(z.number()).optional()
      });
      
      const updateData = updateSchema.parse(req.body);
      
      // Update the user
      const updatedUser = await storage.updateUser(id, updateData);
      
      // Remove password before sending response
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update user error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(400).json({ message: "Invalid user data" });
    }
  });
  
  // Delete a user
  app.delete("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Delete the user
      await storage.deleteUser(id);
      
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  
  // ADMIN ROUTES (protected)
  
  // Get all users (admin only)
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      // In a real app, this would check if the requesting user is an admin
      // For this demo, we'll skip that check
      
      const allUsers = await storage.getAllUsers();
      const users = Array.from(allUsers.values()).map(user => {
        // Remove password before sending response
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to retrieve users" });
    }
  });
  
  // Get user by ID (admin only)
  app.get("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password before sending response
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to retrieve user" });
    }
  });
  
  // Create user (admin only)
  app.post("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash the password
      const hashedPassword = await hashPassword(userData.password);
      
      // Create the user with hashed password
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Remove password before sending response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Create user error:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });
  
  // Update user (admin only)
  app.put("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updateSchema = z.object({
        displayName: z.string().optional(),
        level: z.number().optional(),
        points: z.number().optional(),
        progress: z.number().optional(),
        completedMissions: z.array(z.number()).optional(),
        earnedBadges: z.array(z.number()).optional(),
        unlockedMiniGames: z.array(z.number()).optional()
      });
      
      const updateData = updateSchema.parse(req.body);
      
      // In a real app with a database, you would update the user here
      // For our in-memory implementation, we'll update it directly
      const updatedUser = await storage.updateUser(id, updateData);
      
      // Remove password before sending response
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });
  
  // Delete user (admin only)
  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // In a real app with a database, you would delete the user here
      // For our in-memory implementation, we'll call a storage method
      await storage.deleteUser(id);
      
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  
  // Reset user password (admin only)
  app.post("/api/admin/users/:id/reset-password", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const schema = z.object({
        newPassword: z.string().min(5)
      });
      
      const { newPassword } = schema.parse(req.body);
      
      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update the user's password
      const updatedUser = await storage.updateUser(id, { password: hashedPassword });
      
      res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(400).json({ message: "Failed to reset password" });
    }
  });
  
  // Update user score for mini-games
  app.post("/api/user/score", (req, res) => {
    const schema = z.object({
      gameType: z.string(),
      score: z.number()
    });
    
    try {
      const { gameType, score } = schema.parse(req.body);
      
      // In a real app, this would update the user's score in the database
      // For now, just return success with some points calculation
      const pointsEarned = gameType === "spot-hazard" ? score * 10 : score * 20;
      
      res.json({ 
        success: true, 
        pointsEarned,
        newTotal: 350 + pointsEarned, // Mock value
        progress: Math.min(100, 65 + 5) // Mock progress increment
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Complete a mission
  app.post("/api/user/mission", (req, res) => {
    const schema = z.object({
      missionId: z.number(),
      completed: z.boolean()
    });
    
    try {
      const { missionId, completed } = schema.parse(req.body);
      
      if (!completed) {
        return res.status(400).json({ message: "Mission not marked as completed" });
      }
      
      // In a real app, this would update the user's completed missions in the database
      // For now, just return success
      const mission = missions.find(m => m.id === missionId);
      
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }
      
      res.json({ 
        success: true, 
        pointsEarned: mission.points,
        newTotal: 350 + mission.points, // Mock value
        progress: Math.min(100, 65 + 25), // Mock progress increment
        levelUp: false // Would check if points exceed threshold for level up
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // GAME MANAGEMENT ROUTES
  
  // Get all external games
  app.get("/api/games", async (req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json(games);
    } catch (error) {
      console.error("Error fetching games:", error);
      res.status(500).json({ message: "Failed to retrieve games" });
    }
  });
  
  // Get a specific external game
  app.get("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const game = await storage.getGame(id);
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.json(game);
    } catch (error) {
      console.error("Error fetching game:", error);
      res.status(500).json({ message: "Failed to retrieve game" });
    }
  });
  
  // Create a new external game
  app.post("/api/games", async (req, res) => {
    try {
      const gameSchema = z.object({
        title: z.string(),
        description: z.string(),
        type: z.string(),
        bestScore: z.number().nullable(),
        imageUrl: z.string().nullable(),
        externalUrl: z.string().url().nullish(),
        isExternal: z.boolean().nullable(),
        category: z.string().optional(),
        difficulty: z.string().optional(),
        estimatedTime: z.string().optional(),
        ageRange: z.string().optional()
      });
      
      const parsedData = gameSchema.parse(req.body);
      
      // Ensure imageUrl and externalUrl are not undefined
      const gameData = {
        ...parsedData,
        imageUrl: parsedData.imageUrl || null,
        externalUrl: parsedData.externalUrl || null,
      };
      
      const game = await storage.createGame(gameData);
      
      res.status(201).json(game);
    } catch (error) {
      console.error("Create game error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game data", errors: error.errors });
      }
      res.status(400).json({ message: "Invalid game data" });
    }
  });
  
  // Update an external game
  app.patch("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const game = await storage.getGame(id);
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      const updateSchema = z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        type: z.string().optional(),
        bestScore: z.number().nullable().optional(),
        imageUrl: z.string().nullable().optional(),
        externalUrl: z.string().url().nullish().optional(),
        isExternal: z.boolean().nullable().optional(),
        category: z.string().optional(),
        difficulty: z.string().optional(),
        estimatedTime: z.string().optional(),
        ageRange: z.string().optional()
      });
      
      const parsedData = updateSchema.parse(req.body);
      
      // Ensure imageUrl and externalUrl are not undefined if provided
      const updateData = {
        ...parsedData,
        imageUrl: 'imageUrl' in parsedData ? (parsedData.imageUrl || null) : undefined,
        externalUrl: 'externalUrl' in parsedData ? (parsedData.externalUrl || null) : undefined,
      };
      
      const updatedGame = await storage.updateGame(id, updateData);
      
      res.json(updatedGame);
    } catch (error) {
      console.error("Update game error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game data", errors: error.errors });
      }
      res.status(400).json({ message: "Invalid game data" });
    }
  });
  
  // Delete an external game
  app.delete("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const game = await storage.getGame(id);
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      await storage.deleteGame(id);
      
      res.json({ success: true, message: "Game deleted successfully" });
    } catch (error) {
      console.error("Delete game error:", error);
      res.status(500).json({ message: "Failed to delete game" });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}
