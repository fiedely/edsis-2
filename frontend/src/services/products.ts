import { 
    collection, doc, getDocs, setDoc 
  } from 'firebase/firestore';
  import { db } from '../firebase';
  import type { Product } from '../types/inventory';
  
  export const getProducts = async (): Promise<Product[]> => {
    try {
      // FIX: Removed 'orderBy' to ensure we get ALL documents regardless of index status
      const colRef = collection(db, 'products');
      const snap = await getDocs(colRef);
      
      console.log(`[getProducts] Fetched ${snap.size} items`); // Debug Log
      
      return snap.docs.map(d => d.data() as Product);
    } catch (error) {
      console.error("[getProducts] Error:", error);
      throw error;
    }
  };
  
  export const addProduct = async (product: Product) => {
    const ref = doc(db, 'products', product.id);
    await setDoc(ref, product);
  };