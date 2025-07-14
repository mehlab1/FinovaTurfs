import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { TimeSlotPicker } from "@/components/booking/time-slot-picker";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { type Ground } from "@/lib/types";
import { Search, MapPin, Filter, Star, Gamepad2, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function Grounds() {
  const [selectedGroundId, setSelectedGroundId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSport, setSelectedSport] = useState("");

  const { data: grounds, isLoading } = useQuery<Ground[]>({
    queryKey: ['/api/grounds'],
  });

  if (selectedGroundId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <TimeSlotPicker
          groundId={selectedGroundId}
          onBack={() => setSelectedGroundId(null)}
        />
      </div>
    );
  }

  const filteredGrounds = grounds?.filter(ground => {
    const matchesSearch = ground.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ground.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || ground.city === selectedCity;
    const matchesSport = !selectedSport || 
                        selectedSport === "Both" || 
                        ground.sports.includes(selectedSport.toLowerCase());
    
    return matchesSearch && matchesCity && matchesSport;
  });

  const cities = [...new Set(grounds?.map(ground => ground.city) || [])];

  const getSportIcon = (sports: string[]) => {
    if (sports.includes("football") && sports.includes("cricket")) {
      return <><Gamepad2 className="w-4 h-4 text-accent" /><Target className="w-4 h-4 text-accent" /></>;
    } else if (sports.includes("football")) {
      return <Gamepad2 className="w-4 h-4 text-accent" />;
    } else {
      return <Target className="w-4 h-4 text-accent" />;
    }
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
            <h2 className="text-2xl font-bold text-white mb-6">Available Grounds</h2>
            
            {/* Search and Filters */}
            <Card className="glassmorphic border-gray-700 mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search grounds..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700"
                    />
                  </div>
                  
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="pl-10 bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Cities</SelectItem>
                        {cities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                    <Select value={selectedSport} onValueChange={setSelectedSport}>
                      <SelectTrigger className="pl-10 bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Sport Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Sports</SelectItem>
                        <SelectItem value="football">Football</SelectItem>
                        <SelectItem value="cricket">Cricket</SelectItem>
                        <SelectItem value="Both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="glassmorphic border-gray-700 overflow-hidden">
                  <div className="w-full h-48 bg-gray-800 animate-pulse"></div>
                  <CardContent className="p-6 space-y-3">
                    <div className="h-6 bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-800 rounded animate-pulse w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Ground Cards */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGrounds?.map((ground, index) => (
                <motion.div
                  key={ground.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glassmorphic border-gray-700 overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer group">
                    <div className="relative">
                      <img
                        src={ground.imageUrl || "https://images.unsplash.com/photo-1556056504-5c7696c4c28d"}
                        alt={ground.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 flex space-x-1">
                        {getSportIcon(ground.sports)}
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">{ground.name}</h3>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {ground.location}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-accent font-semibold">
                          From PKR {parseInt(ground.basePrice).toLocaleString()}/hr
                        </span>
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm">{ground.rating}</span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => setSelectedGroundId(ground.id)}
                        className="w-full bg-accent text-black font-medium hover:bg-opacity-80 transition-colors duration-300"
                      >
                        View Slots
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && filteredGrounds?.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="glassmorphic border-gray-700 rounded-xl p-8 max-w-md mx-auto">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Grounds Found</h3>
                <p className="text-gray-400">Try adjusting your search criteria</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
