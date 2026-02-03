export type UserRole = 'admin' | 'field_officer' | 'distributor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  state: string;
  district: string;
  avatar?: string;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  timestamp?: Date;
}

export interface Meeting {
  id: string;
  type: 'one-on-one' | 'group';
  userId: string;
  date: Date;
  location: Location;
  personName?: string;
  personCategory?: 'farmer' | 'seller' | 'influencer';
  contactDetails?: string;
  businessPotential?: string;
  photos?: string[];
  villageName?: string;
  attendeeCount?: number;
  meetingType?: string;
  notes?: string;
}

export interface SampleDistribution {
  id: string;
  userId: string;
  date: Date;
  productSKU: string;
  quantity: number;
  recipientName: string;
  recipientType: 'farmer' | 'distributor' | 'retailer';
  purpose: 'trial' | 'demo' | 'follow-up';
  location: Location;
  notes?: string;
}

export interface Sale {
  id: string;
  userId: string;
  date: Date;
  type: 'B2C' | 'B2B';
  productSKU: string;
  packSize: string;
  quantity: number;
  mode: 'direct' | 'via_distributor';
  isRepeatOrder: boolean;
  customerName: string;
  customerContact?: string;
  location: Location;
  amount: number;
}

export interface DailyLog {
  id: string;
  userId: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  startLocation: Location;
  endLocation?: Location;
  odometerStart?: number;
  odometerEnd?: number;
  distanceTraveled?: number;
  locationHistory: Location[];
}

export interface DashboardStats {
  totalDistance: number;
  meetingsCount: number;
  farmersContacted: number;
  farmersConverted: number;
  b2cSales: number;
  b2bSales: number;
  samplesDistributed: number;
  totalVolumeSold: number;
}
