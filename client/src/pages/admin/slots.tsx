import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Settings,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { dataService } from "@/lib/data";

export default function AdminSlots() {
  const [selectedGround, setSelectedGround] = useState<string>("");
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [newSlotData, setNewSlotData] = useState({
    groundId: "",
    timeSlot: "",
    demand: "low",
    multiplier: "1.0"
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: grounds } = useQuery({
    queryKey: ['grounds'],
    queryFn: () => dataService.getAllGrounds(),
  });
  const { data: slotsDataRaw, isLoading } = useQuery({
    queryKey: ['slots', selectedGround],
    queryFn: () => selectedGround ? dataService.getSlotsByGroundId(parseInt(selectedGround)) : null,
    enabled: !!selectedGround,
  });
  const slotsData = slotsDataRaw && typeof slotsDataRaw === 'object' && Array.isArray(slotsDataRaw.slots)
    ? slotsDataRaw as { slots: any[] }
    : { slots: [] };
  const slotsList = slotsData.slots;

  const groundsList = Array.isArray(grounds) ? grounds : [];

  const createSlotMutation = useMutation({
    mutationFn: async (slotData: any) => {
      const response = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slotData),
      });
      if (!response.ok) throw new Error('Failed to create slot');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Slot created successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/slots'] });
      setNewSlotData({ groundId: "", timeSlot: "", demand: "low", multiplier: "1.0" });
    },
    onError: () => {
      toast({ title: "Failed to create slot", variant: "destructive" });
    },
  });

  const updateSlotMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await fetch(`/api/admin/slots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update slot');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Slot updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/slots'] });
      setEditingSlot(null);
    },
    onError: () => {
      toast({ title: "Failed to update slot", variant: "destructive" });
    },
  });

  const deleteSlotMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/slots/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete slot');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Slot deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/slots'] });
    },
    onError: () => {
      toast({ title: "Failed to delete slot", variant: "destructive" });
    },
  });

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour <= 23; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    slots.push("00:00");
    slots.push("00:30");
    return slots;
  };

  const handleCreateSlot = () => {
    if (!newSlotData.groundId || !newSlotData.timeSlot) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    createSlotMutation.mutate(newSlotData);
  };

  const handleUpdateSlot = (slotId: string, updatedData: any) => {
    updateSlotMutation.mutate({ id: slotId, ...updatedData });
  };

  const getDemandColor = (demand: string) => {
    return demand === 'high' ? 'bg-red-500' : 'bg-green-500';
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
          <h1 className="text-3xl font-bold text-white mb-2">Slot & Schedule Manager</h1>
          <p className="text-gray-400">Manage time slots, pricing, and availability</p>
        </motion.div>

        {/* Ground Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <Card className="glassmorphic border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-accent" />
                Ground Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ground-select">Select Ground</Label>
                  <Select value={selectedGround} onValueChange={setSelectedGround}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Choose a ground" />
                    </SelectTrigger>
                    <SelectContent>
                      {groundsList.map((ground: any) => (
                        <SelectItem key={ground.id} value={ground.id.toString()}>
                          {ground.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add New Slot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <Card className="glassmorphic border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2 text-accent" />
                Add New Slot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="new-ground">Ground</Label>
                  <Select 
                    value={newSlotData.groundId} 
                    onValueChange={(value) => setNewSlotData(prev => ({ ...prev, groundId: value }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select ground" />
                    </SelectTrigger>
                    <SelectContent>
                      {groundsList.map((ground: any) => (
                        <SelectItem key={ground.id} value={ground.id.toString()}>
                          {ground.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="new-time">Time Slot</Label>
                  <Select 
                    value={newSlotData.timeSlot} 
                    onValueChange={(value) => setNewSlotData(prev => ({ ...prev, timeSlot: value }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateTimeSlots().map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="new-demand">Demand Level</Label>
                  <Select 
                    value={newSlotData.demand} 
                    onValueChange={(value) => setNewSlotData(prev => ({ ...prev, demand: value }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="new-multiplier">Price Multiplier</Label>
                  <Input
                    value={newSlotData.multiplier}
                    onChange={(e) => setNewSlotData(prev => ({ ...prev, multiplier: e.target.value }))}
                    placeholder="1.0"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
              <Button 
                onClick={handleCreateSlot}
                disabled={createSlotMutation.isPending}
                className="mt-4 bg-accent text-black hover:bg-opacity-80"
              >
                <Plus className="w-4 h-4 mr-2" />
                {createSlotMutation.isPending ? "Creating..." : "Add Slot"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Existing Slots */}
        {selectedGround && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glassmorphic border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-accent" />
                    Current Slots
                  </div>
                  <Badge variant="secondary">
                    {slotsList.length || 0} slots
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-800 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : slotsList.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No slots configured for this ground</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {slotsList.map((slot: any, index: number) => (
                      <motion.div
                        key={`${slot.time}-${index}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="glassmorphic p-4 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-white text-lg">{slot.time}</span>
                          <Badge className={`${getDemandColor(slot.demand)} text-white`}>
                            {slot.demand}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-gray-400">
                          <div className="flex justify-between">
                            <span>Price:</span>
                            <span className="text-accent font-medium">PKR {slot.price?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Multiplier:</span>
                            <span className="text-white">{slot.multiplier || "1.0"}x</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <Switch 
                            checked={slot.available !== false}
                            onCheckedChange={(checked) => {
                              handleUpdateSlot(slot.id, { available: checked });
                            }}
                          />
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingSlot(slot.id)}
                              className="text-gray-400 hover:text-accent"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteSlotMutation.mutate(slot.id)}
                              className="text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
