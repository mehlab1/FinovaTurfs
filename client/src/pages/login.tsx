import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/auth";
import { Gamepad2, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    
    try {
      const success = await auth.login(data.username, data.password);
      
      if (success) {
        const user = auth.getUser();
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user?.name}!`,
        });
        
        if (user?.isAdmin) {
          setLocation("/admin/dashboard");
        } else {
          setLocation("/dashboard");
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 px-4 relative overflow-hidden">
      {/* Energetic Sporty Animated CSS Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute w-[120vw] h-[120vw] left-[-10vw] top-[-40vw] bg-gradient-to-tr from-accent/60 via-blue-700/40 to-primary/60 rounded-full blur-3xl animate-spin-slow" style={{animationDuration:'18s'}} />
        <div className="absolute w-[80vw] h-[80vw] right-[-20vw] bottom-[-30vw] bg-gradient-to-br from-primary/40 via-accent/30 to-blue-900/40 rounded-full blur-2xl animate-pulse" style={{animationDuration:'8s'}} />
        {/* Animated lines */}
        <div className="absolute left-0 top-1/3 w-full h-1 bg-gradient-to-r from-accent/60 via-transparent to-primary/60 blur-lg animate-move-x" style={{animationDuration:'7s'}} />
        <div className="absolute left-0 top-2/3 w-full h-1 bg-gradient-to-r from-primary/60 via-transparent to-accent/60 blur-lg animate-move-x-reverse" style={{animationDuration:'9s'}} />
        {/* Animated balls */}
        <div className="absolute left-[10%] top-[20%] w-16 h-16 bg-white rounded-full shadow-2xl border-4 border-accent animate-bounce-sport" style={{animationDuration:'2.5s'}} />
        <div className="absolute left-[80%] top-[70%] w-10 h-10 bg-white rounded-full shadow-xl border-4 border-primary animate-bounce-sport-reverse" style={{animationDuration:'2.8s'}} />
        <div className="absolute left-[50%] top-[85%] w-8 h-8 bg-white rounded-full shadow-lg border-4 border-blue-700 animate-bounce-sport" style={{animationDuration:'2.2s'}} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
        style={{zIndex:1}}
      >
        <Card className="glassmorphic border-gray-700">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Gamepad2 className="text-accent text-4xl mr-2" />
              <span className="text-2xl font-bold text-white">Finova Turfs</span>
            </div>
            <CardTitle className="text-xl text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your username"
                          className="bg-gray-800 border-gray-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="bg-gray-800 border-gray-700 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-accent to-primary text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
              <p className="text-sm font-medium text-gray-300 mb-2">Demo Credentials:</p>
              <div className="text-sm text-gray-400 space-y-1">
                <p><strong>User:</strong> ahmed / password123</p>
                <p><strong>Admin:</strong> admin / admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
