import { 
  users, grounds, bookings, slotPricing, weatherData,
  type User, type InsertUser,
  type Ground, type InsertGround,
  type Booking, type InsertBooking,
  type SlotPricing, type InsertSlotPricing,
  type WeatherData, type InsertWeatherData
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Grounds
  getAllGrounds(): Promise<Ground[]>;
  getGroundById(id: number): Promise<Ground | undefined>;
  createGround(ground: InsertGround): Promise<Ground>;
  
  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByUserId(userId: number): Promise<Booking[]>;
  getAllBookings(): Promise<Booking[]>;
  getBookingById(id: number): Promise<Booking | undefined>;
  
  // Slot Pricing
  getSlotPricingByGroundId(groundId: number): Promise<SlotPricing[]>;
  createSlotPricing(pricing: InsertSlotPricing): Promise<SlotPricing>;
  
  // Weather
  getWeatherByDate(date: string): Promise<WeatherData | undefined>;
  createWeatherData(weather: InsertWeatherData): Promise<WeatherData>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private grounds: Map<number, Ground>;
  private bookings: Map<number, Booking>;
  private slotPricing: Map<number, SlotPricing>;
  private weatherData: Map<string, WeatherData>;
  private currentUserId: number;
  private currentGroundId: number;
  private currentBookingId: number;
  private currentSlotPricingId: number;

  constructor() {
    this.users = new Map();
    this.grounds = new Map();
    this.bookings = new Map();
    this.slotPricing = new Map();
    this.weatherData = new Map();
    this.currentUserId = 1;
    this.currentGroundId = 1;
    this.currentBookingId = 1;
    this.currentSlotPricingId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Create admin user
    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin",
      password: "admin123",
      email: "admin@finovaturfs.com",
      name: "Admin User",
      isAdmin: true,
      loyaltyPoints: 0,
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Create regular user
    const regularUser: User = {
      id: this.currentUserId++,
      username: "ahmed",
      password: "password123",
      email: "ahmed@example.com",
      name: "Ahmed Khan",
      isAdmin: false,
      loyaltyPoints: 150,
      createdAt: new Date(),
    };
    this.users.set(regularUser.id, regularUser);

    // Create grounds
    const ground1: Ground = {
      id: this.currentGroundId++,
      name: "Victory Sports Complex",
      location: "Defence, Karachi",
      city: "Karachi",
      sports: ["football", "cricket"],
      basePrice: "2000.00",
      openTime: "10:00",
      closeTime: "01:00",
      rating: "4.8",
      imageUrl: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d",
    };
    this.grounds.set(ground1.id, ground1);

    const ground2: Ground = {
      id: this.currentGroundId++,
      name: "Elite Football Arena",
      location: "Gulberg, Lahore",
      city: "Lahore",
      sports: ["football"],
      basePrice: "1800.00",
      openTime: "10:00",
      closeTime: "01:00",
      rating: "4.6",
      imageUrl: "https://images.unsplash.com/photo-1577223625816-7546f13df25d",
    };
    this.grounds.set(ground2.id, ground2);

    const ground3: Ground = {
      id: this.currentGroundId++,
      name: "Champions Cricket Ground",
      location: "F-10, Islamabad",
      city: "Islamabad",
      sports: ["cricket"],
      basePrice: "2500.00",
      openTime: "10:00",
      closeTime: "01:00",
      rating: "4.9",
      imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e",
    };
    this.grounds.set(ground3.id, ground3);

    // Initialize slot pricing for each ground
    this.initializeSlotPricing();
    
    // Initialize weather data
    this.initializeWeatherData();
  }

  private initializeSlotPricing() {
    const timeSlots = [
      "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
      "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
      "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
      "22:00", "22:30", "23:00", "23:30", "00:00", "00:30"
    ];

    const peakHours = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];

    for (let groundId = 1; groundId <= 3; groundId++) {
      timeSlots.forEach(timeSlot => {
        const isPeak = peakHours.includes(timeSlot);
        const pricing: SlotPricing = {
          id: this.currentSlotPricingId++,
          groundId,
          timeSlot,
          demand: isPeak ? "high" : "low",
          multiplier: isPeak ? "1.3" : "1.0",
        };
        this.slotPricing.set(pricing.id, pricing);
      });
    }
  }

  private initializeWeatherData() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const generateHourlyData = () => {
      const hours = [];
      for (let i = 10; i <= 23; i++) {
        hours.push({
          time: `${i.toString().padStart(2, '0')}:00`,
          temp: Math.floor(Math.random() * 10) + 18, // 18-28°C
          icon: i < 18 ? "sun" : i < 20 ? "cloud-sun" : "moon"
        });
      }
      hours.push({
        time: "00:00",
        temp: Math.floor(Math.random() * 5) + 15, // 15-20°C
        icon: "moon"
      });
      hours.push({
        time: "00:30",
        temp: Math.floor(Math.random() * 5) + 15,
        icon: "moon"
      });
      return hours;
    };

    const weatherToday: WeatherData = {
      id: 1,
      date: today,
      hourlyData: generateHourlyData(),
    };

    const weatherTomorrow: WeatherData = {
      id: 2,
      date: tomorrow,
      hourlyData: generateHourlyData(),
    };

    this.weatherData.set(today, weatherToday);
    this.weatherData.set(tomorrow, weatherTomorrow);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      loyaltyPoints: 0,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // Ground methods
  async getAllGrounds(): Promise<Ground[]> {
    return Array.from(this.grounds.values());
  }

  async getGroundById(id: number): Promise<Ground | undefined> {
    return this.grounds.get(id);
  }

  async createGround(insertGround: InsertGround): Promise<Ground> {
    const ground: Ground = {
      ...insertGround,
      id: this.currentGroundId++,
    };
    this.grounds.set(ground.id, ground);
    return ground;
  }

  // Booking methods
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const booking: Booking = {
      ...insertBooking,
      id: this.currentBookingId++,
      createdAt: new Date(),
    };
    this.bookings.set(booking.id, booking);
    return booking;
  }

  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.userId === userId);
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  // Slot pricing methods
  async getSlotPricingByGroundId(groundId: number): Promise<SlotPricing[]> {
    return Array.from(this.slotPricing.values()).filter(pricing => pricing.groundId === groundId);
  }

  async createSlotPricing(insertPricing: InsertSlotPricing): Promise<SlotPricing> {
    const pricing: SlotPricing = {
      ...insertPricing,
      id: this.currentSlotPricingId++,
    };
    this.slotPricing.set(pricing.id, pricing);
    return pricing;
  }

  // Weather methods
  async getWeatherByDate(date: string): Promise<WeatherData | undefined> {
    return this.weatherData.get(date);
  }

  async createWeatherData(insertWeather: InsertWeatherData): Promise<WeatherData> {
    const weather: WeatherData = {
      ...insertWeather,
      id: this.weatherData.size + 1,
    };
    this.weatherData.set(weather.date, weather);
    return weather;
  }
}

export const storage = new MemStorage();
