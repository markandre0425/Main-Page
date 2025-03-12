import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import { ageGroups } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Loader2, BadgeCheck, Medal, Award } from "lucide-react";
import { formatProgress } from "@/lib/data";

// Form schema for updating user profile
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, updateAgeGroupMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("info");
  
  // Fetch user progress with auto-refresh
  const { data: userProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/progress"],
    enabled: !!user,
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchOnWindowFocus: true, // Refetch when tab gets focus
    queryFn: async () => {
      const res = await fetch('/api/progress');
      if (!res.ok) throw new Error("Failed to fetch user progress");
      return res.json();
    }
  });
  
  // Fetch user data with auto-refresh
  const { data: userData, isLoading: userDataLoading } = useQuery({
    queryKey: ["/api/user", user?.id],
    enabled: !!user,
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchOnWindowFocus: true, // Refetch when tab gets focus
    queryFn: async () => {
      const res = await fetch('/api/user');
      if (!res.ok) throw new Error("Failed to fetch user data");
      return res.json();
    }
  });
  
  // Fetch user achievements with auto-refresh
  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ["/api/user/achievements"],
    enabled: !!user,
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchOnWindowFocus: true, // Refetch when tab gets focus
    queryFn: async () => {
      const res = await fetch('/api/user/achievements');
      if (!res.ok) throw new Error("Failed to fetch achievements");
      return res.json();
    }
  });
  
  // Set up form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });
  
  // Handle profile update
  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (!res.ok) {
        throw new Error("Failed to update profile");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate any relevant queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle age group update
  const handleAgeGroupChange = (ageGroup: string) => {
    updateAgeGroupMutation.mutate({ ageGroup });
  };
  
  // Handle form submission
  function onSubmit(values: ProfileFormValues) {
    updateProfileMutation.mutate(values);
  }
  
  // Calculate completion statistics
  const calculateStats = () => {
    if (!userProgress || userProgress.length === 0) {
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        completionRate: 0,
      };
    }
    
    const total = userProgress.length;
    const completed = userProgress.filter((p: any) => p.completed).length;
    const inProgress = userProgress.filter((p: any) => !p.completed && p.score > 0).length;
    const completionRate = Math.round((completed / total) * 100);
    
    return { total, completed, inProgress, completionRate };
  };
  
  const stats = calculateStats();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-baloo font-bold text-dark-navy mb-6">My Profile</h1>
        
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        disabled={updateProfileMutation.isPending}
                        className="w-full"
                      >
                        {updateProfileMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Changes
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Username</p>
                    <p className="text-sm text-muted-foreground">{user.username}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Age Group</p>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.ageGroup === 'kids' ? 'bg-blue-500 text-white' :
                        user.ageGroup === 'preteens' ? 'bg-green-500 text-white' :
                        user.ageGroup === 'teens' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {user.ageGroup.charAt(0).toUpperCase() + user.ageGroup.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Account Created</p>
                    <p className="text-sm text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Progress</p>
                    <Progress value={(userData?.progress || user.progress || 0)} className="mt-1" />
                    {userDataLoading && (
                      <div className="flex items-center mt-1">
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        <span className="text-xs text-muted-foreground">Updating...</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-32">
                    <div className="text-4xl font-bold text-center">
                      {progressLoading ? (
                        <Loader2 className="h-12 w-12 animate-spin" />
                      ) : (
                        <span>{stats.completionRate}%</span>
                      )}
                    </div>
                    <Progress value={stats.completionRate} className="mt-4 w-3/4" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {stats.completed} of {stats.total} games completed
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-32">
                    <div className="text-4xl font-bold text-center">
                      {achievementsLoading ? (
                        <Loader2 className="h-12 w-12 animate-spin" />
                      ) : (
                        <span>{achievements?.length || 0}</span>
                      )}
                    </div>
                    <div className="flex justify-center mt-2">
                      <Medal className="h-6 w-6 text-yellow-500 mr-2" />
                      <BadgeCheck className="h-6 w-6 text-blue-500 mr-2" />
                      <Award className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Achievements earned
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Fire Safety Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-32">
                    <div className="text-4xl font-bold text-center text-fire-red">
                      {progressLoading || userDataLoading ? (
                        <Loader2 className="h-12 w-12 animate-spin" />
                      ) : (
                        <span>{formatProgress(userData?.progress || user.progress || 0)}%</span>
                      )}
                    </div>
                    <Progress value={formatProgress(userData?.progress || user.progress || 0)} className="mt-4 w-3/4" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {formatProgress(userData?.progress || user.progress || 0) < 25 ? "Beginner" :
                       formatProgress(userData?.progress || user.progress || 0) < 50 ? "Intermediate" :
                       formatProgress(userData?.progress || user.progress || 0) < 75 ? "Advanced" : "Expert"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Age Group</CardTitle>
                <CardDescription>
                  Change your age group to access appropriate content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Current Age Group</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.ageGroup === 'kids' ? 'bg-blue-500 text-white' :
                      user.ageGroup === 'preteens' ? 'bg-green-500 text-white' :
                      user.ageGroup === 'teens' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {user.ageGroup.charAt(0).toUpperCase() + user.ageGroup.slice(1)}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <FormLabel htmlFor="ageGroup">Select Age Group</FormLabel>
                    <Select 
                      value={user.ageGroup} 
                      onValueChange={handleAgeGroupChange}
                      disabled={updateAgeGroupMutation.isPending}
                    >
                      <SelectTrigger id="ageGroup">
                        <SelectValue placeholder="Select age group" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value={ageGroups.KIDS}>Kids (5-8)</SelectItem>
                        <SelectItem value={ageGroups.PRETEENS}>Pre-teens (9-12)</SelectItem>
                        <SelectItem value={ageGroups.TEENS}>Teens (13-17)</SelectItem>
                        <SelectItem value={ageGroups.ADULTS}>Adults (18+)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This will change the content difficulty to match your age group.
                    </FormDescription>
                    
                    {updateAgeGroupMutation.isPending && (
                      <div className="flex items-center justify-center mt-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span className="text-sm">Updating...</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}