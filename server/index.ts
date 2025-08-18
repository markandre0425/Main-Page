import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "net";

function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(startPort, () => {
      const { port } = server.address() as { port: number };
      server.close(() => resolve(port));
    });
    
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic CORS for cross-origin calls from your game services
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = 5000;
  const envPort = process.env.PORT ? Number(process.env.PORT) : undefined;
  const port = Number.isFinite(envPort) ? (envPort as number) : await findAvailablePort(preferredPort);
  
  server.listen({
    port,
    host: "0.0.0.0",
    // reusePort: true,
  }, () => {
    const portNote = envPort ? ' (using PORT from environment)' : (port !== preferredPort ? ' (default port 5000 was unavailable)' : '');
    log(`serving on port ${port}${portNote}`);
  });
})();

