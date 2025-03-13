import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User, loginSchema, ageGroups } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends User {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Type guard for serializable user
function isSerializableUser(user: any): user is { id: number } {
  // Add debug logging
  console.log('Attempting to serialize user:', user);
  const isValid = user && typeof user.id === 'number' && !isNaN(user.id);
  console.log('Is user valid for serialization:', isValid);
  return isValid;
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "fire-safety-app-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        
        if (!(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Incorrect password" });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    console.log('SerializeUser called with:', user);
    
    if (!isSerializableUser(user)) {
      console.error('User serialization failed:', user);
      return done(new Error("Invalid user object for serialization"));
    }
    
    console.log('Serializing user with id:', user.id);
    done(null, user.id);
  });
  passport.deserializeUser(async (id: unknown, done) => {
    console.log('DeserializeUser called with id:', id);
    
    try {
      if (typeof id !== 'number') {
        console.error('Invalid user ID type:', typeof id);
        return done(new Error("Invalid user ID"));
      }
      
      const user = await storage.getUser(id);
      console.log('Deserialized user:', user);
      
      if (!user) {
        return done(new Error("User not found"));
      }
      
      done(null, user);
    } catch (err) {
      console.error('Deserialization error:', err);
      done(err);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      // Validate input
      const parseResult = loginSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Invalid input", 
          errors: parseResult.error.errors 
        });
      }
      
      const { username, password } = req.body;
      const name = req.body.name || username;
      const email = req.body.email || `${username}@example.com`;
      const ageGroup = req.body.ageGroup || ageGroups.KIDS;

      // Check if user exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        name,
        email,
        ageGroup,
      });

      // Add debug logging
      console.log('Created user:', { ...user, password: '[REDACTED]' });

      req.login(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return next(err);
        }
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (err) {
      console.error('Registration error:', err);
      next(err);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      
      req.login(user, (err) => {
        if (err) return next(err);
        // Don't send the password hash back to the client
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const { password, ...userWithoutPassword } = req.user as User;
    res.json(userWithoutPassword);
  });
  
  app.put("/api/user/age-group", (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const { ageGroup } = req.body;
    if (!ageGroup || !Object.values(ageGroups).includes(ageGroup)) {
      return res.status(400).json({ message: "Invalid age group" });
    }
    
    storage.updateUser((req.user as User).id, { ageGroup })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      })
      .catch(next);
  });
  
  // Update user profile
  app.patch("/api/user", (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const { name, email } = req.body;
    
    if (!name && !email) {
      return res.status(400).json({ message: "No fields to update" });
    }
    
    storage.updateUser((req.user as User).id, { name, email })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      })
      .catch(next);
  });
}
