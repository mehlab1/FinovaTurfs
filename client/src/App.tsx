import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { auth } from "@/lib/auth";

// Import pages
import Login from "@/pages/login";
import AdminLogin from "@/pages/admin-login";
import Dashboard from "@/pages/dashboard";
import Grounds from "@/pages/grounds";
import Bookings from "@/pages/bookings";
import Help from "@/pages/help";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminSlots from "@/pages/admin/slots";
import AdminPricing from "@/pages/admin/pricing";
import AdminLayout from "@/pages/admin/layout";
import AdminBookings from "@/pages/admin/bookings";
import AdminLoyalty from "@/pages/admin/loyalty";
import AdminTeams from "@/pages/admin/teams";
import AdminSettings from "@/pages/admin/settings";
import AdminWalkInBookings from "@/pages/admin/walk-in-bookings";
import NotFound from "@/pages/not-found";

// Protected Route Component
function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType; adminOnly?: boolean }) {
  if (!auth.isAuthenticated()) {
    return <Redirect to="/login" />;
  }
  
  if (adminOnly && !auth.isAdmin()) {
    return <Redirect to="/dashboard" />;
  }
  
  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login" component={Login} />
      <Route path="/admin/login" component={AdminLogin} />
      
      {/* Protected user routes */}
      <Route path="/">
        {auth.isAuthenticated() ? (
          auth.isAdmin() ? <Redirect to="/admin/dashboard" /> : <Redirect to="/dashboard" />
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/grounds">
        <ProtectedRoute component={Grounds} />
      </Route>
      <Route path="/bookings">
        <ProtectedRoute component={Bookings} />
      </Route>
      <Route path="/help">
        <ProtectedRoute component={Help} />
      </Route>
      
      {/* Protected admin routes */}
      <Route path="/admin/dashboard">
        <ProtectedRoute component={AdminDashboard} adminOnly />
      </Route>
      <Route path="/admin/slots">
        <ProtectedRoute component={AdminSlots} adminOnly />
      </Route>
      <Route path="/admin/pricing">
        <ProtectedRoute component={AdminPricing} adminOnly />
      </Route>
      <Route path="/admin/layout">
        <ProtectedRoute component={AdminLayout} adminOnly />
      </Route>
      <Route path="/admin/bookings">
        <ProtectedRoute component={AdminBookings} adminOnly />
      </Route>
      <Route path="/admin/loyalty">
        <ProtectedRoute component={AdminLoyalty} adminOnly />
      </Route>
      <Route path="/admin/teams">
        <ProtectedRoute component={AdminTeams} adminOnly />
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute component={AdminSettings} adminOnly />
      </Route>
      <Route path="/admin/walk-in-bookings">
        <ProtectedRoute component={AdminWalkInBookings} adminOnly />
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="finova-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
