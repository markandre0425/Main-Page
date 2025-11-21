import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { Flame, Lock, User, UserPlus, UserCheck, Loader2, Baby, Shield } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertUserSchema } from "@shared/schema";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = insertUserSchema.extend({
  password: z.string().min(5, "Password must be at least 5 characters"),
  displayName: z.string().min(1, "Display name is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("guest");

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      displayName: ""
    }
  });

  // Handle guest mode
  const handleGuestMode = () => {
    // Create a temporary guest user
    const guestUser = {
      id: Math.random().toString(36).substr(2, 9),
      username: `Guest_${Math.random().toString(36).substr(2, 5)}`,
      displayName: "Friend",
      isAdmin: false,
      level: 1,
      points: 0,
      progress: 0,
      avatar: "default",
      outfits: [],
      accessories: [],
      earnedBadges: [],
      unlockedMiniGames: [],
      completedMissions: []
    };
    
    // Store guest user in session storage
    sessionStorage.setItem('guestUser', JSON.stringify(guestUser));
    navigate("/");
  };

  // Handle direct game access
  const handleDirectGame = (gamePath: string) => {
    // Create a temporary guest user
    const guestUser = {
      id: Math.random().toString(36).substr(2, 9),
      username: `Guest_${Math.random().toString(36).substr(2, 5)}`,
      displayName: "Friend",
      isAdmin: false,
      level: 1,
      points: 0,
      progress: 0,
      avatar: "default",
      outfits: [],
      accessories: [],
      earnedBadges: [],
      unlockedMiniGames: [],
      completedMissions: []
    };
    
    // Store guest user in session storage
    sessionStorage.setItem('guestUser', JSON.stringify(guestUser));
    navigate(gamePath);
  };

  // Handle quick start (go to landing page)
  const handleQuickStart = () => {
    // Create a temporary guest user
    const guestUser = {
      id: Math.random().toString(36).substr(2, 9),
      username: `Guest_${Math.random().toString(36).substr(2, 5)}`,
      displayName: "Friend",
      isAdmin: false,
      level: 1,
      points: 0,
      progress: 0,
      avatar: "default",
      outfits: [],
      accessories: [],
      earnedBadges: [],
      unlockedMiniGames: [],
      completedMissions: []
    };
    
    // Store guest user in session storage
    sessionStorage.setItem('guestUser', JSON.stringify(guestUser));
    navigate("/");
  };

  // Handle login form submission
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: (userData) => {
        // Redirect to admin dashboard if user is an admin
        if (userData.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    });
  };

  // Handle register form submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Add default values for new user
    const userData = {
      ...data,
      level: 1,
      points: 0,
      progress: 0,
      avatar: "default",
      outfits: [],
      accessories: [],
      earnedBadges: [],
      unlockedMiniGames: [],
      completedMissions: []
    };
    
    registerMutation.mutate(userData, {
      onSuccess: () => {
        navigate("/");
      }
    });
  };

  // If user is already logged in, redirect to appropriate page
  if (user) {
    if (user.isAdmin) {
      return <Redirect to="/admin" />;
    } else {
      return <Redirect to="/" />;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Auth form */}
        <div>
          <Tabs defaultValue="guest" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="mb-8 text-center">
              <h1 className="font-bangers text-6xl text-pink-600 mb-2">🚒 APULA 🚒</h1>
              <p className="text-slate-700 text-xl">Learn fire safety through fun adventures!</p>
            </div>
            
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="guest" className="text-lg py-3">🎮 Play Now</TabsTrigger>
              <TabsTrigger value="login" className="text-lg py-3">👤 Login</TabsTrigger>
              <TabsTrigger value="register" className="text-lg py-3">➕ Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="guest">
              <Card className="border-4 border-pink-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bangers text-pink-600">🌟 Start Playing! 🌟</CardTitle>
                  <CardDescription className="text-lg">
                    Choose a game to play right away!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Quick Game Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Fire Safety Quiz */}
                    <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🧠</div>
                        <h3 className="font-fredoka text-xl text-blue-600 mb-2">Fire Safety Quiz</h3>
                        <p className="text-sm text-gray-600 mb-3">Test your fire safety knowledge!</p>
                        <Button 
                          onClick={() => handleDirectGame("/games/fire-safety-quiz")}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-fredoka"
                        >
                          🎮 Play Quiz
                        </Button>
                      </div>
                    </div>

                    {/* Safety Tips */}
                    <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📚</div>
                        <h3 className="font-fredoka text-xl text-green-600 mb-2">Safety Tips</h3>
                        <p className="text-sm text-gray-600 mb-3">Learn important fire safety tips!</p>
                        <Button 
                          onClick={() => handleDirectGame("/safety-tips")}
                          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-fredoka"
                        >
                          📖 Learn Tips
                        </Button>
                      </div>
                    </div>

                    {/* All Games */}
                    <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🎮</div>
                        <h3 className="font-fredoka text-xl text-purple-600 mb-2">All Games</h3>
                        <p className="text-sm text-gray-600 mb-3">Explore all available games!</p>
                        <Button 
                          onClick={() => handleDirectGame("/games")}
                          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-fredoka"
                        >
                          🎯 Explore
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Or Explore All Games */}
                  <div className="text-center">
                    <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-300 mb-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Want to explore everything?</strong> Click below to start your adventure!
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleQuickStart}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-xl py-6 rounded-xl font-fredoka shadow-lg"
                    >
                      <Baby className="mr-3 h-6 w-6" />
                      🏠 Start Adventure
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="justify-center">
                  <p className="text-sm text-center text-gray-600">
                    Want to save your progress?{" "}
                    <button 
                      onClick={() => setActiveTab("register")}
                      className="text-pink-600 hover:underline font-medium"
                    >
                      Create an account
                    </button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="login">
              <Card className="border-4 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-bangers text-blue-600">Welcome Back! 👋</CardTitle>
                  <CardDescription className="text-lg">
                    Login to continue your fire safety journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-medium">Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  placeholder="Enter your username" 
                                  className="pl-12 h-12 text-lg" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-medium">Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  type="password" 
                                  placeholder="Enter your password" 
                                  className="pl-12 h-12 text-lg" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl py-6 rounded-xl font-fredoka" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <>
                            <span className="animate-spin mr-2">
                              <Loader2 className="h-5 w-5" />
                            </span>
                            Logging in...
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-5 w-5" />
                            Log In
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="justify-center">
                  <p className="text-sm text-center text-gray-600">
                    Don't have an account?{" "}
                    <button 
                      onClick={() => setActiveTab("register")}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Sign up now
                    </button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="border-4 border-green-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-bangers text-green-600">Create an Account 🎉</CardTitle>
                  <CardDescription className="text-lg">
                    Join the adventure and learn about fire safety
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-medium">Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  placeholder="Choose a username" 
                                  className="pl-12 h-12 text-lg" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-medium">Your Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <UserCheck className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  placeholder="Enter your name" 
                                  className="pl-12 h-12 text-lg" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg font-medium">Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  type="password" 
                                  placeholder="Create a password" 
                                  className="pl-12 h-12 text-lg" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-green-500 hover:bg-green-600 text-white text-xl py-6 rounded-xl font-fredoka" 
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <>
                            <span className="animate-spin mr-2">
                              <Loader2 className="h-5 w-5" />
                            </span>
                            Creating account...
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-5 w-5" />
                            Create Account
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="justify-center">
                  <p className="text-sm text-center text-gray-600">
                    Already have an account?{" "}
                    <button 
                      onClick={() => setActiveTab("login")}
                      className="text-green-600 hover:underline font-medium"
                    >
                      Log in
                    </button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Hero section */}
        <div className="hidden md:flex flex-col items-center justify-center p-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl text-white shadow-xl">
          <div className="text-center">
            <Flame className="mx-auto h-20 w-20 mb-6" />
            <h2 className="font-bangers text-4xl mb-4">Learn Fire Safety The Fun Way! 🔥</h2>
            <div className="space-y-4 text-xl">
              <p>🎮 Play fun games</p>
              <p>⭐ Earn stars and badges</p>
              <p>🚒 Learn about firefighters</p>
              <p>🏠 Practice home safety</p>
              <p>🌟 Become a Safety Hero!</p>
            </div>
            <div className="mt-8 p-4 bg-white/20 rounded-lg">
              <p className="text-lg font-medium">Perfect for ages 4-8!</p>
              <p className="text-sm opacity-90">Kindergarten to Grade 3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}