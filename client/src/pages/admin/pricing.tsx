import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Edit, 
  Save, 
  X,
  Plus,
  Calendar,
  Sun,
  CloudRain
} from "lucide-react";
import { motion } from "framer-motion";

interface PricingRule {
  id: string;
  condition: string;
  multiplier: number;
  description: string;
  active: boolean;
}

export default function AdminPricing() {
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [newRule, setNewRule] = useState({
    condition: "",
    multiplier: 1.0,
    description: "",
    active: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock pricing rules data
  const pricingRules: PricingRule[] = [
    {
      id: "1",
      condition: "peak_hours",
      multiplier: 1.3,
      description: "Peak hours (6-8 PM)",
      active: true
    },
    {
      id: "2", 
      condition: "weekend",
      multiplier: 1.2,
      description: "Weekend premium",
      active: true
    },
    {
      id: "3",
      condition: "weather_perfect",
      multiplier: 1.1,
      description: "Perfect weather conditions",
      active: true
    },
    {
      id: "4",
      condition: "high_demand",
      multiplier: 1.4,
      description: "High demand periods",
      active: true
    },
    {
      id: "5",
      condition: "early_morning",
      multiplier: 0.8,
      description: "Early morning discount (6-10 AM)",
      active: true
    },
    {
      id: "6",
      condition: "late_night",
      multiplier: 0.9,
      description: "Late night discount (10 PM-1 AM)",
      active: true
    }
  ];

  const { data: grounds } = useQuery({
    queryKey: ['/api/grounds'],
  });

  const updatePricingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update pricing');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Pricing updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pricing'] });
      setEditingRule(null);
    },
    onError: () => {
      toast({ title: "Failed to update pricing", variant: "destructive" });
    },
  });

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'peak_hours':
      case 'high_demand':
        return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'weekend':
        return <Calendar className="w-4 h-4 text-yellow-400" />;
      case 'weather_perfect':
        return <Sun className="w-4 h-4 text-yellow-400" />;
      case 'early_morning':
      case 'late_night':
        return <TrendingDown className="w-4 h-4 text-green-400" />;
      default:
        return <DollarSign className="w-4 h-4 text-accent" />;
    }
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier > 1.2) return 'text-red-400';
    if (multiplier > 1.0) return 'text-yellow-400';
    return 'text-green-400';
  };

  const handleSaveRule = (ruleId: string, data: any) => {
    updatePricingMutation.mutate({ ruleId, ...data });
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
          <h1 className="text-3xl font-bold text-white mb-2">Pricing Manager</h1>
          <p className="text-gray-400">Configure dynamic pricing rules and multipliers</p>
        </motion.div>

        {/* Pricing Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glassmorphic border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-accent bg-opacity-20">
                    <DollarSign className="w-6 h-6 text-accent" />
                  </div>
                  <Badge className="bg-green-500 text-white">+15%</Badge>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">PKR 2,200</h3>
                <p className="text-gray-400 text-sm">Average Hourly Rate</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glassmorphic border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-red-500 bg-opacity-20">
                    <TrendingUp className="w-6 h-6 text-red-400" />
                  </div>
                  <Badge className="bg-red-500 text-white">Peak</Badge>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">PKR 3,200</h3>
                <p className="text-gray-400 text-sm">Peak Hour Rate</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glassmorphic border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-green-500 bg-opacity-20">
                    <TrendingDown className="w-6 h-6 text-green-400" />
                  </div>
                  <Badge className="bg-green-500 text-white">Off-Peak</Badge>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">PKR 1,600</h3>
                <p className="text-gray-400 text-sm">Off-Peak Rate</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Base Pricing by Ground */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <Card className="glassmorphic border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-accent" />
                Base Pricing by Ground
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grounds?.map((ground: any, index: number) => (
                  <motion.div
                    key={ground.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="glassmorphic p-4 rounded-lg border border-gray-700"
                  >
                    <h3 className="font-semibold text-white mb-2">{ground.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{ground.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-accent font-bold text-lg">
                        PKR {parseInt(ground.basePrice).toLocaleString()}/hr
                      </span>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-accent">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pricing Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glassmorphic border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-accent" />
                  Dynamic Pricing Rules
                </div>
                <Button className="bg-accent text-black hover:bg-opacity-80">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-400">Condition</TableHead>
                      <TableHead className="text-gray-400">Description</TableHead>
                      <TableHead className="text-gray-400">Multiplier</TableHead>
                      <TableHead className="text-gray-400">Impact</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pricingRules.map((rule, index) => (
                      <motion.tr
                        key={rule.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border-gray-700 hover:bg-gray-800 transition-colors duration-300"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getConditionIcon(rule.condition)}
                            <span className="font-medium text-white capitalize">
                              {rule.condition.replace('_', ' ')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-400">{rule.description}</span>
                        </TableCell>
                        <TableCell>
                          {editingRule === rule.id ? (
                            <Input
                              type="number"
                              step="0.1"
                              defaultValue={rule.multiplier}
                              className="w-20 bg-gray-800 border-gray-700"
                            />
                          ) : (
                            <span className={`font-bold ${getMultiplierColor(rule.multiplier)}`}>
                              {rule.multiplier}x
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={getMultiplierColor(rule.multiplier)}>
                            {rule.multiplier > 1 ? '+' : ''}{((rule.multiplier - 1) * 100).toFixed(0)}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={rule.active ? "default" : "secondary"} className={rule.active ? "bg-accent text-black" : ""}>
                            {rule.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {editingRule === rule.id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveRule(rule.id, {})}
                                  className="bg-accent text-black hover:bg-opacity-80"
                                >
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingRule(null)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingRule(rule.id)}
                                className="text-gray-400 hover:text-accent"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
