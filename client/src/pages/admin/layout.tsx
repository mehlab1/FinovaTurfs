import { useState } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DraftingCompass, 
  Move, 
  RotateCcw, 
  Save, 
  Download,
  Upload,
  Grid,
  Circle,
  Square,
  Triangle,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

interface LayoutElement {
  id: string;
  type: 'goal' | 'center_circle' | 'penalty_area' | 'corner' | 'boundary';
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
}

export default function AdminLayout() {
  const [selectedGround, setSelectedGround] = useState<string>("");
  const [selectedTool, setSelectedTool] = useState<string>("move");
  const [layoutElements, setLayoutElements] = useState<LayoutElement[]>([
    { id: 'goal-1', type: 'goal', x: 50, y: 10, width: 30, height: 8 },
    { id: 'goal-2', type: 'goal', x: 50, y: 82, width: 30, height: 8 },
    { id: 'center', type: 'center_circle', x: 50, y: 45, width: 20, height: 20 },
    { id: 'penalty-1', type: 'penalty_area', x: 30, y: 5, width: 40, height: 20 },
    { id: 'penalty-2', type: 'penalty_area', x: 30, y: 75, width: 40, height: 20 },
  ]);

  const tools = [
    { id: 'move', name: 'Move', icon: Move },
    { id: 'rotate', name: 'Rotate', icon: RotateCcw },
    { id: 'goal', name: 'Goal', icon: Square },
    { id: 'circle', name: 'Circle', icon: Circle },
    { id: 'area', name: 'Area', icon: Square },
  ];

  const grounds = [
    { id: '1', name: 'Victory Sports Complex' },
    { id: '2', name: 'Elite Football Arena' },
    { id: '3', name: 'Champions Cricket Ground' },
  ];

  const renderLayoutElement = (element: LayoutElement) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${element.x}%`,
      top: `${element.y}%`,
      transform: `translate(-50%, -50%) rotate(${element.rotation || 0}deg)`,
      cursor: selectedTool === 'move' ? 'move' : 'pointer',
    };

    switch (element.type) {
      case 'goal':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              width: `${element.width}%`,
              height: `${element.height}%`,
              border: '3px solid #10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
            }}
            className="hover:bg-opacity-20 transition-colors duration-200"
          />
        );
      case 'center_circle':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              width: `${element.width}%`,
              height: `${element.height}%`,
              border: '2px solid #3B82F6',
              borderRadius: '50%',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
            }}
            className="hover:bg-opacity-20 transition-colors duration-200"
          />
        );
      case 'penalty_area':
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              width: `${element.width}%`,
              height: `${element.height}%`,
              border: '2px solid #F59E0B',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
            }}
            className="hover:bg-opacity-20 transition-colors duration-200"
          />
        );
      default:
        return null;
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
          <h1 className="text-3xl font-bold text-white mb-2">Ground Layout Designer</h1>
          <p className="text-gray-400">Design and customize ground layouts for different sports</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="glassmorphic border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DraftingCompass className="w-5 h-5 mr-2 text-accent" />
                  Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedTool(tool.id)}
                  >
                    <tool.icon className="w-4 h-4 mr-2" />
                    {tool.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="glassmorphic border-gray-700 mb-6">
              <CardHeader>
                <CardTitle>Ground Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedGround} onValueChange={setSelectedGround}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select ground" />
                  </SelectTrigger>
                  <SelectContent>
                    {grounds.map((ground) => (
                      <SelectItem key={ground.id} value={ground.id}>
                        {ground.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="glassmorphic border-gray-700">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-accent text-black hover:bg-opacity-80">
                  <Save className="w-4 h-4 mr-2" />
                  Save Layout
                </Button>
                <Button variant="outline" className="w-full border-gray-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" className="w-full border-gray-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Canvas Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="glassmorphic border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Grid className="w-5 h-5 mr-2 text-accent" />
                    Design Canvas
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Football Field</Badge>
                    <Badge className="bg-accent text-black">100m x 60m</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-96 bg-green-900 bg-opacity-30 border-2 border-green-600 rounded-lg overflow-hidden">
                  {/* Field markings */}
                  <div className="absolute inset-0 bg-gradient-to-b from-green-800 to-green-900 opacity-20"></div>
                  
                  {/* Center line */}
                  <div 
                    className="absolute left-0 right-0 border-t-2 border-white opacity-30"
                    style={{ top: '50%' }}
                  ></div>
                  
                  {/* Render layout elements */}
                  {layoutElements.map(renderLayoutElement)}
                  
                  {/* Grid overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                </div>

                <Separator className="my-4 bg-gray-700" />

                {/* Element Properties */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">Goals</div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-4 h-4 border-2 border-accent bg-accent bg-opacity-20"></div>
                      <span className="text-white font-medium">2</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">Penalty Areas</div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-4 h-4 border-2 border-yellow-500 bg-yellow-500 bg-opacity-20"></div>
                      <span className="text-white font-medium">2</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">Center Circle</div>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-4 h-4 border-2 border-blue-500 bg-blue-500 bg-opacity-20 rounded-full"></div>
                      <span className="text-white font-medium">1</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">Total Elements</div>
                    <div className="flex items-center justify-center space-x-1">
                      <Zap className="w-4 h-4 text-accent" />
                      <span className="text-white font-medium">{layoutElements.length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Preview Templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Card className="glassmorphic border-gray-700">
            <CardHeader>
              <CardTitle>Layout Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="group cursor-pointer">
                  <div className="glassmorphic p-4 rounded-lg border border-gray-700 hover:border-accent transition-colors duration-300">
                    <div className="relative w-full h-24 bg-green-900 bg-opacity-30 border border-green-600 rounded mb-3">
                      <div className="absolute inset-2 border border-white opacity-30"></div>
                      <div className="absolute left-1/2 top-1/2 w-4 h-4 border border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
                    </div>
                    <h3 className="font-medium text-white mb-1">Standard Football</h3>
                    <p className="text-sm text-gray-400">FIFA regulation size</p>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="glassmorphic p-4 rounded-lg border border-gray-700 hover:border-accent transition-colors duration-300">
                    <div className="relative w-full h-24 bg-green-900 bg-opacity-30 border border-green-600 rounded mb-3">
                      <div className="absolute inset-2 border border-white opacity-30"></div>
                      <div className="absolute left-1/2 top-2 w-8 h-1 bg-white opacity-30"></div>
                      <div className="absolute left-1/2 bottom-2 w-8 h-1 bg-white opacity-30 transform -translate-x-1/2"></div>
                    </div>
                    <h3 className="font-medium text-white mb-1">Cricket Ground</h3>
                    <p className="text-sm text-gray-400">Standard oval pitch</p>
                  </div>
                </div>
                
                <div className="group cursor-pointer">
                  <div className="glassmorphic p-4 rounded-lg border border-gray-700 hover:border-accent transition-colors duration-300">
                    <div className="relative w-full h-24 bg-green-900 bg-opacity-30 border border-green-600 rounded mb-3">
                      <div className="absolute inset-2 border border-white opacity-30"></div>
                      <div className="absolute inset-4 border border-white opacity-20"></div>
                    </div>
                    <h3 className="font-medium text-white mb-1">Multi-Sport</h3>
                    <p className="text-sm text-gray-400">Flexible layout</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
