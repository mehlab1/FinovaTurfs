import { useQuery } from "@tanstack/react-query";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Users, 
  DollarSign,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { AdminStats, Booking } from "@/lib/types";
import { dataService } from "@/lib/data";


export default function AdminDashboard() {
  // Dummy stats and bookings
  const dummyStats: AdminStats = {
    revenue: 0,
    bookings: 0,
    occupancy: 0,
    activeUsers: 0,
  };
  const dummyBookings: Booking[] = [
    {
      id: 101,
      userId: 1,
      groundId: 1,
      date: "2025-07-15",
      startTime: "18:00",
      endTime: "19:00",
      duration: "1",
      totalPrice: "2000",
      usedLoyaltyPoints: false,
      status: "confirmed",
      createdAt: "2025-07-15T18:00:00Z",
      user: { id: 1, username: "ali", password: "", name: "Ali Raza", email: "ali@example.com", isAdmin: false, loyaltyPoints: 0, createdAt: "2025-07-01T00:00:00Z" },
      ground: { id: 1, name: "Victory Sports Complex", location: "Defence, Karachi", city: "Karachi", sports: ["football"], basePrice: "2000", openTime: "10:00", closeTime: "01:00", rating: "4.8", imageUrl: "" },
    },
    {
      id: 102,
      userId: 2,
      groundId: 2,
      date: "2025-07-15",
      startTime: "19:00",
      endTime: "20:00",
      duration: "1",
      totalPrice: "2200",
      usedLoyaltyPoints: false,
      status: "pending",
      createdAt: "2025-07-15T19:00:00Z",
      user: { id: 2, username: "sara", password: "", name: "Sara Khan", email: "sara@example.com", isAdmin: false, loyaltyPoints: 0, createdAt: "2025-07-01T00:00:00Z" },
      ground: { id: 2, name: "Elite Football Arena", location: "Gulberg, Lahore", city: "Lahore", sports: ["football"], basePrice: "1800", openTime: "10:00", closeTime: "01:00", rating: "4.6", imageUrl: "" },
    },
    {
      id: 103,
      userId: 3,
      groundId: 1,
      date: "2025-07-16",
      startTime: "17:00",
      endTime: "18:00",
      duration: "1",
      totalPrice: "2000",
      usedLoyaltyPoints: false,
      status: "cancelled",
      createdAt: "2025-07-16T17:00:00Z",
      user: { id: 3, username: "bilal", password: "", name: "Bilal Ahmed", email: "bilal@example.com", isAdmin: false, loyaltyPoints: 0, createdAt: "2025-07-01T00:00:00Z" },
      ground: { id: 1, name: "Victory Sports Complex", location: "Defence, Karachi", city: "Karachi", sports: ["football"], basePrice: "2000", openTime: "10:00", closeTime: "01:00", rating: "4.8", imageUrl: "" },
    },
  ];

  // Dummy data for booking trends (weekly)
  const dummyTrends = [
    { day: "Mon", bookings: 30 },
    { day: "Tue", bookings: 42 },
    { day: "Wed", bookings: 38 },
    { day: "Thu", bookings: 50 },
    { day: "Fri", bookings: 60 },
    { day: "Sat", bookings: 70 },
    { day: "Sun", bookings: 30 },
  ];
  // Dummy data for peak hours heatmap
  const dummyHeatmap = [
    { hour: "16:00", value: 10 },
    { hour: "17:00", value: 18 },
    { hour: "18:00", value: 32 },
    { hour: "19:00", value: 40 },
    { hour: "20:00", value: 35 },
    { hour: "21:00", value: 22 },
    { hour: "22:00", value: 12 },
  ];

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ['admin/stats'],
    queryFn: () => dataService.getAdminStats(),
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ['admin/bookings'],
    queryFn: () => dataService.getAdminBookings(),
  });

  // Use dummy data if no data is loaded or if stats are missing/zero
  const statsData: AdminStats = (stats && (stats.revenue > 0 || stats.bookings > 0)) ? stats : dummyStats;
  const bookingsData: Booking[] = (bookings && bookings.length > 0) ? bookings : dummyBookings;
  const trendsData = dummyTrends;
  const heatmapData = dummyHeatmap;

  const statCards = [
    {
      title: "Monthly Revenue",
      value: `PKR ${statsData.revenue?.toLocaleString()}`,
      change: "+12%",
      trend: "up",
      icon: DollarSign,
      color: "from-accent to-green-600"
    },
    {
      title: "Total Bookings",
      value: statsData.bookings,
      change: "+8%",
      trend: "up",
      icon: Calendar,
      color: "from-primary to-blue-600"
    },
    {
      title: "Occupancy Rate",
      value: `${statsData.occupancy}%`,
      change: "-3%",
      trend: "down",
      icon: BarChart3,
      color: "from-yellow-500 to-orange-600"
    },
    {
      title: "Active Users",
      value: statsData.activeUsers,
      change: "+15%",
      trend: "up",
      icon: Users,
      color: "from-purple-500 to-pink-600"
    }
  ];

  const recentBookings = bookingsData.slice(0, 5);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Overview of your sports ground operations</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glassmorphic border-gray-700 hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                      <stat.icon className="w-6 h-6 text-accent" />
                    </div>
                    <Badge 
                      variant={stat.trend === 'up' ? 'default' : 'secondary'}
                      className={`${stat.trend === 'up' ? 'bg-green-500' : 'bg-red-500'} text-white`}
                    >
                      {stat.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {stat.change}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {statsLoading ? (
                      <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
                    ) : (
                      stat.value
                    )}
                  </h3>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Booking Trends Chart (dummy bar chart) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="glassmorphic border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-accent" />
                  Booking Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="w-full h-full flex items-end gap-2">
                    {trendsData.map((d, i) => (
                      <div key={d.day} className="flex flex-col items-center flex-1">
                        <div
                          className="rounded-t bg-accent"
                          style={{ height: `${d.bookings * 2}px`, minHeight: '10px', width: '24px', transition: 'height 0.3s' }}
                        ></div>
                        <span className="text-xs text-gray-400 mt-2">{d.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Peak Hours Heatmap (dummy horizontal bar chart) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="glassmorphic border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-accent" />
                  Peak Hours Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex flex-col justify-center gap-2">
                  {heatmapData.map((d, i) => (
                    <div key={d.hour} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-12">{d.hour}</span>
                      <div
                        className="rounded bg-accent"
                        style={{ height: '18px', width: `${d.value * 6}px`, minWidth: '10px', transition: 'width 0.3s' }}
                      ></div>
                      <span className="text-xs text-gray-400">{d.value} bookings</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="glassmorphic border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-accent" />
                  Recent Bookings
                </div>
                <Badge variant="secondary">{bookings?.length || 0} total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-700 rounded animate-pulse w-1/3"></div>
                        <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2"></div>
                      </div>
                      <div className="h-6 bg-gray-700 rounded animate-pulse w-20"></div>
                    </div>
                  ))}
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No recent bookings</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking: Booking, index: number) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-colors duration-300"
                    >
                      <div>
                        <p className="font-medium text-white">{booking.ground?.name}</p>
                        <p className="text-sm text-gray-400">
                          {booking.user?.name} • {new Date(booking.date).toLocaleDateString()} • {booking.startTime}-{booking.endTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-accent">PKR {parseInt(booking.totalPrice).toLocaleString()}</p>
                        <Badge 
                          variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                          className={booking.status === 'confirmed' ? 'bg-accent text-black' : ''}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
