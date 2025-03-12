import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/nav-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { FaTools, FaChartLine, FaMedal, FaUserPlus, FaUserEdit, FaTrophy, FaEdit, FaTrash } from "react-icons/fa";
import Footer from "@/components/footer";
import { z } from "zod";

// QuizForm schema
const quizFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  ageGroup: z.string(),
  difficulty: z.string(),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

// User form schema
const userFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  ageGroup: z.string(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

// Achievement form schema
const achievementFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  criteria: z.string().min(5, "Criteria must be at least 5 characters"),
  points: z.number().min(1, "Points must be at least 1"),
});

type AchievementFormValues = z.infer<typeof achievementFormSchema>;

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("content");
  const [selectedGameType, setSelectedGameType] = useState("quiz");

  // Check if user is admin
  const isAdmin = user?.username === "admin" || user?.id === 1;

  if (!isAdmin) {
    // If not admin, redirect to home
    setTimeout(() => navigate("/"), 100);
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-4">You do not have permission to view this page.</p>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
      </div>
    );
  }

  // Get all users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) return [];
        return await res.json();
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    }
  });

  // Get all games
  const { data: games, isLoading: gamesLoading } = useQuery({
    queryKey: ["admin-games"],
    queryFn: async () => {
      try {
        // For the admin dashboard, we'll just aggregate the game data we have
        const [quizzes, crosswords, wordScrambles, wordPics] = await Promise.all([
          fetch("/api/quizzes").then(res => res.ok ? res.json() : []),
          fetch("/api/crosswords").then(res => res.ok ? res.json() : []),
          fetch("/api/word-scrambles").then(res => res.ok ? res.json() : []),
          fetch("/api/word-pics").then(res => res.ok ? res.json() : [])
        ]);

        return {
          quizzes: quizzes || [],
          crosswords: crosswords || [],
          wordScrambles: wordScrambles || [],
          wordPics: wordPics || []
        };
      } catch (error) {
        console.error("Error fetching games:", error);
        return {
          quizzes: [],
          crosswords: [],
          wordScrambles: [],
          wordPics: []
        };
      }
    }
  });

  // Get all achievements
  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ["admin-achievements"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/achievements");
        if (!res.ok) return [];
        return await res.json();
      } catch (error) {
        console.error("Error fetching achievements:", error);
        return [];
      }
    }
  });

  // Get basic analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      try {
        // In a real implementation, you would have a proper analytics endpoint
        // For now, we'll simulate some basic analytics
        const [userCount, gameData, progressData] = await Promise.all([
          fetch("/api/admin/users/count").then(res => res.ok ? res.json() : { count: 0 }),
          fetch("/api/admin/games/stats").then(res => res.ok ? res.json() : {}),
          fetch("/api/admin/progress/stats").then(res => res.ok ? res.json() : {})
        ]);

        return {
          userCount: userCount.count || 0,
          gameStats: gameData || {},
          progressStats: progressData || {}
        };
      } catch (error) {
        console.error("Error fetching analytics:", error);
        return {
          userCount: 0,
          gameStats: {},
          progressStats: {}
        };
      }
    }
  });

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: async (data: UserFormValues) => {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to create user");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "User Created",
        description: "The user has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create user: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const createAchievementMutation = useMutation({
    mutationFn: async (data: AchievementFormValues) => {
      const res = await fetch("/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to create achievement");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Achievement Created",
        description: "The achievement has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create achievement: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete user");
      return true;
    },
    onSuccess: () => {
      toast({
        title: "User Deleted",
        description: "The user has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const seedGameDataMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/seed", {
        method: "POST"
      });
      if (!res.ok) throw new Error("Failed to seed data");
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Data Seeded",
        description: "Sample data has been seeded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to seed data: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const onUserSubmit = (data: UserFormValues) => {
    createUserMutation.mutate(data);
  };

  const onAchievementSubmit = (data: AchievementFormValues) => {
    createAchievementMutation.mutate(data);
  };

  const handleSeedData = () => {
    seedGameDataMutation.mutate();
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="container mx-auto px-4 py-12">
        <div className="bg-dark-navy p-6 rounded-xl shadow-lg mb-8">
          <h1 className="text-2xl font-baloo font-bold text-white">Admin Dashboard</h1>
          <p className="text-white opacity-80">Manage content, users, and monitor progress</p>
        </div>

        <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* CONTENT MANAGEMENT TAB */}
          <TabsContent value="content">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Content cards would go here */}
            </div>
          </TabsContent>

          {/* USERS MANAGEMENT TAB */}
          <TabsContent value="users">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User Management Card */}
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-1">Key Features:</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-700">
                      <FaUserPlus className="text-fire-red mr-2" />
                      Add New Users
                    </li>
                    <li className="flex items-center text-gray-700">
                      <FaUserEdit className="text-fire-red mr-2" />
                      Edit User Profiles
                    </li>
                    <li className="flex items-center text-gray-700">
                      <FaChartLine className="text-fire-red mr-2" />
                      Track User Progress
                    </li>
                  </ul>
                  <Button className="mt-4 w-full bg-fire-red hover:bg-red-700">
                    Manage Users
                  </Button>
                </CardContent>
              </Card>

              {/* User List */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>User List</CardTitle>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <p>Loading users...</p>
                  ) : users && users.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Group</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user: any) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {user.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.username}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.ageGroup}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                                  <FaTrash />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>No users found.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Reports Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-1">Available Reports:</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-700">
                      <FaChartLine className="text-fire-red mr-2" />
                      Usage Statistics
                    </li>
                    <li className="flex items-center text-gray-700">
                      <FaMedal className="text-fire-red mr-2" />
                      Achievement Tracking
                    </li>
                  </ul>
                  <Button className="mt-4 w-full bg-fire-red hover:bg-red-700">
                    View Reports
                  </Button>
                </CardContent>
              </Card>

              {/* Game Usage Stats */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Game Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-white rounded flex items-center justify-center border">
                    <div className="text-center text-gray-500">
                      <p className="mb-2">Game usage chart will appear here</p>
                      <p className="text-sm">This feature is under development</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ACHIEVEMENTS TAB */}
          <TabsContent value="achievements">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Achievement Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Create and manage achievements to motivate users in their fire safety learning journey.
                  </p>
                  <Button className="w-full bg-fire-red hover:bg-red-700">
                      Create Achievement
                  </Button>
                </CardContent>
              </Card>
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Achievement List</CardTitle>
                </CardHeader>
                <CardContent>
                  {achievementsLoading ? (
                    <p>Loading achievements...</p>
                  ) : achievements && achievements.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {achievements.map((achievement) => (
                        <AccordionItem key={achievement.id} value={`achievement-${achievement.id}`}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center">
                              <FaTrophy className="text-yellow-500 mr-2" />
                              <span>{achievement.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="p-4 bg-gray-50 rounded-md">
                              <p className="text-gray-700 mb-2">{achievement.description}</p>
                              <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                                <span className="bg-gray-200 px-2 py-1 rounded">
                                  Condition: {achievement.criteria}
                                </span>
                                <span className="bg-gray-200 px-2 py-1 rounded">
                                  Points: {achievement.points}
                                </span>
                              </div>
                              <div className="flex mt-4 gap-2">
                                <Button variant="outline" size="sm">
                                  <FaEdit className="mr-2" /> Edit
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-500">
                                  <FaTrash className="mr-2" /> Delete
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    // Default achievements if none are loaded
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="achievement-1">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center">
                            <FaTrophy className="text-yellow-500 mr-2" />
                            <span>First Day</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="p-4 bg-gray-50 rounded-md">
                            <p className="text-gray-700 mb-2">Awarded for creating an account and starting your fire safety journey!</p>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                              <span className="bg-gray-200 px-2 py-1 rounded">
                                Condition: ACCOUNT_CREATED
                              </span>
                              <span className="bg-gray-200 px-2 py-1 rounded">
                                Threshold: 1
                              </span>
                            </div>
                            <div className="flex mt-4 gap-2">
                              <Button variant="outline" size="sm">
                                <FaEdit className="mr-2" /> Edit
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-500">
                                <FaTrash className="mr-2" /> Delete
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="achievement-2">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center">
                            <FaTrophy className="text-yellow-500 mr-2" />
                            <span>Quiz Master</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="p-4 bg-gray-50 rounded-md">
                            <p className="text-gray-700 mb-2">Complete 5 quizzes to earn this badge!</p>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                              <span className="bg-gray-200 px-2 py-1 rounded">
                                Condition: QUIZZES_COMPLETED
                              </span>
                              <span className="bg-gray-200 px-2 py-1 rounded">
                                Threshold: 5
                              </span>
                            </div>
                            <div className="flex mt-4 gap-2">
                              <Button variant="outline" size="sm">
                                <FaEdit className="mr-2" /> Edit
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-500">
                                <FaTrash className="mr-2" /> Delete
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FaTools className="text-fire-red mr-2" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-md">
                      <h3 className="font-semibold mb-2">Application Settings</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Site Title
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            defaultValue="Fire Safety Heroes"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Contact Email
                          </label>
                          <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            defaultValue="contact@firesafetyheroes.com"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Maximum Users
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            defaultValue="1000"
                          />
                        </div>
                      </div>
                      <Button className="w-full bg-fire-red hover:bg-red-700">
                        Save Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FaTools className="text-fire-red mr-2" />
                    Admin Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-amber-200 bg-amber-50 rounded-md">
                      <h3 className="font-semibold mb-2">Database Management</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        These actions affect the database and cannot be undone. Use with caution.
                      </p>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleSeedData}
                        >
                          Seed Sample Data
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full text-amber-700 border-amber-700"
                        >
                          Clear User Progress
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full text-red-700 border-red-700"
                        >
                          Reset Database
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 bg-gray-50 rounded-md">
                      <h3 className="font-semibold mb-2">Import/Export</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Transfer data in and out of the application.
                      </p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">
                          Export Users
                        </Button>

                        <Button variant="outline" className="w-full">
                          Export Content
                        </Button>

                        <Button variant="outline" className="w-full">
                          Import Content
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}