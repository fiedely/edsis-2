import { Timestamp } from 'firebase/firestore';

// 1. MASTER DATA INTERFACES
export interface Brand {
  id: string;
  name: string;
  collections: string[]; // List of collection names children
}

export interface Category {
  id: string;
  name: string;
}

// 2. DISCOUNT INTERFACE
export interface Discount {
  id: string;
  name: string;
  value: number; // Percentage (e.g., 20 for 20%)
  startDate: Timestamp;
  endDate: Timestamp;
  isActive: boolean;
}

// 3. SETTINGS INTERFACE (For Currency)
export interface SystemSettings {
  currencyRates: {
    eurToIdr: number;
    usdToIdr: number;
  };
}

// 4. PRODUCT INTERFACE (The Master Record)
export interface Product {
  // System Fields
  id: string;
  sku: string; // Generated: BRAND-COLL-CATE-PROD-SEQ
  searchKeywords: string[]; // For the "Super Smart Search"
  
  // Core Info
  brand: string;
  category: string;
  collectionName: string;
  productName: string;
  manufacturerId: string;
  
  // Details
  dimensions: string;
  finishing: string;
  detail: string;
  
  // Status Tags
  isNotForSale: boolean;
  isUpcoming: boolean;
  upcomingEta?: Timestamp | null;
  
  // Inventory
  totalQty: number;
  bookedQty: number;
  location: string;
  
  // Media
  imageUrl: string;
  
  // Pricing (Base)
  priceEur?: number;
  priceUsd?: number;
  priceIdr?: number; // Base IDR if no foreign currency
  
  // Pricing (Calculated/Applied)
  discountIds: string[]; // Array of Discount IDs attached
  manualDiscountValue?: number; // One-off discount if needed
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 5. HELPER INTERFACE FOR DISPLAY (What the UI sees)
export interface ProductDisplay extends Product {
  finalPriceIdr: number;   // Calculated: (Base * Rate) - Discounts
  basePriceIdr: number;    // Calculated: (Base * Rate)
  discountDisplay: string; // e.g., "20% + 10%"
}