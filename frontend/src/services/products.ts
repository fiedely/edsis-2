import { 
    collection, doc, getDocs, setDoc, query, orderBy 
  } from 'firebase/firestore';
  import { db } from '../firebase';
  import type { Product } from '../types/inventory';
  
  export const getProducts = async (): Promise<Product[]> => {
    // Fetch all products, sorted by created date (newest first)
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Product);
  };
  
  export const addProduct = async (product: Product) => {
    // We use the Product ID as the document ID for easy reference
    const ref = doc(db, 'products', product.id);
    await setDoc(ref, product);
  };