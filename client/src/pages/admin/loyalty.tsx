import { useState } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Gift, 
  Star, 
  TrendingUp, 
  Users, 
  Award,
  Plus,
  Edit,
  Save,
  Crown,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
  color: string;
  active: boolean;
}

interface LoyaltyProgram {
  earnRate: number; // points per PKR spent
  redemptionRate: number; // PKR value per point
  bonusMultipliers: {
    weekend: number;
    peak: number;
    group: number;
  };
  freeHourThresholds: number[];
}

export default function AdminLoyalty() {
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [programSettings, setProgramSettings] = useState<LoyaltyProgram>({
    earnRate: 1, // 1 point per PKR 100
    redemptionRate: 1, // 1 point = PKR 1
    bonusMultipliers: {
      weekend: 1.5,
      peak: 2.0,
      group: 1.2
    },
    freeHourThresholds: [1000, 2500, 5000]
  });

  const { toast } = useToast();

  const loyaltyTiers: LoyaltyTier[] = [
    {
      id: "bronze",
      name: "Bronze",
      minPoints: 0,
      maxPoints: 499,
      benefits: ["Earn 1 point per PKR 100", "Birthday bonus", "Email notifications"],
      color: "from-orange-600 to-orange-400",
      active: true
    },
    {
      id: "silver",
      name: "Silver",
      minPoints: 500,
      maxPoints: 1499,
      benefits: ["Earn 1.2x points", "10% off merchandise", "Priority booking", "Monthly free drink"],
      color: "from-gray-400 to-gray-300",
      active: true
    },
    {
      id: "gold",
      name: "Gold",
      minPoints: 1500,
      maxPoints: 4999,
      benefits: ["Earn 1.5x points", "15% off all bookings", "Free equipment rental", "Quarterly free hour"],
      color: "from-yellow-400 to-yellow-300",
      active: true
    },
    {
      id: "platinum",
      name: "Platinum",
      minPoints: 5000,
      maxPoints: 9999,
      benefits: ["Earn 2x points", "20% off all bookings", "VIP customer support", "Monthly free 2 hours"],
      color: "from-purple-400 to-purple-300",
      active: true
    },
    {
      id: "diamond",
      name: "Diamond",
      minPoints: 10000,
      maxPoints: 999999,
      benefits: ["Earn 3x points", "25% off all bookings", "Personal concierge", "Weekly free hours", "Exclusive events"],
      color: "from-blue-400 to-cyan-300",
      active: true
    }
  ];

  const topMembers = [
    { id: 1, name: "Ahmed Khan", points: 8750, tier: "Platinum", spent: "PKR 87,500", bookings: 45 },
    { id: 2, name: "Sarah Ahmed", points: 6420, tier: "Gold", spent: "PKR 64,200", bookings: 32 },
    { id: 3, name: "Ali Hassan", points: 5890, tier: "Gold", spent: "PKR 58,900", bookings: 28 },
    { id: 4, name: "Fatima Shah", points: 4560, tier: "Gold", spent: "PKR 45,600", bookings: 24 },
    { id: 5, name: "Omar Malik", points: 3210, tier: "Silver", spent: "PKR 32,100", bookings: 18 },
  ];

  const handleSaveSettings = () => {
    toast({
      title: "Settings Updated",
      description: "Loyalty program settings have been saved successfully."
    });
  };

  const getTierIcon = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'diamond': return Crown;
      case 'platinum': return Award;
      case 'gold': return Star;
      case 'silver': return Zap;
      default: return Gift;
    }
  };

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
          <h1 className="text-3xl font-bold text-white mb-2">Loyalty Program Configuration</h1>
          <p className="text-gray-400">Manage loyalty tiers, points, and rewards</p>
        </motion.div>

        {/* Program Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glassmorphic border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="w-5 h-5 mr-2 text-accent" />
                Program Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <Label htmlFor="earn-rate">Earn Rate (points per PKR 100)</Label>
                  <Input
                    id="earn-rate"
                    type="number"
                    step="0.1"
                    value={programSettings.earnRate}
                    onChange={(e) => setProgramSettings(prev => ({ ...prev, earnRate: parseFloat(e.target.value) }))}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="redemption-rate">Redemption Rate (PKR per point)</Label>
                  <Input
                    id="redemption-rate"
                    type="number"
                    step="0.1"
                    value={programSettings.redemptionRate}
                    onChange={(e) => setProgramSettings(prev => ({ ...prev, redemptionRate: parseFloat(e.target.value) }))}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="weekend-bonus">Weekend Bonus Multiplier</Label>
                  <Input
                    id="weekend-bonus"
                    type="number"
                    step="0.1"
                    value={programSettings.bonusMultipliers.weekend}
                    onChange={(e) => setProgramSettings(prev => ({ 
                      ...prev, 
                      bonusMultipliers: { ...prev.bonusMultipliers, weekend: parseFloat(e.target.value) }
                    }))}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="peak-bonus">Peak Hours Bonus</Label>
                  <Input
                    id="peak-bonus"
                    type="number"
                    step="0.1"
                    value={programSettings.bonusMultipliers.peak}
                    onChange={(e) => setProgramSettings(prev => ({ 
                      ...prev, 
                      bonusMultipliers: { ...prev.bonusMultipliers, peak: parseFloat(e.target.value) }
                    }))}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
              <Button onClick={handleSaveSettings} className="mt-6 bg-accent text-black hover:bg-opacity-80">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Loyalty Tiers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="glassmorphic border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-accent" />
                    Loyalty Tiers
                  </div>
                  <Button size="sm" className="bg-accent text-black hover:bg-opacity-80">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tier
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loyaltyTiers.map((tier, index) => {
                    const TierIcon = getTierIcon(tier.name);
                    return (
                      <motion.div
                        key={tier.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="glassmorphic p-6 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-full bg-gradient-to-r ${tier.color} bg-opacity-20`}>
                              <TierIcon className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                              <p className="text-sm text-gray-400">
                                {tier.minPoints} - {tier.maxPoints === 999999 ? '∞' : tier.maxPoints} points
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch checked={tier.active} />
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-accent">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-white mb-2">Benefits</h4>
                            <ul className="space-y-1">
                              {tier.benefits.map((benefit, idx) => (
                                <li key={idx} className="text-sm text-gray-400 flex items-center">
                                  <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></div>
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400 mb-1">Current Members</div>
                            <div className="text-2xl font-bold text-accent">
                              {Math.floor(Math.random() * 200) + 50}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Members */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="glassmorphic border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-accent" />
                  Top Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-accent bg-opacity-20 rounded-full flex items-center justify-center">
                          <span className="text-accent font-bold text-sm">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{member.name}</div>
                          <div className="text-sm text-gray-400">{member.points} points</div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {member.tier}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
                
                <Separator className="my-4 bg-gray-700" />
                
                <div className="text-center">
                  <Button variant="outline" className="w-full border-gray-700">
                    View All Members
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glassmorphic border-gray-700 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-accent" />
                  Program Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Members</span>
                    <span className="text-white font-medium">1,234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Points Earned (Month)</span>
                    <span className="text-accent font-medium">45,678</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Points Redeemed</span>
                    <span className="text-accent font-medium">12,345</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Average Tier</span>
                    <span className="text-white font-medium">Silver</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
