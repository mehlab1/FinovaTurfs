import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  TrendingUp, 
  Trophy, 
  Calendar,
  Search,
  Filter,
  Download,
  Star,
  Crown,
  Medal
} from "lucide-react";
import { motion } from "framer-motion";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  totalBookings: number;
  totalSpent: number;
  loyaltyPoints: number;
  tier: string;
  lastBooking: string;
  favoriteGround: string;
  joinDate: string;
}

export default function AdminTeams() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("totalSpent");
  const [tierFilter, setTierFilter] = useState("all");

  const { data: bookings } = useQuery({
    queryKey: ['/api/admin/bookings'],
  });

  // Mock team data based on bookings
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Ahmed Khan",
      email: "ahmed@example.com",
      totalBookings: 45,
      totalSpent: 87500,
      loyaltyPoints: 8750,
      tier: "Platinum",
      lastBooking: "2024-01-15",
      favoriteGround: "Victory Sports Complex",
      joinDate: "2023-03-15"
    },
    {
      id: 2,
      name: "Sarah Ahmed",
      email: "sarah@example.com",
      totalBookings: 32,
      totalSpent: 64200,
      loyaltyPoints: 6420,
      tier: "Gold",
      lastBooking: "2024-01-14",
      favoriteGround: "Elite Football Arena",
      joinDate: "2023-05-20"
    },
    {
      id: 3,
      name: "Ali Hassan",
      email: "ali@example.com",
      totalBookings: 28,
      totalSpent: 58900,
      loyaltyPoints: 5890,
      tier: "Gold",
      lastBooking: "2024-01-13",
      favoriteGround: "Victory Sports Complex",
      joinDate: "2023-04-10"
    },
    {
      id: 4,
      name: "Fatima Shah",
      email: "fatima@example.com",
      totalBookings: 24,
      totalSpent: 45600,
      loyaltyPoints: 4560,
      tier: "Gold",
      lastBooking: "2024-01-12",
      favoriteGround: "Champions Cricket Ground",
      joinDate: "2023-06-05"
    },
    {
      id: 5,
      name: "Omar Malik",
      email: "omar@example.com",
      totalBookings: 18,
      totalSpent: 32100,
      loyaltyPoints: 3210,
      tier: "Silver",
      lastBooking: "2024-01-11",
      favoriteGround: "Elite Football Arena",
      joinDate: "2023-07-22"
    }
  ];

  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'diamond': return Crown;
      case 'platinum': return Trophy;
      case 'gold': return Medal;
      case 'silver': return Star;
      default: return Users;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'diamond': return 'text-blue-400';
      case 'platinum': return 'text-purple-400';
      case 'gold': return 'text-yellow-400';
      case 'silver': return 'text-gray-400';
      default: return 'text-gray-500';
    }
  };

  const filteredMembers = teamMembers
    .filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = !tierFilter || tierFilter === 'all' || member.tier.toLowerCase() === tierFilter.toLowerCase();
      return matchesSearch && matchesTier;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'totalSpent': return b.totalSpent - a.totalSpent;
        case 'totalBookings': return b.totalBookings - a.totalBookings;
        case 'loyaltyPoints': return b.loyaltyPoints - a.loyaltyPoints;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const topPerformers = teamMembers.slice(0, 3);
  const totalRevenue = teamMembers.reduce((sum, member) => sum + member.totalSpent, 0);
  const totalBookings = teamMembers.reduce((sum, member) => sum + member.totalBookings, 0);
  const averageSpending = totalRevenue / teamMembers.length;

  const stats = [
    {
      title: "Total Revenue",
      value: `PKR ${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "from-accent to-green-600"
    },
    {
      title: "Total Users",
      value: teamMembers.length,
      icon: Users,
      color: "from-primary to-blue-600"
    },
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: Calendar,
      color: "from-yellow-500 to-orange-600"
    },
    {
      title: "Avg. Spending",
      value: `PKR ${Math.round(averageSpending).toLocaleString()}`,
      icon: Trophy,
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
          <h1 className="text-3xl font-bold text-white mb-2">Team Tracker</h1>
          <p className="text-gray-400">Track top users by usage and spending patterns</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Top Performers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="glassmorphic border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-accent" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((member, index) => {
                    const TierIcon = getTierIcon(member.tier);
                    return (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center space-x-3 p-4 bg-gray-800 bg-opacity-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="relative">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            {index === 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                                <Crown className="w-3 h-3 text-black" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-white">{member.name}</div>
                            <div className="text-sm text-gray-400">
                              PKR {member.totalSpent.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <TierIcon className={`w-5 h-5 ${getTierColor(member.tier)}`} />
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glassmorphic border-gray-700 mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-accent text-black hover:bg-opacity-80">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="w-full border-gray-700">
                  Send Rewards
                </Button>
                <Button variant="outline" className="w-full border-gray-700">
                  Create Campaign
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Team Members Table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-3"
          >
            <Card className="glassmorphic border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-accent" />
                    All Team Members
                  </div>
                  <Badge variant="secondary">{filteredMembers.length} members</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700"
                    />
                  </div>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="totalSpent">Total Spent</SelectItem>
                      <SelectItem value="totalBookings">Total Bookings</SelectItem>
                      <SelectItem value="loyaltyPoints">Loyalty Points</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Filter by tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="diamond">Diamond</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="bronze">Bronze</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-400">Member</TableHead>
                        <TableHead className="text-gray-400">Tier</TableHead>
                        <TableHead className="text-gray-400">Bookings</TableHead>
                        <TableHead className="text-gray-400">Total Spent</TableHead>
                        <TableHead className="text-gray-400">Points</TableHead>
                        <TableHead className="text-gray-400">Favorite Ground</TableHead>
                        <TableHead className="text-gray-400">Last Booking</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.map((member, index) => {
                        const TierIcon = getTierIcon(member.tier);
                        return (
                          <motion.tr
                            key={member.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="border-gray-700 hover:bg-gray-800 transition-colors duration-300"
                          >
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-white">{member.name}</div>
                                  <div className="text-sm text-gray-400">{member.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <TierIcon className={`w-4 h-4 ${getTierColor(member.tier)}`} />
                                <span className="text-white">{member.tier}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-white font-medium">{member.totalBookings}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-accent font-medium">PKR {member.totalSpent.toLocaleString()}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-white">{member.loyaltyPoints.toLocaleString()}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-gray-400">{member.favoriteGround}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-gray-400">
                                {new Date(member.lastBooking).toLocaleDateString()}
                              </span>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {filteredMembers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No members found</h3>
                    <p className="text-gray-400">Try adjusting your search criteria</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
