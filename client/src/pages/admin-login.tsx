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
import { Shield, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: AdminLoginForm) => {
    setIsLoading(true);
    
    try {
      const success = await auth.login(data.username, data.password);
      
      if (success) {
        const user = auth.getUser();
        
        if (user?.isAdmin) {
          toast({
            title: "Admin Login Successful",
            description: `Welcome back, ${user.name}!`,
          });
          setLocation("/admin/dashboard");
        } else {
          toast({
            title: "Access Denied",
            description: "Admin privileges required",
            variant: "destructive",
          });
          auth.logout();
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid admin credentials",
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glassmorphic border-gray-700">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="text-primary text-4xl mr-2" />
              <span className="text-2xl font-bold text-white">Admin Portal</span>
            </div>
            <CardTitle className="text-xl text-white">Admin Access</CardTitle>
            <CardDescription className="text-gray-400">
              Sign in with admin credentials to access the management panel
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
                      <FormLabel>Admin Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter admin username"
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
                      <FormLabel>Admin Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter admin password"
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
                  className="w-full bg-gradient-to-r from-primary to-accent text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Access Admin Panel"}
                </Button>
              </form>
            </Form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
              <p className="text-sm font-medium text-gray-300 mb-2">Demo Admin Credentials:</p>
              <div className="text-sm text-gray-400">
                <p><strong>Username:</strong> admin</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
