// FIX: Added 'type' keyword for strict import
import type { Product, Discount } from '../types/inventory';

/**
 * SKU GENERATOR
 * Format: BRAND(4)-COLL(4)-CATE(4)-PROD(4)
 * Example: BLUE-AMBR-TABL-AMBR
 */
export function generateSku(
    brand: string, 
    collection: string, 
    category: string, 
    productName: string
  ): string {
    const clean = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    const p1 = clean(brand).padEnd(4, 'X').slice(0, 4);
    const p2 = clean(collection).padEnd(4, 'X').slice(0, 4);
    const p3 = clean(category).padEnd(4, 'X').slice(0, 4);
    const p4 = clean(productName).padEnd(4, 'X').slice(0, 4);
  
    return `${p1}-${p2}-${p3}-${p4}`;
  }

/**
 * CURRENCY CONVERTER
 * Priority: EUR -> USD -> IDR
 */
export function calculateBaseIdr(
  product: Partial<Product>, 
  rates: { eur: number; usd: number }
): number {
  if (product.priceEur && product.priceEur > 0) {
    return product.priceEur * rates.eur;
  }
  if (product.priceUsd && product.priceUsd > 0) {
    return product.priceUsd * rates.usd;
  }
  return product.priceIdr || 0;
}

/**
 * DISCOUNT CALCULATOR (Compound)
 * Logic: Price * (1 - d1) * (1 - d2) ...
 * This differentiates 20%+20% (64% remaining) from 40% (60% remaining).
 */
export function calculateNettPrice(baseIdr: number, discounts: Discount[]): number {
  let multiplier = 1;
  
  // Filter active/valid discounts only
  const now = new Date();
  const validDiscounts = discounts.filter(d => 
    d.isActive && 
    d.startDate.toDate() <= now && 
    d.endDate.toDate() >= now
  );

  validDiscounts.forEach(d => {
    // Convert 20 to 0.2
    const decimal = d.value / 100;
    // Compound: multiply by (1 - 0.2)
    multiplier = multiplier * (1 - decimal);
  });

  return Math.round(baseIdr * multiplier);
}

/**
 * SEARCH INDEXER
 * Creates the "Super Smart Search" string array
 */
export function generateSearchKeywords(product: Product): string[] {
  const combined = [
    product.brand,
    product.collectionName,
    product.category,
    product.productName,
    product.sku,
    product.finishing,
    product.location
  ].join(' ').toLowerCase();

  // Split by space and remove duplicates
  return [...new Set(combined.split(' '))].filter(k => k.length > 1);
}