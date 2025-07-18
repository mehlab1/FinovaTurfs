// Data service to replace backend API calls with hardcoded data and local storage

export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  isAdmin: boolean;
  loyaltyPoints: number;
  createdAt: string;
}

export interface Ground {
  id: number;
  name: string;
  location: string;
  city: string;
  sports: string[];
  basePrice: string;
  openTime: string;
  closeTime: string;
  rating: string;
  imageUrl?: string;
}

export interface Booking {
  id: number;
  userId: number;
  groundId: number;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  totalPrice: string;
  usedLoyaltyPoints: boolean;
  status: string;
  createdAt: string;
  ground?: Ground;
  user?: User;
}

export interface TimeSlot {
  time: string;
  demand: string;
  price: number;
  available: boolean;
}

export interface WeatherData {
  id: number;
  date: string;
  hourlyData: Array<{
    time: string;
    temp: number;
    icon: string;
  }>;
}

export interface SlotPricing {
  id: number;
  groundId: number;
  timeSlot: string;
  demand: string;
  multiplier: string;
}

export interface AdminStats {
  revenue: number;
  bookings: number;
  occupancy: number;
  activeUsers: number;
}

class DataService {
  private users: User[] = [
    {
      id: 1,
      username: "admin",
      password: "admin123",
      name: "Admin User",
      email: "admin@finovaturfs.com",
      isAdmin: true,
      loyaltyPoints: 0,
      createdAt: "2024-11-01T00:00:00Z",
    },
    {
      id: 2,
      username: "ahmed",
      password: "password123",
      name: "Ahmed Khan",
      email: "ahmed@example.com",
      isAdmin: false,
      loyaltyPoints: 150,
      createdAt: "2024-11-15T10:00:00Z",
    },
  ];

  private grounds: Ground[] = [
    {
      id: 1,
      name: "Victory Sports Complex",
      location: "Defence, Karachi",
      city: "Karachi",
      sports: ["football", "cricket"],
      basePrice: "2000",
      openTime: "10:00",
      closeTime: "01:00",
      rating: "4.8",
      imageUrl: "https://images.unsplash.com/photo-15565654569648?w=80t=crop&crop=center",
    },
    {
      id: 2,
      name: "Elite Football Arena",
      location: "Gulberg, Lahore",
      city: "Lahore",
      sports: ["football"],
      basePrice: "1800",
      openTime: "10:00",
      closeTime: "01:00",
      rating: "4.6",
      imageUrl: "https://images.unsplash.com/photo-15772236258167546325t=crop&crop=center",
    },
    {
      id: 3,
      name: "Champions Cricket Ground",
      location: "F-10, Islamabad",
      city: "Islamabad",
      sports: ["cricket"],
      basePrice: "2500",
      openTime: "10:00",
      closeTime: "01:00",
      rating: "4.9",
      imageUrl: "https://images.unsplash.com/photo-15407479133461932t=crop&crop=center",
    },
  ];

  private bookings: Booking[] = [
    {
      id: 1,
      userId: 2,
      groundId: 1,
      date: "2025-01-01",
      startTime: "18:00",
      endTime: "19:00",
      duration: "1.0",
      totalPrice: "2000",
      usedLoyaltyPoints: false,
      status: "confirmed",
      createdAt: "2025-01-01T00:00:00Z",
    },
    {
      id: 2,
      userId: 2,
      groundId: 2,
      date: "2025-01-01",
      startTime: "19:00",
      endTime: "20:00",
      duration: "1.0",
      totalPrice: "1800",
      usedLoyaltyPoints: true,
      status: "confirmed",
      createdAt: "2025-01-15T15:30:00Z",
    },
  ];

  private slotPricing: SlotPricing[] = [];

  constructor() {
    this.initializeSlotPricing();
    this.loadFromStorage();
  }

  private initializeSlotPricing() {
    const timeSlots = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00"];

    const peakHours = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"];
    for (let groundId = 1; groundId <= 3; groundId++) {
      timeSlots.forEach((timeSlot, index) => {
        const isPeak = peakHours.includes(timeSlot);
        this.slotPricing.push({
          id: this.slotPricing.length + 1,
          groundId,
          timeSlot,
          demand: isPeak ? "high" : "low",
          multiplier: isPeak ? "1.3" : "1",
        });
      });
    }
  }

  private loadFromStorage() {
    try {
      const storedBookings = localStorage.getItem('finova_bookings');
      if (storedBookings) {
        this.bookings = JSON.parse(storedBookings);
      }
    } catch (error) {
      console.error('Failed to load data from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('finova_bookings', JSON.stringify(this.bookings));
    } catch (error) {
      console.error('Failed to save data to storage:', error);
    }
  }

  // Auth methods
  async login(username: string, password: string): Promise<{ token: string; user: User } | null> {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      const token = `mock_jwt_${user.id}_${user.isAdmin ? 'admin' : 'user'}`;
      return { token, user };
    }
    return null;
  }

  getUserByUsername(username: string): User | undefined {
    return this.users.find(u => u.username === username);
  }

  // Grounds methods
  async getAllGrounds(): Promise<Ground[]> {
    return this.grounds;
  }

  async getGroundById(id: number): Promise<Ground | undefined> {
    return this.grounds.find(g => g.id === id);
  }

