import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Mock JWT token
      const token = `mock_jwt_${user.id}_${user.isAdmin ? 'admin' : 'user'}`;
      
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          loyaltyPoints: user.loyaltyPoints
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Grounds routes
  app.get("/api/grounds", async (req, res) => {
    try {
      const grounds = await storage.getAllGrounds();
      res.json(grounds);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch grounds" });
    }
  });

  app.get("/api/grounds/:id", async (req, res) => {
    try {
      const groundId = parseInt(req.params.id);
      const ground = await storage.getGroundById(groundId);
      
      if (!ground) {
        return res.status(404).json({ message: "Ground not found" });
      }
      
      res.json(ground);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ground" });
    }
  });

  // Slots routes
  app.get("/api/slots/:groundId", async (req, res) => {
    try {
      const groundId = parseInt(req.params.groundId);
      const ground = await storage.getGroundById(groundId);
      
      if (!ground) {
        return res.status(404).json({ message: "Ground not found" });
      }
      
      const slotPricing = await storage.getSlotPricingByGroundId(groundId);
      
      // Generate time slots between open and close time
      const generateTimeSlots = (openTime: string, closeTime: string) => {
        const slots = [];
        let currentHour = parseInt(openTime.split(':')[0]);
        let currentMinute = parseInt(openTime.split(':')[1]);
        
        const closeHour = parseInt(closeTime.split(':')[0]);
        
        while (true) {
          const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
          
          // Find pricing for this slot
          const pricing = slotPricing.find(p => p.timeSlot === timeStr);
          const basePrice = parseFloat(ground.basePrice);
          const multiplier = pricing ? parseFloat(pricing.multiplier) : 1.0;
          const price = Math.round(basePrice * multiplier);
          
          slots.push({
            time: timeStr,
            demand: pricing?.demand || 'low',
            price,
            available: true
          });
          
          // Increment by 30 minutes
          currentMinute += 30;
          if (currentMinute >= 60) {
            currentMinute = 0;
            currentHour++;
          }
          
          // Handle day transition (24:00 becomes 00:00)
          if (currentHour >= 24) {
            currentHour = 0;
          }
          
          // Stop when we reach close time
          if (currentHour === closeHour && currentMinute === 0) {
            break;
          }
          
          // Safety check to prevent infinite loop
          if (slots.length > 50) break;
        }
        
        return slots;
      };
      
      const slots = generateTimeSlots(ground.openTime, ground.closeTime);
      
      res.json({
        ground,
        openTime: ground.openTime,
        closeTime: ground.closeTime,
        slots
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch slots" });
    }
  });

  // Weather forecast
  app.get("/api/forecast/:date", async (req, res) => {
    try {
      const date = req.params.date;
      let weather = await storage.getWeatherByDate(date);
      
      if (!weather) {
        // Generate weather data for the requested date
        const hourlyData = [];
        for (let i = 10; i <= 23; i++) {
          hourlyData.push({
            time: `${i.toString().padStart(2, '0')}:00`,
            temp: Math.floor(Math.random() * 10) + 18,
            icon: i < 18 ? "sun" : i < 20 ? "cloud-sun" : "moon"
          });
        }
        hourlyData.push({
          time: "00:00",
          temp: Math.floor(Math.random() * 5) + 15,
          icon: "moon"
        });
        hourlyData.push({
          time: "00:30",
          temp: Math.floor(Math.random() * 5) + 15,
          icon: "moon"
        });
        
        weather = await storage.createWeatherData({
          date,
          hourlyData
        });
      }
      
      res.json(weather);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather forecast" });
    }
  });

  // Booking routes
  app.post("/api/book", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      
      res.json({
        id: booking.id,
        status: "confirmed",
        message: "Booking confirmed successfully!"
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid booking data" });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const bookings = await storage.getBookingsByUserId(userId);
      
      // Enrich bookings with ground information
      const enrichedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const ground = await storage.getGroundById(booking.groundId);
          return {
            ...booking,
            ground
          };
        })
      );
      
      res.json(enrichedBookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // AI Assistant
  app.post("/api/ai/assistant", async (req, res) => {
    try {
      const { message } = req.body;
      
      // Mock GPT-4 style responses
      const responses = [
        "Based on current data, 10:00 AM - 12:00 PM has low demand and great weather! 🌤️ Perfect for a morning game with 20% savings.",
        "Evening slots (6-8 PM) are popular but pricier. For better rates, try 10-11 PM with cooler weather! 🌙 You'll save PKR 400+ per hour.",
        "I recommend booking 2 hours in advance. Victory Sports Complex has the best ratings in your area! ⭐ Currently 78% occupancy.",
        "Weather looks perfect tomorrow - 24°C and sunny! Early morning slots offer the best value. 🌅 Peak hours cost 30% more.",
        "Your loyalty points can save you PKR 50! 🎉 You have 150 points available. Perfect time to use them for peak hour bookings.",
        "Friday evenings are busiest. Try Tuesday-Thursday for better availability and pricing! 📅 Up to 25% discounts on weekdays."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      res.json({
        reply: randomResponse
      });
    } catch (error) {
      res.status(500).json({ message: "AI assistant temporarily unavailable" });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const allBookings = await storage.getAllBookings();
      const totalRevenue = allBookings.reduce((sum, booking) => sum + parseFloat(booking.totalPrice), 0);
      const totalBookings = allBookings.length;
      
      // Mock additional stats
      const stats = {
        revenue: Math.round(totalRevenue),
        bookings: totalBookings,
        occupancy: 78,
        activeUsers: 1234
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/bookings", async (req, res) => {
    try {
      const allBookings = await storage.getAllBookings();
      
      // Enrich with user and ground data
      const enrichedBookings = await Promise.all(
        allBookings.map(async (booking) => {
          const user = await storage.getUser(booking.userId);
          const ground = await storage.getGroundById(booking.groundId);
          return {
            ...booking,
            user,
            ground
          };
        })
      );
      
      res.json(enrichedBookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin bookings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
