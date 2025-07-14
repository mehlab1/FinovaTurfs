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

export default function Bookings() {
  const user = auth.getUser();

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
    queryFn: async () => {
      const response = await fetch(`/api/bookings?userId=${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    },
    enabled: !!user,
  });

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
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
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
                              {booking.status === 'confirmed' || booking.status === 'completed' ? (
                                <Button 
                                  size="sm" 
                                  className="bg-primary text-white hover:bg-opacity-80"
                                >
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  Rebook
                                </Button>
                              ) : booking.status === 'upcoming' ? (
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  className="hover:bg-opacity-80"
                                >
                                  Cancel
                                </Button>
                              ) : null}
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
