import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { AIAssistant } from "@/components/booking/ai-assistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { CalendarPlus, List, Bot, Gamepad2, Calendar, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const user = auth.getUser();

  if (!user) return null;

  const quickActions = [
    {
      title: "Book a Turf",
      description: "Find and book available grounds near you",
      icon: CalendarPlus,
      href: "/grounds",
      badge: "Quick",
      bgColor: "from-accent to-green-600",
    },
    {
      title: "My Bookings",
      description: "View and manage your reservations",
      icon: List,
      href: "/bookings",
      badge: "3 Active",
      bgColor: "from-primary to-blue-600",
    },
    {
      title: "AI Assistant",
      description: '"Best time to play tomorrow?"',
      icon: Bot,
      onClick: () => setAiAssistantOpen(true),
      badge: "AI",
      bgColor: "from-accent to-primary",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, <span className="text-accent">{user.name.split(' ')[0]}</span>!
            </h1>
            <p className="text-gray-400">Ready to book your next game?</p>
          </motion.div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glassmorphic border-gray-700 hover:scale-105 transition-transform duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${action.bgColor} bg-opacity-20`}>
                        <action.icon className="text-2xl w-6 h-6 text-accent" />
                      </div>
                      <Badge variant="secondary" className={`bg-gradient-to-r ${action.bgColor} text-white`}>
                        {action.badge}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{action.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{action.description}</p>
                    
                    {action.href ? (
                      <Link href={action.href}>
                        <Button className={`w-full bg-gradient-to-r ${action.bgColor} text-white font-medium hover:opacity-80 transition-opacity duration-300`}>
                          {action.title === "Book a Turf" ? "Book Now" : 
                           action.title === "My Bookings" ? "View All" : "Open"}
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        onClick={action.onClick}
                        className={`w-full bg-gradient-to-r ${action.bgColor} text-white font-medium hover:opacity-80 transition-opacity duration-300`}
                      >
                        Ask AI
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="glassmorphic border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gamepad2 className="w-5 h-5 mr-2 text-accent" />
                  Your Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent mb-1">12</div>
                    <div className="text-sm text-gray-400">Total Bookings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{user.loyaltyPoints}</div>
                    <div className="text-sm text-gray-400">Loyalty Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent mb-1">PKR 24,000</div>
                    <div className="text-sm text-gray-400">Total Spent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8"
          >
            <Card className="glassmorphic border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-accent" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Victory Sports Complex</p>
                      <p className="text-sm text-gray-400">Today, 6:00 PM - 8:00 PM</p>
                    </div>
                    <Badge className="bg-accent text-black">Confirmed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Elite Football Arena</p>
                      <p className="text-sm text-gray-400">Yesterday, 10:00 AM - 11:30 AM</p>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <AIAssistant isOpen={aiAssistantOpen} onClose={() => setAiAssistantOpen(false)} />
    </div>
  );
}
