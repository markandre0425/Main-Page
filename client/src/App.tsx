import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MissionDetail from "@/pages/MissionDetail";
import MiniGamePage from "@/pages/MiniGamePage";
import AvatarPage from "@/pages/AvatarPage";
import RewardsPage from "@/pages/RewardsPage";
import AuthPage from "@/pages/auth-page";
import AboutPage from "@/pages/AboutPage";
import GamesPage from "@/pages/GamesPage";
import SafetyTipsPage from "@/pages/SafetyTipsPage";
import AdminDashboard from "@/pages/AdminDashboard";
import ProfilePage from "@/pages/ProfilePage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import { useEffect } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/about" component={AboutPage} />
      
      {/* Protected routes */}
      <ProtectedRoute path="/" component={Home} />
      <ProtectedRoute path="/mission/:id" component={MissionDetail} />
      <ProtectedRoute path="/minigame/:id" component={MiniGamePage} />
      
      {/* Game Routes */}
      <ProtectedRoute path="/games/fire-extinguisher-simulator" component={MiniGamePage} />
      <ProtectedRoute path="/games/fire-safety-quiz" component={MiniGamePage} />
      <ProtectedRoute path="/avatar" component={AvatarPage} />
      <ProtectedRoute path="/rewards" component={RewardsPage} />
      <ProtectedRoute path="/games" component={GamesPage} />
      <ProtectedRoute path="/safety-tips" component={SafetyTipsPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/leaderboard" component={LeaderboardPage} />
      <ProtectedRoute path="/admin" component={AdminDashboard} adminOnly={true} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Add custom CSS for game animations
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes wiggle {
        0%, 100% { transform: rotate(-3deg); }
        50% { transform: rotate(3deg); }
      }
      @keyframes flame {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      
      .game-button {
        transition: all 0.2s ease;
      }
      
      .game-button:hover {
        transform: scale(1.05);
      }
      
      .game-button:active {
        transform: scale(0.95);
      }

      .mission-card {
        transition: all 0.3s ease;
        transform-style: preserve-3d;
      }
      
      .mission-card:hover {
        transform: translateY(-10px) rotateY(5deg);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
      }

      .avatar-item {
        transition: all 0.2s ease;
        cursor: pointer;
      }
      
      .avatar-item:hover {
        transform: scale(1.1);
      }

      .animate-wiggle {
        animation: wiggle 1s ease-in-out infinite;
      }
      
      .animate-flame {
        animation: flame 1.5s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
