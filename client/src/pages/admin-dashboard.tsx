import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/nav-bar";
import { AdminGuard } from "@/components/admin-guard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  Mail,
  Lock,
  Award,
  FileDown, // Add this for export icon
  Database, // Add this for database icon
  Trophy,
  Plus,
  AlertTriangle
} from "lucide-react";
import Footer from "@/components/footer";
import { apiRequest } from "@/lib/queryClient";
import { gameTypes, ageGroups } from "@shared/schema";

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("analytics");

  // Analytics Data
  const { data: analytics } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/analytics');
      return response.json();
    }
  });

  // Progress Summary
  const { data: progressSummary } = useQuery({
    queryKey: ['admin', 'progress', 'summary'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/progress/summary');
      return response.json();
    }
  });

  // Game Counts
  const { data: gameCounts } = useQuery({
    queryKey: ['admin', 'games', 'count'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/games/count');
      return response.json();
    }
  });

  // Database Actions
  const databaseActionMutation = useMutation({
    mutationFn: async (action: string) => {
      const response = await apiRequest('POST', `/api/admin/database/${action}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Database action completed successfully",
      });
      queryClient.invalidateQueries();
    }
  });

  // Export Data
  const exportDataMutation = useMutation({
    mutationFn: async (type: string) => {
      const response = await apiRequest('GET', `/api/admin/export/${type}`);
      return response.json();
    },
    onSuccess: (data) => {
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-${Date.now()}.json`;
      a.click();
    }
  });

  // Users Data
  const [userSearch, setUserSearch] = useState("");
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>("all");

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/users');
      return response.json();
    }
  });

  // User Management Mutations
  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest('POST', '/api/admin/users', userData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User created successfully",
      });
      queryClient.invalidateQueries(['admin', 'users']);
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest('PATCH', `/api/admin/users/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      queryClient.invalidateQueries(['admin', 'users']);
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/users/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      queryClient.invalidateQueries(['admin', 'users']);
    }
  });

  // Filter users based on search and age group
  const filteredUsers = users?.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.username.toLowerCase().includes(userSearch.toLowerCase());
    
    const matchesAgeGroup = ageGroupFilter === 'all' || user.ageGroup === ageGroupFilter;
    
    return matchesSearch && matchesAgeGroup;
  });

  const { data: achievements, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ['admin', 'achievements'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/achievements');
      return response.json();
    }
  });

  const createAchievementMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/admin/achievements', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Achievement created successfully",
      });
      queryClient.invalidateQueries(['admin', 'achievements']);
    }
  });

  const deleteAchievementMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/achievements/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Achievement deleted successfully",
      });
      queryClient.invalidateQueries(['admin', 'achievements']);
    }
  });

  // Add this near your other queries at the top of the component
  const { data: gameMetrics = { completionRates: {}, averageScores: {} }, isLoading: metricsLoading } = useQuery({
    queryKey: ['admin', 'gameMetrics'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/metrics');
      return response.json();
    }
  });

  // Add this mutation at the top with your other mutations
  const createContentMutation = useMutation({
    mutationFn: async ({ type, data }: { type: string; data: any }) => {
      const response = await apiRequest('POST', `/api/admin/content/${type}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Content created successfully",
      });
      queryClient.invalidateQueries(['admin', 'content']);
    }
  });

  return (
    <AdminGuard>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="content">Content Management</TabsTrigger>
              <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
              <TabsTrigger value="feedback">User Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>User Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>Total Users: {analytics?.totalUsers || 0}</p>
                      <p>Active Sessions: {analytics?.activeSessions || 0}</p>
                      <p>Completion Rate: {analytics?.completionRate || 0}%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Game Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>Quizzes: {gameCounts?.quizzes || 0}</p>
                      <p>Crosswords: {gameCounts?.crosswords || 0}</p>
                      <p>Word Scrambles: {gameCounts?.wordScrambles || 0}</p>
                      <p>Word Pics: {gameCounts?.wordPics || 0}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Progress by Age Group</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {progressSummary?.byAgeGroup && Object.entries(progressSummary.byAgeGroup).map(([group, value]) => (
                      <div key={group} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{group}</span>
                          <span>{value}%</span>
                        </div>
                        <Progress value={value} />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium">Average Session Duration</h4>
                        <p className="text-2xl font-bold">{analytics?.avgSessionDuration || '0'} minutes</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Return Rate</h4>
                        <p className="text-2xl font-bold">{analytics?.returnRate || '0'}%</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Most Active Time</h4>
                        <p className="text-2xl font-bold">{analytics?.peakActivityTime || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>User Management</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add User
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          createUserMutation.mutate(Object.fromEntries(formData));
                        }}>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="username">Username</Label>
                              <Input id="username" name="username" required />
                            </div>
                            <div>
                              <Label htmlFor="name">Name</Label>
                              <Input id="name" name="name" required />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" name="email" type="email" required />
                            </div>
                            <div>
                              <Label htmlFor="ageGroup">Age Group</Label>
                              <Select name="ageGroup" defaultValue={ageGroups.KIDS}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select age group" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.values(ageGroups).map(group => (
                                    <SelectItem key={group} value={group}>
                                      {group}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button type="submit">Create User</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search users..."
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>
                      <Select value={ageGroupFilter} onValueChange={setAgeGroupFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by age group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All age groups</SelectItem>
                          {Object.values(ageGroups).map(group => (
                            <SelectItem key={group} value={group}>{group}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Age Group</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers?.map(user => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{user.ageGroup}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="w-full">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Progress</span>
                                    <span>{user.progress}%</span>
                                  </div>
                                  <Progress value={user.progress} />
                                </div>
                              </TableCell>
                              <TableCell>
                                {format(new Date(user.createdAt), 'MMM d, yyyy')}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Edit User</DialogTitle>
                                      </DialogHeader>
                                      <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.currentTarget);
                                        updateUserMutation.mutate({ 
                                          id: user.id, 
                                          data: Object.fromEntries(formData)
                                        });
                                      }}>
                                        <div className="space-y-4">
                                          <div>
                                            <Label htmlFor="name">Name</Label>
                                            <Input 
                                              id="name" 
                                              name="name" 
                                              defaultValue={user.name}
                                            />
                                          </div>
                                          <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input 
                                              id="email" 
                                              name="email" 
                                              type="email" 
                                              defaultValue={user.email}
                                            />
                                          </div>
                                          <div>
                                            <Label htmlFor="ageGroup">Age Group</Label>
                                            <Select 
                                              name="ageGroup" 
                                              defaultValue={user.ageGroup}
                                            >
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {Object.values(ageGroups).map(group => (
                                                  <SelectItem key={group} value={group}>
                                                    {group}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <Button type="submit">Update User</Button>
                                        </div>
                                      </form>
                                    </DialogContent>
                                  </Dialog>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to delete this user?')) {
                                        deleteUserMutation.mutate(user.id);
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Achievement Management</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Achievement
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Achievement</DialogTitle>
                          <DialogDescription>
                            Add a new achievement that users can earn through various activities.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          createAchievementMutation.mutate({
                            title: formData.get('title'),
                            description: formData.get('description'),
                            icon: formData.get('icon'),
                            condition: formData.get('condition'),
                            threshold: parseInt(formData.get('threshold') as string),
                          });
                          (e.target as HTMLFormElement).reset();
                        }}>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="title">Title</Label>
                              <Input id="title" name="title" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea id="description" name="description" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="icon">Icon</Label>
                              <Input id="icon" name="icon" placeholder="e.g., FaTrophy" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="condition">Condition</Label>
                                <select 
                                  id="condition" 
                                  name="condition" 
                                  className="w-full rounded-md border border-input px-3 py-2"
                                  required
                                >
                                  <option value="QUIZZES_COMPLETED">Quizzes Completed</option>
                                  <option value="CROSSWORDS_COMPLETED">Crosswords Completed</option>
                                  <option value="WORD_PICS_COMPLETED">Word Pics Completed</option>
                                  <option value="WORD_SCRAMBLES_COMPLETED">Word Scrambles Completed</option>
                                  <option value="PERFECT_SCORE">Perfect Score</option>
                                  <option value="ACCOUNT_CREATED">Account Created</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="threshold">Threshold</Label>
                                <Input 
                                  id="threshold" 
                                  name="threshold" 
                                  type="number" 
                                  min="1" 
                                  required 
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Create Achievement</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingAchievements ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : achievements?.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium">No Achievements</h3>
                      <p className="text-sm text-gray-500">Start by creating your first achievement.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {achievements?.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Trophy className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{achievement.title}</h4>
                              <p className="text-sm text-gray-500">{achievement.description}</p>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline">{achievement.condition}</Badge>
                                <Badge variant="outline">Threshold: {achievement.threshold}</Badge>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this achievement?')) {
                                deleteAchievementMutation.mutate(achievement.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={() => exportDataMutation.mutate('users')}>
                      <FileDown className="mr-2 h-4 w-4" />
                      Export User Data
                    </Button>
                    <Button onClick={() => exportDataMutation.mutate('content')}>
                      <FileDown className="mr-2 h-4 w-4" />
                      Export Content Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Database Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        if (window.confirm('Are you sure? This action cannot be undone.')) {
                          databaseActionMutation.mutate('clear-progress');
                        }
                      }}
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Clear User Progress
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        if (window.confirm('Are you sure? This will reset all data!')) {
                          databaseActionMutation.mutate('reset');
                        }
                      }}
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Reset Database
                    </Button>
                    <Button
                      onClick={() => databaseActionMutation.mutate('seed')}
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Seed Sample Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Educational Content</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Content
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Content</DialogTitle>
                          <DialogDescription>
                            Create new educational content for the selected game type.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          createContentMutation.mutate({
                            type: formData.get('type') as string,
                            data: {
                              title: formData.get('title'),
                              description: formData.get('description'),
                              content: formData.get('content'),
                              difficulty: formData.get('difficulty'),
                              ageGroup: formData.get('ageGroup'),
                            }
                          });
                          (e.target as HTMLFormElement).reset();
                        }}>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="type">Game Type</Label>
                              <Select name="type" required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select game type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(gameTypes).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>{value}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="title">Title</Label>
                              <Input id="title" name="title" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea id="description" name="description" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="content">Content</Label>
                              <Textarea 
                                id="content" 
                                name="content" 
                                required 
                                placeholder="For quizzes: Enter questions and answers&#10;For crosswords: Enter words and clues&#10;For word scrambles: Enter words to scramble&#10;For word pics: Enter words and image URLs"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="difficulty">Difficulty</Label>
                                <Select name="difficulty" required>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select difficulty" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="ageGroup">Age Group</Label>
                                <Select name="ageGroup" required>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select age group" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.values(ageGroups).map(group => (
                                      <SelectItem key={group} value={group}>{group}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <Button type="submit" className="w-full">
                              Create Content
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="quizzes">
                    <TabsList>
                      {Object.entries(gameTypes).map(([key, value]) => (
                        <TabsTrigger key={key} value={key.toLowerCase()}>{value}</TabsTrigger>
                      ))}
                    </TabsList>
                    {Object.entries(gameTypes).map(([key, value]) => (
                      <TabsContent key={key} value={key.toLowerCase()}>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Difficulty</TableHead>
                                <TableHead>Age Group</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {/* Add content listing here */}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Game Completion Rates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(gameTypes).map(([type, label]) => {
                        const completionRate = gameMetrics.completionRates[type] ?? 0;
                        
                        return (
                          <div key={type} className="space-y-2">
                            <div className="flex justify-between">
                              <span>{label}</span>
                              <span>{completionRate}%</span>
                            </div>
                            <Progress value={completionRate} />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Average Scores by Age Group</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.values(ageGroups).map((group) => {
                        const averageScore = gameMetrics?.averageScores?.[group] ?? 0;
                        
                        return (
                          <div key={group} className="space-y-2">
                            <div className="flex justify-between">
                              <span>{group}</span>
                              <span>{averageScore}%</span>
                            </div>
                            <Progress value={averageScore} />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="feedback">
              <Card>
                <CardHeader>
                  <CardTitle>User Feedback and Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Game Type</TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Add feedback data mapping */}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    </AdminGuard>
  );
}