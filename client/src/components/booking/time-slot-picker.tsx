import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/auth";
import { type Ground, type TimeSlot, type WeatherHour } from "@/lib/types";
import { ArrowLeft, Sun, CloudSun, Moon, Thermometer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeSlotPickerProps {
  groundId: number;
  onBack: () => void;
}

export function TimeSlotPicker({ groundId, onBack }: TimeSlotPickerProps) {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [useLoyalty, setUseLoyalty] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = auth.getUser();

  const today = new Date().toISOString().split('T')[0];

  // Fetch slots data
  const { data: slotsData, isLoading } = useQuery({
    queryKey: ['/api/slots', groundId],
    enabled: !!groundId,
  });

  // Fetch weather data
  const { data: weatherData } = useQuery({
    queryKey: ['/api/forecast', today],
  });

  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create booking');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your turf has been successfully booked.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      setSelectedSlots([]);
      onBack();
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleSlot = (time: string) => {
    setSelectedSlots(prev => {
      if (prev.includes(time)) {
        return prev.filter(slot => slot !== time);
      } else {
        return [...prev, time].sort();
      }
    });
  };

  const calculateTotals = () => {
    if (!slotsData) return { duration: 0, basePrice: 0, total: 0 };
    
    const duration = selectedSlots.length * 0.5; // 30 minutes per slot
    let basePrice = 0;
    
    selectedSlots.forEach(time => {
      const slot = slotsData.slots.find((s: TimeSlot) => s.time === time);
      if (slot) {
        basePrice += slot.price;
      }
    });
    
    const loyaltyDiscount = useLoyalty && user ? Math.min(50, user.loyaltyPoints) : 0;
    const total = basePrice - loyaltyDiscount;
    
    return { duration, basePrice, total };
  };

  const handleConfirmBooking = () => {
    if (!user || selectedSlots.length === 0 || !slotsData) return;
    
    const { total } = calculateTotals();
    const startTime = selectedSlots[0];
    const endTime = selectedSlots[selectedSlots.length - 1];
    
    // Calculate end time by adding 30 minutes to the last slot
    const [hours, minutes] = endTime.split(':').map(Number);
    const endHours = minutes === 30 ? hours + 1 : hours;
    const endMinutes = minutes === 30 ? 0 : 30;
    const calculatedEndTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    
    bookingMutation.mutate({
      userId: user.id,
      groundId,
      date: today,
      startTime,
      endTime: calculatedEndTime,
      duration: (selectedSlots.length * 0.5).toString(),
      totalPrice: total.toString(),
      usedLoyaltyPoints: useLoyalty,
      status: 'confirmed',
    });
  };

  const getWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case 'sun': return <Sun className="w-4 h-4 text-yellow-400 weather-icon" />;
      case 'cloud-sun': return <CloudSun className="w-4 h-4 text-orange-400 weather-icon" />;
      case 'moon': return <Moon className="w-4 h-4 text-blue-400 weather-icon" />;
      default: return <Sun className="w-4 h-4 text-yellow-400 weather-icon" />;
    }
  };

  const getWeatherForSlot = (time: string): WeatherHour | null => {
    if (!weatherData?.hourlyData) return null;
    return weatherData.hourlyData.find((hour: WeatherHour) => hour.time === time) || null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
          <p className="mt-4 text-gray-400">Loading slots...</p>
        </div>
      </div>
    );
  }

  if (!slotsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Failed to load slots data</p>
      </div>
    );
  }

  const { duration, basePrice, total } = calculateTotals();

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-accent hover:text-white transition-colors duration-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Grounds
          </Button>
          <h2 className="text-2xl font-bold text-white mb-2">Select Time Slots</h2>
          <p className="text-gray-400">{slotsData.ground.name} - Today, {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Time Slots */}
          <div className="lg:col-span-2">
            <Card className="glassmorphic border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Available Slots</span>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-400">Low Demand</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-400">High Demand</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {slotsData.slots.map((slot: TimeSlot, index: number) => {
                      const weather = getWeatherForSlot(slot.time);
                      const isSelected = selectedSlots.includes(slot.time);
                      
                      return (
                        <motion.div
                          key={slot.time}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`
                            slot-card glassmorphic p-4 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105
                            ${slot.demand === 'high' ? 'demand-high' : 'demand-low'}
                            ${isSelected ? 'slot-selected' : ''}
                          `}
                          onClick={() => toggleSlot(slot.time)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{slot.time}</span>
                            {weather && getWeatherIcon(weather.icon)}
                          </div>
                          {weather && (
                            <div className="flex items-center text-sm text-gray-400 mb-2">
                              <Thermometer className="w-3 h-3 mr-1" />
                              {weather.temp}°C
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-accent text-sm font-medium">
                              PKR {slot.price.toLocaleString()}
                            </span>
                            <Badge variant={slot.demand === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                              {slot.demand === 'high' ? 'High' : 'Low'}
                            </Badge>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="glassmorphic border-gray-700 sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Selected Slots</span>
                    <span className="text-white font-medium">{selectedSlots.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white font-medium">{duration} hrs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Base Price</span>
                    <span className="text-white font-medium">PKR {basePrice.toLocaleString()}</span>
                  </div>
                  <hr className="border-gray-700" />
                </div>

                {/* Loyalty Points Toggle */}
                {user && user.loyaltyPoints > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Use Loyalty Points</span>
                      <Switch checked={useLoyalty} onCheckedChange={setUseLoyalty} />
                    </div>
                    <p className="text-sm text-gray-400">
                      Save PKR 50 ({Math.min(50, user.loyaltyPoints)} points available)
                    </p>
                  </div>
                )}

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-accent">PKR {total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handleConfirmBooking}
                  disabled={selectedSlots.length === 0 || bookingMutation.isPending}
                  className="w-full bg-gradient-to-r from-accent to-primary text-white font-medium"
                >
                  {bookingMutation.isPending ? "Booking..." : "Confirm Booking"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
