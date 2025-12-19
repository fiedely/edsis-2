import { useState, useEffect, useMemo } from 'react';
import { getProducts } from '../services/products';
import type { Product } from '../types/inventory';

export type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc';

// This defines our "Tree" structure for the UI
export interface CatalogGroup {
  key: string;
  level: number;
  count: number;
  children?: CatalogGroup[];
  products?: Product[];
}

export function useCatalog(activeViewId: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name_asc');

  // 1. Fetch Data
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load catalog:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Filter (Smart Search)
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    
    const queryParts = searchQuery.toLowerCase().split(' ').filter(q => q.length > 0);
    
    return products.filter(p => {
      // Check if ALL query parts match somewhere in the keywords
      // This enables "gullo blue sofa" to match "Gullo Sofa (Blue)"
      const keywords = (p.searchKeywords || []).join(' ');
      return queryParts.every(part => keywords.includes(part));
    });
  }, [products, searchQuery]);

  // 3. Sort (Leaf Nodes)
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortOption) {
        case 'name_asc': return a.productName.localeCompare(b.productName);
        case 'name_desc': return b.productName.localeCompare(a.productName);
        case 'price_asc': return (a.priceIdr || 0) - (b.priceIdr || 0);
        case 'price_desc': return (b.priceIdr || 0) - (a.priceIdr || 0);
        default: return 0;
      }
    });
  }, [filteredProducts, sortOption]);

  // 4. Grouping Logic (The Core Requirement)
  const groupedCatalog = useMemo(() => {
    // Helper to group array by key
    const groupBy = (list: Product[], keyFn: (p: Product) => string) => {
      const groups: Record<string, Product[]> = {};
      list.forEach(p => {
        const k = keyFn(p) || 'Unknown';
        if (!groups[k]) groups[k] = [];
        groups[k].push(p);
      });
      return groups;
    };

    // Helper to sort keys
    const getSortedKeys = (groups: Record<string, any>) => Object.keys(groups).sort();

    // VIEW 1: Brand -> Category -> Products
    if (activeViewId === '1') {
      const byBrand = groupBy(sortedProducts, p => p.brand);
      return getSortedKeys(byBrand).map(brand => {
        const byCat = groupBy(byBrand[brand], p => p.category);
        return {
          key: brand,
          level: 0,
          count: byBrand[brand].length,
          children: getSortedKeys(byCat).map(cat => ({
            key: cat,
            level: 1,
            count: byCat[cat].length,
            products: byCat[cat] // Leaf node
          }))
        };
      });
    }

    // VIEW 2: Category -> Brand -> Products
    if (activeViewId === '2') {
      const byCat = groupBy(sortedProducts, p => p.category);
      return getSortedKeys(byCat).map(cat => {
        const byBrand = groupBy(byCat[cat], p => p.brand);
        return {
          key: cat,
          level: 0,
          count: byCat[cat].length,
          children: getSortedKeys(byBrand).map(brand => ({
            key: brand,
            level: 1,
            count: byBrand[brand].length,
            products: byBrand[brand]
          }))
        };
      });
    }

    // VIEW 3: Location -> Products
    if (activeViewId === '3') {
      const byLoc = groupBy(sortedProducts, p => p.location);
      return getSortedKeys(byLoc).map(loc => ({
        key: loc,
        level: 0,
        count: byLoc[loc].length,
        products: byLoc[loc]
      }));
    }

    // VIEW 4/5: Flat List (No Groups)
    return [{
      key: 'All Products',
      level: 0,
      count: sortedProducts.length,
      products: sortedProducts
    }];

  }, [sortedProducts, activeViewId]);

  return {
    loading,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    groupedCatalog,
    totalCount: filteredProducts.length
  };
}