  // Slots methods
  async getSlotsByGroundId(groundId: number): Promise<{ ground: Ground; openTime: string; closeTime: string; slots: TimeSlot[] }> {
    const ground = await this.getGroundById(groundId);
    if (!ground) {
      throw new Error('Ground not found');
    }

    const slotPricing = this.slotPricing.filter(sp => sp.groundId === groundId);
    
    const generateTimeSlots = (openTime: string, closeTime: string) => {
      const slots: TimeSlot[] = [];
      let currentHour = parseInt(openTime.split(':')[0]);
      let currentMinute = parseInt(openTime.split(':')[1]);
      const closeHour = parseInt(closeTime.split(':')[0]);
      while (true) {
        const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        
        const pricing = slotPricing.find(p => p.timeSlot === timeStr);
        const basePrice = parseFloat(ground.basePrice);
        const multiplier = pricing ? parseFloat(pricing.multiplier) : 1;
        const price = Math.round(basePrice * multiplier);
        
        slots.push({
          time: timeStr,
          demand: pricing?.demand || 'low',
          price,
          available: true
        });
        
        currentMinute += 30;
        if (currentMinute >= 60) {
          currentMinute = 0;
          currentHour++;
        }
        
        if (currentHour >= 24) {
          currentHour = 0;
        }
        
        if (currentHour === closeHour && currentMinute === 0) {
          break;
        }
        
        if (slots.length > 50) {
          break;
        }
      }
      
      return slots;
    };
    
    const slots = generateTimeSlots(ground.openTime, ground.closeTime);
    
    return {
      ground,
      openTime: ground.openTime,
      closeTime: ground.closeTime,
      slots
    };
  }

  // Weather methods
  async getWeatherByDate(date: string): Promise<WeatherData> {
    const generateHourlyData = () => {
      const hours: Array<{ time: string; temp: number; icon: string }> = [];
      for (let i = 10; i <= 23; i++) {
        const timeStr = `${i.toString().padStart(2, '0')}:00`;
        const isEvening = i >= 18;
        const isNight = i >= 20;
        
        // Add variety to weather
        let icon = "sun";
        if (isEvening && !isNight) icon = "cloud-sun";
        else if (isNight) icon = "moon";
        
        // Add some rain randomly
        if (Math.random() > 0.7) icon = "rain";
        
        hours.push({
          time: timeStr,
          temp: Math.floor(Math.random() * 10) + 18,
          icon: icon
        });
      }
      hours.push({
        time: "00:00",
        temp: Math.floor(Math.random() * 5) + 15,
        icon: "moon"
      });
      hours.push({
        time: "00:30",
        temp: Math.floor(Math.random() * 5) + 15,
        icon: "moon"
      });
      return hours;
    };

    return {
      id: 1,
      date,
      hourlyData: generateHourlyData(),
    };
  }

  // Booking methods
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    const newBooking: Booking = {
      ...bookingData,
      id: this.bookings.length + 1,
      createdAt: new Date().toISOString(),
    };
    
    this.bookings.push(newBooking);
    this.saveToStorage();
    
    return newBooking;
  }

  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    const userBookings = this.bookings.filter(b => b.userId === userId);
    
    // Enrich with ground information
    return userBookings.map(booking => ({
      ...booking,
      ground: this.grounds.find(g => g.id === booking.groundId)
    }));
  }

  async getAllBookings(): Promise<Booking[]> {
    return this.bookings.map(booking => ({
      ...booking,
      ground: this.grounds.find(g => g.id === booking.groundId),
      user: this.users.find(u => u.id === booking.userId)
    }));
  }

  // AI Assistant
  async getAIResponse(message: string): Promise<{ reply: string }> {
    const responses = [
      "Based on current data, 10 AM - 12:00 PM has low demand and great weather! 🌤️ Perfect for a morning game with 20% savings.",
      "Evening slots (6-8M) are popular but pricier. For better rates, try 10-11ith cooler weather! 🌙 You'll save PKR400 per hour.",
      "I recommend booking 2 hours in advance. Victory Sports Complex has the best ratings in your area! ⭐ Currently78occupancy.",
      "Weather looks perfect tomorrow - 24°C and sunny! Early morning slots offer the best value. 🌅 Peak hours cost30ore.",
      "Your loyalty points can save you PKR 50ou have 150 points available. Perfect time to use them for peak hour bookings.",
      "Friday evenings are busiest. Try Tuesday-Thursday for better availability and pricing! 📅 Up to 25% discounts on weekdays."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return { reply: randomResponse };
  }

  // Admin methods
  async getAdminStats(): Promise<AdminStats> {
    const totalRevenue = this.bookings.reduce((sum, booking) => sum + parseFloat(booking.totalPrice), 0);
    const totalBookings = this.bookings.length;
    
    return {
      revenue: Math.round(totalRevenue),
      bookings: totalBookings,
      occupancy: 78,
      activeUsers: 1234   };
  }

  async getAdminBookings(): Promise<Booking[]> {
    return this.bookings.map(booking => ({
      ...booking,
      ground: this.grounds.find(g => g.id === booking.groundId),
      user: this.users.find(u => u.id === booking.userId)
    }));
  }
}

export const dataService = new DataService(); 