import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChartPie, 
  Clock, 
  DollarSign, 
  Calendar,
  Settings,
  ChevronDown,
  DraftingCompass,
  Gift,
  Users,
  UserPlus,
  Cog
} from "lucide-react";
import { useState } from "react";

export function AdminSidebar() {
  const [location] = useLocation();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const mainMenuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: ChartPie },
    { href: "/admin/slots", label: "Slots & Schedule", icon: Clock },
    { href: "/admin/pricing", label: "Pricing Manager", icon: DollarSign },
    { href: "/admin/bookings", label: "Bookings Overview", icon: Calendar },
  ];

  const advancedMenuItems = [
    { href: "/admin/layout", label: "Layout Designer", icon: DraftingCompass },
    { href: "/admin/loyalty", label: "Loyalty Config", icon: Gift },
    { href: "/admin/teams", label: "Team Tracker", icon: Users },
    { href: "/admin/walk-in", label: "Walk-in Bookings", icon: UserPlus },
    { href: "/admin/settings", label: "Settings", icon: Cog },
  ];

  return (
    <div className="w-64 glassmorphic border-r border-gray-800 p-6 min-h-screen">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-2">Admin Panel</h2>
        <p className="text-gray-400 text-sm">Manage your turfs</p>
      </div>
      
      <nav className="space-y-2">
        {/* Main Menu Items */}
        {mainMenuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={location === item.href ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          </Link>
        ))}

        {/* Advanced Features Accordion */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen} className="mt-4">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <div className="flex items-center">
                <Settings className="w-4 h-4 mr-3" />
                Advanced
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 ml-8 space-y-2">
            {advancedMenuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </nav>
    </div>
  );
}
