import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, ageGroups } from "@shared/schema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaFire } from "react-icons/fa";

// Extended schema with name and email for registration
const registerSchema = loginSchema.extend({
  name: z.string().min(3, "Name must be at least 3 characters").max(50),
  email: z.string().email("Invalid email format"),
  ageGroup: z.string().default(ageGroups.KIDS),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");

  // Add some console debugging
  console.log("Auth page render - user state:", user);

  // Initialize login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Initialize register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      email: "",
      ageGroup: ageGroups.KIDS,
    },
  });

  // Handle login submission
  const onLoginSubmit = (data: LoginFormValues) => {
    console.log("Attempting login with:", data.username);
    loginMutation.mutate(data, {
      onSuccess: (user) => {
        console.log("Login successful for user:", user);
        // Force redirect
        setTimeout(() => {
          console.log("Redirecting to home page...");
          window.location.href = "/";
        }, 500);
      },
      onError: (error) => {
        console.error("Login failed:", error.message);
      },
    });
  };

  // Handle register submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    console.log("Attempting registration for:", data.username);
    registerMutation.mutate(data, {
      onSuccess: (user) => {
        console.log("Registration successful for user:", user);
        // Force redirect
        setTimeout(() => {
          console.log("Redirecting to home page...");
          window.location.href = "/";
        }, 500);
      },
      onError: (error) => {
        console.error("Registration failed:", error.message);
      },
    });
  };

  // Redirect if already logged in
  if (user) {
    console.log("User is already logged in, redirecting...");
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="flex w-full max-w-6xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-fire-red to-fire-orange p-12 text-white">
          <div className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-8">
                <FaFire className="text-white text-3xl mr-3" />
                <h1 className="font-baloo text-3xl font-bold">APULA</h1>
              </div>

              <h2 className="text-3xl font-bold font-baloo mb-6">
                Learn Fire Safety The Fun Way
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Join our educational platform and learn crucial fire safety
                skills through interactive games and activities designed for all
                ages.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Interactive Learning</h3>
                    <p className="opacity-80">
                      Engage with quizzes, crosswords, and word games
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Age-Appropriate Content</h3>
                    <p className="opacity-80">
                      Material tailored for kids, teens, and adults
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Track Your Progress</h3>
                    <p className="opacity-80">
                      Earn badges and monitor your learning journey
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/30 pt-6 mt-8">
              <p className="text-sm opacity-80">
                "Fire safety education is not just important, it's life-saving.
                Make it fun, and it becomes unforgettable."
              </p>
              <p className="font-bold mt-2">- APULA Team</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="md:hidden flex items-center justify-center mb-8">
            <FaFire className="text-fire-red text-3xl mr-3" />
            <h1 className="font-baloo text-3xl font-bold text-dark-navy">
              APULA
            </h1>
          </div>

          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Welcome Back</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form
                      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your username"
                                {...field}
                              />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter your password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-fire-red hover:bg-red-700"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col items-center border-t pt-6">
                  <p className="text-sm text-gray-500 mb-2">
                    Don't have an account?
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setActiveTab("register")}
                  >
                    Create Account
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Create Account</CardTitle>
                  <CardDescription>
                    Join APULA to start your learning journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form
                      onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your full name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Choose a username"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Enter your email"
                                {...field}
                              />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Create a password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="ageGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age Group</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your age group" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={ageGroups.KIDS}>
                                  Kids (Ages 5-8)
                                </SelectItem>
                                <SelectItem value={ageGroups.PRETEENS}>
                                  Pre-teens (Ages 9-12)
                                </SelectItem>
                                <SelectItem value={ageGroups.TEENS}>
                                  Teens (Ages 13-17)
                                </SelectItem>
                                <SelectItem value={ageGroups.ADULTS}>
                                  Adults (Ages 18+)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-fire-red hover:bg-red-700"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending
                          ? "Creating Account..."
                          : "Register"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col items-center border-t pt-6">
                  <p className="text-sm text-gray-500 mb-2">
                    Already have an account?
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setActiveTab("login")}
                  >
                    Login Instead
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
