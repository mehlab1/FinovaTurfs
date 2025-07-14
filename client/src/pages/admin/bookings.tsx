import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, Filter, Download, Eye, Users, TrendingUp, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminBookings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [groundFilter, setGroundFilter] = useState("");

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['/api/admin/bookings'],
  });

  const { data: grounds } = useQuery({
    queryKey: ['/api/grounds'],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-accent text-black';
      case 'completed': return 'bg-gray-600 text-white';
      case 'cancelled': return 'bg-destructive text-white';
      default: return 'bg-yellow-500 text-black';
    }
  };

  const filteredBookings = bookings?.filter((booking: any) => {
    const matchesSearch = !searchTerm || 
      booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.ground?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    const matchesGround = !groundFilter || booking.groundId.toString() === groundFilter;
    
    return matchesSearch && matchesStatus && matchesGround;
  }) || [];

  const totalRevenue = bookings?.reduce((sum: number, booking: any) => sum + parseFloat(booking.totalPrice), 0) || 0;
  const todayBookings = bookings?.filter((booking: any) => {
    const today = new Date().toISOString().split('T')[0];
    return booking.date === today;
  }).length || 0;

  const stats = [
    {
      title: "Total Bookings",
      value: bookings?.length || 0,
      icon: Calendar,
      color: "from-accent to-green-600"
    },
    {
      title: "Today's Bookings",
      value: todayBookings,
      icon: TrendingUp,
      color: "from-primary to-blue-600"
    },
    {
      title: "Total Revenue",
      value: `PKR ${totalRevenue.toLocaleString()}`,
      icon: BarChart3,
      color: "from-yellow-500 to-orange-600"
    },
    {
      title: "Active Users",
      value: new Set(bookings?.map((b: any) => b.userId)).size || 0,
      icon: Users,
      color: "from-purple-500 to-pink-600"
    }
  ];

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
          <h1 className="text-3xl font-bold text-white mb-2">Bookings Overview</h1>
          <p className="text-gray-400">Monitor and manage all ground bookings</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glassmorphic border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                      <stat.icon className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6"
        >
          <Card className="glassmorphic border-gray-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={groundFilter} onValueChange={setGroundFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Filter by ground" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Grounds</SelectItem>
                    {grounds?.map((ground: any) => (
                      <SelectItem key={ground.id} value={ground.id.toString()}>
                        {ground.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button className="bg-accent text-black hover:bg-opacity-80">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glassmorphic border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-accent" />
                  All Bookings
                </div>
                <Badge variant="secondary">{filteredBookings.length} results</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-800 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-400">Booking ID</TableHead>
                        <TableHead className="text-gray-400">Customer</TableHead>
                        <TableHead className="text-gray-400">Ground</TableHead>
                        <TableHead className="text-gray-400">Date & Time</TableHead>
                        <TableHead className="text-gray-400">Duration</TableHead>
                        <TableHead className="text-gray-400">Amount</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-gray-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking: any, index: number) => (
                        <motion.tr
                          key={booking.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-gray-700 hover:bg-gray-800 transition-colors duration-300"
                        >
                          <TableCell>
                            <span className="font-mono text-accent">#{booking.id.toString().padStart(4, '0')}</span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-white">{booking.user?.name}</div>
                              <div className="text-sm text-gray-400">{booking.user?.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-white">{booking.ground?.name}</div>
                              <div className="text-sm text-gray-400">{booking.ground?.location}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-white">
                                {new Date(booking.date).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-400">
                                {booking.startTime} - {booking.endTime}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-white">{booking.duration} hrs</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-accent">
                              PKR {parseInt(booking.totalPrice).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-accent"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {!isLoading && filteredBookings.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No bookings found</h3>
                  <p className="text-gray-400">Try adjusting your filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
