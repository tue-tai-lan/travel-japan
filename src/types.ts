export interface FlightInfo {
  airline: string;
  flightNumber: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  from: string;
  to: string;
  direction: 'outbound' | 'return';
}

export interface AccommodationInfo {
  name: string;
  address: string;
  addressEnglish?: string;
  postalCode: string;
  roomType?: string;
  checkIn: string;
  checkOut: string;
  mapUrl: string;
}

export interface Activity {
  id: string;
  time?: string;
  title: string;
  subtitle?: string;
  type: 'flight' | 'hotel' | 'food' | 'spot' | 'transport' | 'shopping' | 'leisure';
  optional?: boolean;
  notes?: string[];
  mapUrl?: string;
  referenceUrl?: string;
  price?: string;
  image?: string;
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  dayOfWeek: string;
  title: string;
  activities: Activity[];
}

export interface WishlistItem {
  id: string;
  category: '美食' | '景點' | '體驗' | '願望' | '其他';
  name: string;
  englishName?: string;
  notes?: string;
  completed: boolean;
  mapUrl?: string;
}

export interface USJRide {
  id: string;
  name: string;
  recommendation: string;
  fastPass5: boolean;
  fastPass4: boolean;
  tips?: string;
  completed: boolean;
}
