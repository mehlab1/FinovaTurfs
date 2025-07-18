import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { auth } from "@/lib/auth";
import { type Booking } from "@/lib/types";
import { Calendar, MapPin, Clock, Sun, CloudSun, Moon, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

import { useState } from "react";
import { dataService } from "@/lib/data";

export default function Bookings() {
  const user = auth.getUser();

  // Demo bookings if no real data
  const demoBookings: Booking[] = [
    {
      id: 1,
      userId: user?.id || 1,
      groundId: 1,
      date: "2025-07-10",
      startTime: "10:00",
      endTime: "11:00",
      duration: "1",
      totalPrice: "2000",
      usedLoyaltyPoints: false,
      status: "completed",
      createdAt: "2025-07-01T10:00:00Z",
      ground: { id: 1, name: "Finova Turf 1", location: "DHA Phase 6", city: "Karachi", sports: ["Football"], basePrice: "2000", openTime: "08:00", closeTime: "22:00", rating: "4.5" },
    },
    {
      id: 2,
      userId: user?.id || 1,
      groundId: 2,
      date: "2025-07-12",
      startTime: "12:00",
      endTime: "13:00",
      duration: "1",
      totalPrice: "2200",
      usedLoyaltyPoints: false,
      status: "completed",
      createdAt: "2025-07-02T12:00:00Z",
      ground: { id: 2, name: "Finova Turf 2", location: "Gulshan-e-Iqbal", city: "Karachi", sports: ["Cricket"], basePrice: "2200", openTime: "08:00", closeTime: "22:00", rating: "4.7" },
    },
    {
      id: 3,
      userId: user?.id || 1,
      groundId: 1,
      date: "2025-07-13",
      startTime: "16:00",
      endTime: "17:00",
      duration: "1",
      totalPrice: "2000",
      usedLoyaltyPoints: false,
      status: "cancelled",
      createdAt: "2025-07-10T16:00:00Z",
      ground: { id: 1, name: "Finova Turf 1", location: "DHA Phase 6", city: "Karachi", sports: ["Football"], basePrice: "2000", openTime: "08:00", closeTime: "22:00", rating: "4.5" },
    },
    {
      id: 4,
      userId: user?.id || 1,
      groundId: 2,
      date: "2025-07-18",
      startTime: "19:00",
      endTime: "20:00",
      duration: "1",
      totalPrice: "2200",
      usedLoyaltyPoints: false,
      status: "confirmed",
      createdAt: "2025-07-15T19:00:00Z",
      ground: { id: 2, name: "Finova Turf 2", location: "Gulshan-e-Iqbal", city: "Karachi", sports: ["Cricket"], basePrice: "2200", openTime: "08:00", closeTime: "22:00", rating: "4.7" },
    },
  ];

  const { data: bookingsApi, isLoading } = useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: async () => {
      if (!user) throw new Error('User not found');
      return await dataService.getBookingsByUserId(user.id);
    },
    enabled: !!user,
  });

  // Use demo bookings if no real data
  const [bookings, setBookings] = useState<Booking[]>(bookingsApi && bookingsApi.length > 0 ? bookingsApi : demoBookings);

  // Update bookings if API data loads
  if (bookingsApi && bookingsApi.length > 0 && bookings !== bookingsApi) {
    setBookings(bookingsApi);
  }

  const handleCancel = (id: number) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
  };

  // Helper to show 'Upcoming' for future confirmed bookings
  const getDisplayStatus = (booking: Booking) => {
    if (booking.status === 'confirmed') {
      const today = new Date();
      const bookingDate = new Date(booking.date + 'T' + booking.startTime);
      if (bookingDate > today) return 'Upcoming';
      return 'Confirmed';
    }
    return booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-accent text-black';
      case 'completed': return 'bg-gray-600 text-white';
      case 'cancelled': return 'bg-destructive text-white';
      default: return 'bg-yellow-500 text-black';
    }
  };

  const getWeatherIcon = (temp: number) => {
    if (temp >= 25) return <Sun className="w-4 h-4 text-yellow-400" />;
    if (temp >= 20) return <CloudSun className="w-4 h-4 text-orange-400" />;
    return <Moon className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">My Bookings</h2>
          </motion.div>

          {isLoading && (
            <Card className="glassmorphic border-gray-700">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="text-gray-400">Loading your bookings...</p>
              </CardContent>
            </Card>
          )}

          {!isLoading && bookings && bookings.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Card className="glassmorphic border-gray-700 max-w-md mx-auto">
                <CardContent className="p-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Bookings Yet</h3>
                  <p className="text-gray-400 mb-4">You haven't made any bookings yet. Start by booking a turf!</p>
                  <Button className="bg-accent text-black hover:bg-opacity-80">
                    Book a Turf
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!isLoading && bookings && bookings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="glassmorphic border-gray-700 overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-accent" />
                    Booking History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700">
                          <TableHead className="text-gray-400">Date & Time</TableHead>
                          <TableHead className="text-gray-400">Ground</TableHead>
                          <TableHead className="text-gray-400">Duration</TableHead>
                          <TableHead className="text-gray-400">Status</TableHead>
                          <TableHead className="text-gray-400">Weather</TableHead>
                          <TableHead className="text-gray-400">Price</TableHead>
                          <TableHead className="text-gray-400">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking, index) => (
                          <motion.tr
                            key={booking.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="border-gray-700 hover:bg-gray-800 transition-colors duration-300"
                          >
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
                              <div>
                                <div className="font-medium text-white">{booking.ground?.name}</div>
                                <div className="text-sm text-gray-400 flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {booking.ground?.location}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-white">
                                <Clock className="w-4 h-4 mr-1" />
                                {booking.duration} hrs
                              </div>
                            </TableCell>
                            <TableCell>
                            <Badge className={getStatusColor(booking.status)}>
                              {getDisplayStatus(booking)}
                            </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getWeatherIcon(22)}
                                <span className="text-gray-400">22°C</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-accent">
                                PKR {parseInt(booking.totalPrice).toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              {booking.status === 'confirmed' && (
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  className="hover:bg-opacity-80"
                                  onClick={() => handleCancel(booking.id)}
                                >
                                  Cancel
                                </Button>
                              )}
                              {booking.status === 'completed' && (
                                <Button 
                                  size="sm" 
                                  className="bg-primary text-white hover:bg-opacity-80"
                                >
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  Rebook
                                </Button>
                              )}
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
