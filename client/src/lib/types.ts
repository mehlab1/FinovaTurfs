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

export interface TimeSlot {
  time: string;
  demand: 'high' | 'low';
  price: number;
  available: boolean;
}

export interface WeatherHour {
  time: string;
  temp: number;
  icon: string;
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
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  ground?: Ground;
}
