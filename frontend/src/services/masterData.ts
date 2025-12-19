import { 
    collection, doc, getDocs, setDoc, updateDoc, arrayUnion 
    // FIX: Removed 'arrayRemove' (unused)
  } from 'firebase/firestore';
  import { db } from '../firebase';
  // FIX: Added 'type' keyword for strict import
  import type { Brand, Category } from '../types/inventory';
  
  // --- BRANDS ---
  
  export const getBrands = async (): Promise<Brand[]> => {
    const snap = await getDocs(collection(db, 'brands'));
    return snap.docs.map(d => d.data() as Brand).sort((a, b) => a.name.localeCompare(b.name));
  };
  
  export const addBrand = async (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    const ref = doc(db, 'brands', id);
    await setDoc(ref, { id, name, collections: [] });
  };
  
  export const addCollectionToBrand = async (brandId: string, collectionName: string) => {
    const ref = doc(db, 'brands', brandId);
    await updateDoc(ref, {
      collections: arrayUnion(collectionName)
    });
  };
  
  // --- CATEGORIES ---
  
  export const getCategories = async (): Promise<Category[]> => {
    const snap = await getDocs(collection(db, 'categories'));
    return snap.docs.map(d => d.data() as Category).sort((a, b) => a.name.localeCompare(b.name));
  };
  
  export const addCategory = async (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    const ref = doc(db, 'categories', id);
    await setDoc(ref, { id, name });
  };