import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/auth";
import { dataService, type TimeSlot } from "@/lib/data";
import { ArrowLeft, Clock, DollarSign, Star, Sun, CloudSun, Moon, CloudRain, Thermometer } from "lucide-react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";

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
    queryKey: ['slots', groundId],
    queryFn: () => dataService.getSlotsByGroundId(groundId),
    enabled: !!groundId,
  });

  // Fetch weather data
  const { data: weatherData } = useQuery({
    queryKey: ['forecast', today],
    queryFn: () => dataService.getWeatherByDate(today),
  });

  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return await dataService.createBooking(bookingData);
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your turf has been successfully booked.",
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
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

  // Get weather icon for a slot: always sun or rain
  const getSlotWeatherIcon = (time: string) => {
    // Deterministically assign sunny or rainy based on slot time
    // (e.g., even slots sunny, odd slots rainy)
    const isRain = time.split(":")[1] === "30";
    return isRain ? <CloudRain className="w-4 h-4 text-blue-500 weather-icon" /> : <Sun className="w-4 h-4 text-yellow-400 weather-icon" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="ghost" onClick={onBack} size="sm" className="text-white hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!slotsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="ghost" onClick={onBack} size="sm" className="text-white hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load slots data</p>
          </div>
        </div>
      </div>
    );
  }

  const { duration, basePrice, total } = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" onClick={onBack} size="sm" className="text-white hover:bg-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{slotsData.ground.name}</h1>
            <p className="text-gray-400">{slotsData.ground.location}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Time Slots */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white text-xl">
                  <Clock className="w-6 h-6" />
                  <span>Available Time Slots</span>
                </CardTitle>
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Low Demand</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>High Demand</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {slotsData.slots.map((slot, index) => {
                    const isSelected = selectedSlots.includes(slot.time);
                    // Always assign a weather icon (sun or rain)
                    const weatherIcon = getSlotWeatherIcon(slot.time);
                    return (
                      <motion.div
                        key={slot.time}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.04, rotateX: 2, rotateY: 2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`perspective-100 ${isSelected ? 'animate-glow' : ''}`}
                      >
                        <div
                          className={`relative w-full h-24 rounded-xl cursor-pointer transform transition-all duration-300 ${
                            isSelected 
                              ? 'bg-gradient-to-br from-accent to-accent/80 text-black shadow-2xl shadow-accent/50 scale-105' 
                              : slot.demand === 'high'
                                ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-2 border-orange-500 hover:border-orange-400'
                                : 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-500 hover:border-green-400'
                          } hover:shadow-xl hover:shadow-accent/25 backdrop-blur-sm`}
                          onClick={() => toggleSlot(slot.time)}
                        >
                          {/* Weather Icon */}
                          <div className="absolute top-2 right-2">
                            {weatherIcon}
                          </div>
                          {/* Time */}
                          <div className="absolute top-2 left-2">
                            <span className="text-sm font-bold">{slot.time}</span>
                          </div>
                          {/* Price */}
                          <div className="absolute bottom-2 left-2 flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span className="text-xs font-semibold">{slot.price}</span>
                          </div>
                          {/* Demand Badge */}
                          <div className="absolute bottom-2 right-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                slot.demand === 'high' 
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-green-500 text-white'
                              }`}
                            >
                              {slot.demand === 'high' ? 'HIGH' : 'LOW'}
                            </Badge>
                          </div>
                          {/* Glow effect for selected slots */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-accent/20 rounded-xl animate-pulse"></div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            {/* Weather */}
            {weatherData && (
              <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Sun className="w-5 h-5" />
                    <span>Weather Forecast</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weatherData.hourlyData.slice(0, 6).map((hour) => (
                      <div key={hour.time} className="flex items-center justify-between p-2 rounded-lg bg-gray-700/50">
                        <span className="text-sm text-gray-300">{hour.time}</span>
                        <div className="flex items-center space-x-2">
                          {/* Always show sun icon for forecast */}
                          <Sun className="w-3 h-3 text-yellow-400" />
                          <span className="text-sm text-white font-medium">{hour.temp}°C</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Booking Summary */}
            <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between p-2 rounded-lg bg-gray-700/50">
                    <span className="text-gray-300">Duration:</span>
                    <span className="text-white font-medium">{duration} hours</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-gray-700/50">
                    <span className="text-gray-300">Base Price:</span>
                    <span className="text-white font-medium">PKR {basePrice}</span>
                  </div>
                  {useLoyalty && user && (
                    <div className="flex justify-between p-2 rounded-lg bg-green-500/50 border border-green-500/50">
                      <span className="text-green-400">Loyalty Discount:</span>
                      <span className="text-green-400 font-medium">-PKR {Math.min(50, user.loyaltyPoints)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between p-2 rounded-lg bg-accent/20 border border-accent/50">
                      <span className="text-white font-bold">Total:</span>
                      <span className="text-accent font-bold text-lg">PKR {total}</span>
                    </div>
                  </div>
                </div>

                {user && user.loyaltyPoints > 0 && (
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/50">
                    <Switch
                      id="loyalty"
                      checked={useLoyalty}
                      onCheckedChange={setUseLoyalty}
                    />
                    <Label htmlFor="loyalty" className="text-gray-300 text-sm">
                      Use loyalty points (PKR {Math.min(50, user.loyaltyPoints)} off)
                    </Label>
                  </div>
                )}

                <Button
                  className="w-full bg-accent text-black font-bold text-lg py-3 hover:bg-accent/80 transition-all duration-300 shadow-lg"
                  onClick={handleConfirmBooking}
                  disabled={selectedSlots.length === 0 || bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? "Confirming..." : "Confirm Booking"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
