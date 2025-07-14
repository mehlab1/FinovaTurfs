import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Save, 
  Bell, 
  Mail, 
  Shield, 
  Database,
  Globe,
  Clock,
  DollarSign,
  Smartphone,
  Key,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

const generalSettingsSchema = z.object({
  platformName: z.string().min(1, "Platform name is required"),
  tagline: z.string().optional(),
  supportEmail: z.string().email("Invalid email address"),
  supportPhone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  timezone: z.string().min(1, "Timezone is required"),
  currency: z.string().min(1, "Currency is required"),
  language: z.string().min(1, "Language is required"),
});

const bookingSettingsSchema = z.object({
  maxAdvanceBookingDays: z.number().min(1).max(365),
  minBookingDuration: z.number().min(0.5),
  maxBookingDuration: z.number().min(1),
  cancellationHours: z.number().min(0),
  autoConfirmBookings: z.boolean(),
  allowWalkInBookings: z.boolean(),
  requirePaymentUpfront: z.boolean(),
});

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  bookingConfirmations: z.boolean(),
  bookingReminders: z.boolean(),
  paymentAlerts: z.boolean(),
  maintenanceAlerts: z.boolean(),
});

type GeneralSettings = z.infer<typeof generalSettingsSchema>;
type BookingSettings = z.infer<typeof bookingSettingsSchema>;
type NotificationSettings = z.infer<typeof notificationSettingsSchema>;

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generalForm = useForm<GeneralSettings>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      platformName: "Finova Turfs",
      tagline: "Premium Sports Ground Booking Platform",
      supportEmail: "support@finovaturfs.com",
      supportPhone: "+92-XXX-XXXXXXX",
      address: "123 Sports Avenue, Karachi, Pakistan",
      timezone: "Asia/Karachi",
      currency: "PKR",
      language: "en",
    },
  });

  const bookingForm = useForm<BookingSettings>({
    resolver: zodResolver(bookingSettingsSchema),
    defaultValues: {
      maxAdvanceBookingDays: 30,
      minBookingDuration: 0.5,
      maxBookingDuration: 8,
      cancellationHours: 4,
      autoConfirmBookings: true,
      allowWalkInBookings: true,
      requirePaymentUpfront: true,
    },
  });

  const notificationForm = useForm<NotificationSettings>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      bookingConfirmations: true,
      bookingReminders: true,
      paymentAlerts: true,
      maintenanceAlerts: true,
    },
  });

  const handleGeneralSubmit = async (data: GeneralSettings) => {
    setIsLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast({
        title: "Settings Updated",
        description: "General settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update general settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingSubmit = async (data: BookingSettings) => {
    setIsLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast({
        title: "Settings Updated",
        description: "Booking settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update booking settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationSubmit = async (data: NotificationSettings) => {
    setIsLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast({
        title: "Settings Updated",
        description: "Notification settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "booking", label: "Booking Rules", icon: Clock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "integrations", label: "Integrations", icon: Globe },
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
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Configure platform settings and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="glassmorphic border-gray-700">
              <CardHeader>
                <CardTitle>Settings Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {/* General Settings */}
            {activeTab === "general" && (
              <Card className="glassmorphic border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <SettingsIcon className="w-5 h-5 mr-2 text-accent" />
                    General Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...generalForm}>
                    <form onSubmit={generalForm.handleSubmit(handleGeneralSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={generalForm.control}
                          name="platformName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Platform Name</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-gray-800 border-gray-700" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={generalForm.control}
                          name="tagline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tagline</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-gray-800 border-gray-700" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={generalForm.control}
                          name="supportEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Support Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" className="bg-gray-800 border-gray-700" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={generalForm.control}
                          name="supportPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Support Phone</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-gray-800 border-gray-700" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={generalForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Address</FormLabel>
                            <FormControl>
                              <Textarea {...field} className="bg-gray-800 border-gray-700" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={generalForm.control}
                          name="timezone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Timezone</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="bg-gray-800 border-gray-700">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Asia/Karachi">Asia/Karachi</SelectItem>
                                    <SelectItem value="Asia/Dubai">Asia/Dubai</SelectItem>
                                    <SelectItem value="UTC">UTC</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={generalForm.control}
                          name="currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Currency</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="bg-gray-800 border-gray-700">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="PKR">PKR (Pakistani Rupee)</SelectItem>
                                    <SelectItem value="USD">USD (US Dollar)</SelectItem>
                                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={generalForm.control}
                          name="language"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Default Language</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="bg-gray-800 border-gray-700">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="ur">Urdu</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" disabled={isLoading} className="bg-accent text-black hover:bg-opacity-80">
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? "Saving..." : "Save General Settings"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Booking Settings */}
            {activeTab === "booking" && (
              <Card className="glassmorphic border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-accent" />
                    Booking Rules & Policies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...bookingForm}>
                    <form onSubmit={bookingForm.handleSubmit(handleBookingSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={bookingForm.control}
                          name="maxAdvanceBookingDays"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Advance Booking (Days)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  className="bg-gray-800 border-gray-700" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={bookingForm.control}
                          name="cancellationHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cancellation Notice (Hours)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  className="bg-gray-800 border-gray-700" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={bookingForm.control}
                          name="minBookingDuration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Min Booking Duration (Hours)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  step="0.5"
                                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  className="bg-gray-800 border-gray-700" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={bookingForm.control}
                          name="maxBookingDuration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Booking Duration (Hours)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  className="bg-gray-800 border-gray-700" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator className="bg-gray-700" />

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Booking Policies</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={bookingForm.control}
                            name="autoConfirmBookings"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <FormLabel>Auto-confirm bookings</FormLabel>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={bookingForm.control}
                            name="allowWalkInBookings"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <FormLabel>Allow walk-in bookings</FormLabel>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={bookingForm.control}
                            name="requirePaymentUpfront"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <FormLabel>Require upfront payment</FormLabel>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Button type="submit" disabled={isLoading} className="bg-accent text-black hover:bg-opacity-80">
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? "Saving..." : "Save Booking Settings"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <Card className="glassmorphic border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-accent" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...notificationForm}>
                    <form onSubmit={notificationForm.handleSubmit(handleNotificationSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Communication Channels</h3>
                        <div className="space-y-4">
                          <FormField
                            control={notificationForm.control}
                            name="emailNotifications"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Mail className="w-4 h-4 text-accent" />
                                  <FormLabel>Email Notifications</FormLabel>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={notificationForm.control}
                            name="smsNotifications"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Smartphone className="w-4 h-4 text-accent" />
                                  <FormLabel>SMS Notifications</FormLabel>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={notificationForm.control}
                            name="pushNotifications"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Bell className="w-4 h-4 text-accent" />
                                  <FormLabel>Push Notifications</FormLabel>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Separator className="bg-gray-700" />

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Notification Types</h3>
                        <div className="space-y-4">
                          <FormField
                            control={notificationForm.control}
                            name="bookingConfirmations"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <FormLabel>Booking confirmations</FormLabel>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={notificationForm.control}
                            name="bookingReminders"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <FormLabel>Booking reminders</FormLabel>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={notificationForm.control}
                            name="paymentAlerts"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <FormLabel>Payment alerts</FormLabel>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={notificationForm.control}
                            name="maintenanceAlerts"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <FormLabel>Maintenance alerts</FormLabel>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Button type="submit" disabled={isLoading} className="bg-accent text-black hover:bg-opacity-80">
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? "Saving..." : "Save Notification Settings"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <Card className="glassmorphic border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-accent" />
                    Security & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Authentication Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Session Timeout (minutes)</Label>
                        <Input defaultValue="60" className="bg-gray-800 border-gray-700" />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Login Attempts</Label>
                        <Input defaultValue="5" className="bg-gray-800 border-gray-700" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Require two-factor authentication</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Force password reset every 90 days</Label>
                      <Switch />
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">API Security</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>API Rate Limiting</Label>
                          <p className="text-sm text-gray-400">Limit API requests per user</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Requests per minute</Label>
                          <Input defaultValue="100" className="bg-gray-800 border-gray-700" />
                        </div>
                        <div className="space-y-2">
                          <Label>API Key Expiry (days)</Label>
                          <Input defaultValue="365" className="bg-gray-800 border-gray-700" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Data Management</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="border-gray-700">
                        <Database className="w-4 h-4 mr-2" />
                        Backup Data
                      </Button>
                      <Button variant="outline" className="border-gray-700">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset API Keys
                      </Button>
                    </div>
                  </div>

                  <Button className="bg-accent text-black hover:bg-opacity-80">
                    <Save className="w-4 h-4 mr-2" />
                    Save Security Settings
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Integrations */}
            {activeTab === "integrations" && (
              <Card className="glassmorphic border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-accent" />
                    Third-party Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Payment Gateways</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <DollarSign className="w-8 h-8 text-accent" />
                          <div>
                            <h4 className="font-medium text-white">JazzCash</h4>
                            <p className="text-sm text-gray-400">Mobile wallet payments</p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <DollarSign className="w-8 h-8 text-accent" />
                          <div>
                            <h4 className="font-medium text-white">EasyPaisa</h4>
                            <p className="text-sm text-gray-400">Digital payments</p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <DollarSign className="w-8 h-8 text-accent" />
                          <div>
                            <h4 className="font-medium text-white">Credit/Debit Cards</h4>
                            <p className="text-sm text-gray-400">Visa, Mastercard payments</p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Communication Services</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-8 h-8 text-accent" />
                          <div>
                            <h4 className="font-medium text-white">Email Service</h4>
                            <p className="text-sm text-gray-400">SMTP configuration</p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-8 h-8 text-accent" />
                          <div>
                            <h4 className="font-medium text-white">SMS Gateway</h4>
                            <p className="text-sm text-gray-400">Text message notifications</p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Analytics & Monitoring</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Globe className="w-8 h-8 text-accent" />
                          <div>
                            <h4 className="font-medium text-white">Google Analytics</h4>
                            <p className="text-sm text-gray-400">Website traffic analysis</p>
                          </div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Button className="bg-accent text-black hover:bg-opacity-80">
                    <Save className="w-4 h-4 mr-2" />
                    Save Integration Settings
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
