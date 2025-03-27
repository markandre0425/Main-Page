import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Bar, Line, Pie } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User, InsertUser, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiRequest } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  LineChart,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MiniGame } from "@shared/schema";
import { ExternalLink, Plus, Save, Edit, Trash, RefreshCw, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Check if user has admin privileges
  const isAdmin = user?.isAdmin === true;
  
  // If the user doesn't have admin privileges, redirect them
  useEffect(() => {
    if (!isLoading && user && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, isLoading, isAdmin, navigate, toast]);
  
  // Form state for adding new external games
  const [newGame, setNewGame] = useState<{
    title: string;
    description: string;
    imageUrl: string;
    externalUrl: string;
    isExternal: boolean;
  }>({
    title: "",
    description: "",
    imageUrl: "https://placehold.co/500x300/4CAF50/FFFFFF/svg?text=New+Game",
    externalUrl: "",
    isExternal: true
  });

  // Fetch games from API
  const queryClient = useQueryClient();
  
  const { data: games = [], isLoading: isGamesLoading } = useQuery({
    queryKey: ['/api/games'],
    queryFn: () => fetch('/api/games').then(res => {
      if (!res.ok) throw new Error('Failed to fetch games');
      return res.json();
    }),
  });
  
  // Add game mutation
  const addGameMutation = useMutation({
    mutationFn: async (gameData: {
      title: string;
      description: string;
      imageUrl: string;
      externalUrl: string;
    }) => {
      const response = await apiRequest("POST", "/api/games", {
        ...gameData,
        type: "external",
        bestScore: null,
        isExternal: true
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch games query
      queryClient.invalidateQueries({ queryKey: ['/api/games'] });
      
      // Reset form
      setNewGame({
        title: "",
        description: "",
        imageUrl: "https://placehold.co/500x300/4CAF50/FFFFFF/svg?text=New+Game",
        externalUrl: "",
        isExternal: true
      });
      
      // Show success message
      toast({
        title: "Game added",
        description: "The external game has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding game",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Handle new game form submission
  const handleAddGame = () => {
    // Validate form
    if (!newGame.title || !newGame.description) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate URL format if URL is provided
    if (newGame.externalUrl && !newGame.externalUrl.startsWith('http')) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive"
      });
      return;
    }

    // Process URL - ensure it has http:// prefix
    let processedUrl = newGame.externalUrl;
    if (processedUrl && !processedUrl.startsWith('http')) {
      processedUrl = 'https://' + processedUrl;
    }
    
    // Submit form data to API
    addGameMutation.mutate({
      title: newGame.title,
      description: newGame.description,
      imageUrl: newGame.imageUrl,
      externalUrl: processedUrl
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewGame({
      ...newGame,
      [name]: value
    });
  };
  
  // Redirect non-admin users
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/");
    }
  }, [isLoading, isAdmin, navigate]);

  // Sample data for analytics dashboard
  const userStats = [
    { name: "Jan", users: 40, newUsers: 24, completedMissions: 18 },
    { name: "Feb", users: 55, newUsers: 15, completedMissions: 25 },
    { name: "Mar", users: 70, newUsers: 15, completedMissions: 32 },
    { name: "Apr", users: 90, newUsers: 20, completedMissions: 45 },
    { name: "May", users: 120, newUsers: 30, completedMissions: 55 },
    { name: "Jun", users: 150, newUsers: 30, completedMissions: 70 },
  ];

  const gamePlayStats = [
    { name: "Fire Extinguisher", value: 400 },
    { name: "Spot the Hazard", value: 300 },
    { name: "Escape Plan", value: 200 },
    { name: "Fire Quiz", value: 150 },
    { name: "Safety Match", value: 100 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!isAdmin) {
    // Show access denied message before redirect
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <div className="text-center my-12">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
            <Button 
              className="mt-4" 
              variant="default" 
              onClick={() => navigate("/")}
            >
              Return to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div id="app" className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="font-bangers text-4xl text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 mb-6">Monitor user analytics and manage application content</p>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="content">Content Management</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Total Users</CardTitle>
                    <CardDescription>Active accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">150</div>
                    <p className="text-xs text-green-500">↑ 24% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Game Plays</CardTitle>
                    <CardDescription>Total game sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">1,250</div>
                    <p className="text-xs text-green-500">↑ 18% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Missions Completed</CardTitle>
                    <CardDescription>All users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">432</div>
                    <p className="text-xs text-green-500">↑ 32% from last month</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>Monthly registered users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={userStats}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="users" fill="#8884d8" name="Total Users" />
                          <Bar dataKey="newUsers" fill="#82ca9d" name="New Users" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Most Popular Games</CardTitle>
                    <CardDescription>Game play distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={gamePlayStats}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {gamePlayStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Mission Completion Rate</CardTitle>
                  <CardDescription>Monthly progress tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={userStats}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="completedMissions"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          name="Completed Missions"
                        />
                        <Line type="monotone" dataKey="users" stroke="#82ca9d" name="Total Users" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User list */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage user accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserManagement />
                  </CardContent>
                </Card>
                
                {/* Create user form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Create User</CardTitle>
                    <CardDescription>Add a new user account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CreateUserForm />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="content">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main content management card */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Game Management</CardTitle>
                    <CardDescription>View and manage games in the application</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Current Games</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {games.map((game: MiniGame) => (
                          <div 
                            key={game.id} 
                            className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="h-36 bg-gray-200 relative overflow-hidden">
                              <img 
                                src={game.imageUrl || "https://placehold.co/500x300/cccccc/gray?text=No+Image"} 
                                alt={game.title} 
                                className="w-full h-full object-cover"
                              />
                              {game.isExternal && (
                                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs py-1 px-2 rounded-full flex items-center">
                                  <ExternalLink size={12} className="mr-1" />
                                  <span>External</span>
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <h4 className="font-semibold text-gray-800">{game.title}</h4>
                              <p className="text-gray-600 text-sm line-clamp-2">{game.description}</p>
                              
                              {game.isExternal && (
                                <div className="mt-2">
                                  <a 
                                    href={game.externalUrl || "#"} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                                  >
                                    <ExternalLink size={14} className="mr-1" />
                                    <span>View external game</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Add new game card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Add External Game</CardTitle>
                    <CardDescription>Create a new game card with an external link</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Game Title</Label>
                        <Input 
                          id="title" 
                          name="title" 
                          placeholder="Enter game title" 
                          value={newGame.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          name="description" 
                          placeholder="Enter game description" 
                          rows={3}
                          value={newGame.description}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input 
                          id="imageUrl" 
                          name="imageUrl" 
                          placeholder="Enter image URL" 
                          value={newGame.imageUrl}
                          onChange={handleInputChange}
                        />
                        <p className="text-xs text-gray-500">
                          Leave blank to use default placeholder
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="externalUrl">External Game URL</Label>
                        <Input 
                          id="externalUrl" 
                          name="externalUrl" 
                          placeholder="https://example.com/game" 
                          value={newGame.externalUrl}
                          onChange={handleInputChange}
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Enter the full URL to the external game
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch 
                          id="isExternal" 
                          checked={newGame.isExternal} 
                          onCheckedChange={(checked) => setNewGame({...newGame, isExternal: checked})}
                        />
                        <Label htmlFor="isExternal">External Game</Label>
                      </div>
                      
                      <Button 
                        type="button" 
                        className="w-full mt-4" 
                        onClick={handleAddGame}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Game
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Settings</CardTitle>
                  <CardDescription>Configure application settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                    <p className="text-gray-500">Settings panel coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// UserManagement Component
function UserManagement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Fetch all users
  const { data: users = [], isLoading, error } = useQuery<User[]>({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/users');
      return await res.json();
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      await apiRequest('DELETE', `/api/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (data: { id: number; userData: Partial<User> }) => {
      const { id, userData } = data;
      const res = await apiRequest('PATCH', `/api/users/${id}`, userData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setEditingUser(null);
      toast({
        title: "User updated",
        description: "The user has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update user: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Handle delete user
  const handleDeleteUser = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser({ ...user });
  };

  // Handle save edited user
  const handleSaveUser = () => {
    if (!editingUser) return;
    
    updateUserMutation.mutate({
      id: editingUser.id,
      userData: {
        username: editingUser.username,
        displayName: editingUser.displayName,
        level: editingUser.level,
        points: editingUser.points,
        isAdmin: editingUser.isAdmin,
      }
    });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  // Handle input change for editing
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (!editingUser) return;
    
    // Handle numeric values
    if (name === 'level' || name === 'points') {
      setEditingUser({
        ...editingUser,
        [name]: parseInt(value) || 0
      });
    } else {
      setEditingUser({
        ...editingUser,
        [name]: value
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
        <p>Error loading users: {error instanceof Error ? error.message : 'Unknown error'}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/users'] })}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">User Accounts</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/users'] })}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="border rounded-md divide-y">
        {users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No users found. Create your first user using the form.
          </div>
        ) : (
          users.map(user => (
            <div key={user.id} className="p-4 hover:bg-gray-50">
              {editingUser && editingUser.id === user.id ? (
                // Edit mode
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`username-${user.id}`}>Username</Label>
                      <Input 
                        id={`username-${user.id}`}
                        name="username"
                        value={editingUser.username}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`displayName-${user.id}`}>Display Name</Label>
                      <Input 
                        id={`displayName-${user.id}`}
                        name="displayName"
                        value={editingUser.displayName || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`level-${user.id}`}>Level</Label>
                      <Input 
                        id={`level-${user.id}`}
                        name="level"
                        type="number"
                        value={editingUser.level || 0}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`points-${user.id}`}>Points</Label>
                      <Input 
                        id={`points-${user.id}`}
                        name="points"
                        type="number"
                        value={editingUser.points || 0}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`isAdmin-${user.id}`} className="cursor-pointer">Admin Privileges</Label>
                    <Switch
                      id={`isAdmin-${user.id}`}
                      checked={editingUser.isAdmin || false}
                      onCheckedChange={(checked) => {
                        setEditingUser({
                          ...editingUser,
                          isAdmin: checked
                        });
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveUser}
                      disabled={updateUserMutation.isPending}
                    >
                      {updateUserMutation.isPending ? (
                        <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="mr-1 h-4 w-4" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                // View mode
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <div className="flex items-center mb-1">
                      <h4 className="font-semibold text-primary">{user.username}</h4>
                      {user.displayName && (
                        <span className="ml-2 text-gray-600">({user.displayName})</span>
                      )}
                      {user.isAdmin && (
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">Admin</span>
                      )}
                    </div>
                    <div className="space-x-4 text-sm text-gray-600">
                      <span>ID: {user.id}</span>
                      <span>Level: {user.level}</span>
                      <span>Points: {user.points}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={deleteUserMutation.isPending}
                    >
                      {deleteUserMutation.isPending ? (
                        <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash className="mr-1 h-4 w-4" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// CreateUserForm Component
function CreateUserForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Extend the schema for validation
  const createUserSchema = insertUserSchema.extend({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  type CreateUserFormValues = z.infer<typeof createUserSchema>;

  // Initialize form with react-hook-form
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      displayName: "",
      isAdmin: false,
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (data: Omit<CreateUserFormValues, "confirmPassword">) => {
      const { confirmPassword, ...userData } = data as any;
      const res = await apiRequest('POST', '/api/users', userData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      form.reset();
      toast({
        title: "User created",
        description: "The user has been successfully created.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create user: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const onSubmit = (data: CreateUserFormValues) => {
    const { confirmPassword, ...userData } = data;
    createUserMutation.mutate(userData as any);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input 
          id="username" 
          {...form.register("username")}
        />
        {form.formState.errors.username && (
          <p className="text-xs text-red-500">{form.formState.errors.username.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input 
          id="displayName" 
          {...form.register("displayName")}
        />
        {form.formState.errors.displayName && (
          <p className="text-xs text-red-500">{form.formState.errors.displayName.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input 
          id="confirmPassword" 
          type="password" 
          {...form.register("confirmPassword")}
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-xs text-red-500">{form.formState.errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2 py-2">
        <Switch
          id="isAdmin"
          checked={!!form.watch("isAdmin")}
          onCheckedChange={(checked) => {
            form.setValue("isAdmin", checked);
          }}
        />
        <Label htmlFor="isAdmin" className="cursor-pointer">Admin Privileges</Label>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={createUserMutation.isPending}
      >
        {createUserMutation.isPending ? (
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Plus className="mr-2 h-4 w-4" />
        )}
        Create User
      </Button>
    </form>
  );
}