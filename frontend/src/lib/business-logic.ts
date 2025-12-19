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

export function calculateNettPrice(baseIdr: number, discounts: Discount[]): number {
  let multiplier = 1;
  const now = new Date();
  const validDiscounts = discounts.filter(d => 
    d.isActive && 
    d.startDate.toDate() <= now && 
    d.endDate.toDate() >= now
  );
  validDiscounts.forEach(d => {
    const decimal = d.value / 100;
    multiplier = multiplier * (1 - decimal);
  });
  return Math.round(baseIdr * multiplier);
}

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

  return [...new Set(combined.split(' '))].filter(k => k.length > 1);
}