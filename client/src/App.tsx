import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import GamesPage from "@/pages/games-page";
import QuizGame from "@/pages/quiz-game";
import CrosswordGame from "@/pages/crossword-game";
import WordPicsGame from "@/pages/word-pics-game";
import WordScrambleGame from "@/pages/word-scramble-game";
import AdminDashboard from "@/pages/admin-dashboard";
import ProgressPage from "@/pages/progress-page";
import AchievementsPage from "@/pages/achievements-page";
import AboutPage from "@/pages/about-page";
import ProfilePage from "@/pages/profile-page";
import ResourcesPage from "@/pages/resources-page";
import { ProtectedRoute } from "./lib/protected-route";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

function Router() {
  const [location] = useLocation();
  const { user, isLoading } = useAuth();

  // Log location changes and auth state 
  useEffect(() => {
    console.log(`Route changed to: ${location}, Auth state:`, { user, isLoading });
  }, [location, user, isLoading]);

  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/about" component={AboutPage} />
      <ProtectedRoute path="/games" component={GamesPage} />
      <ProtectedRoute path="/games/quiz/:id" component={QuizGame} />
      <ProtectedRoute path="/games/crossword/:id" component={CrosswordGame} />
      <ProtectedRoute path="/games/word-pics/:id" component={WordPicsGame} />
      <ProtectedRoute path="/games/word-scramble/:id" component={WordScrambleGame} />
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/progress" component={ProgressPage} />
      <ProtectedRoute path="/achievements" component={AchievementsPage} />
      <Route path="/resources" component={ResourcesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;