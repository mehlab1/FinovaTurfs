import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  isAdmin: boolean("is_admin").default(false),
  loyaltyPoints: integer("loyalty_points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const grounds = pgTable("grounds", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  city: text("city").notNull(),
  sports: json("sports").$type<string[]>().notNull(), // ["football", "cricket"]
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  openTime: text("open_time").notNull(), // "10:00"
  closeTime: text("close_time").notNull(), // "01:00"
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  imageUrl: text("image_url"),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  groundId: integer("ground_id").references(() => grounds.id).notNull(),
  date: text("date").notNull(), // "YYYY-MM-DD"
  startTime: text("start_time").notNull(), // "18:00"
  endTime: text("end_time").notNull(), // "20:00"
  duration: decimal("duration", { precision: 3, scale: 1 }).notNull(), // in hours
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  usedLoyaltyPoints: boolean("used_loyalty_points").default(false),
  status: text("status").notNull().default("confirmed"), // "confirmed", "completed", "cancelled"
  createdAt: timestamp("created_at").defaultNow(),
});

export const slotPricing = pgTable("slot_pricing", {
  id: serial("id").primaryKey(),
  groundId: integer("ground_id").references(() => grounds.id).notNull(),
  timeSlot: text("time_slot").notNull(), // "18:00"
  demand: text("demand").notNull(), // "high", "low"
  multiplier: decimal("multiplier", { precision: 3, scale: 2 }).notNull(), // 1.0, 1.2, 1.5
});

export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  hourlyData: json("hourly_data").$type<Array<{
    time: string;
    temp: number;
    icon: string;
  }>>().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  loyaltyPoints: true,
  createdAt: true,
});

export const insertGroundSchema = createInsertSchema(grounds).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertSlotPricingSchema = createInsertSchema(slotPricing).omit({
  id: true,
});

export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Ground = typeof grounds.$inferSelect;
export type InsertGround = z.infer<typeof insertGroundSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type SlotPricing = typeof slotPricing.$inferSelect;
export type InsertSlotPricing = z.infer<typeof insertSlotPricingSchema>;

export type WeatherData = typeof weatherData.$inferSelect;
export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
