import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  onSnapshot,
  query,
  orderBy,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Banner } from '../types';

export type { Product, Banner };

const PRODUCTS_COLLECTION = 'products';
const BANNERS_COLLECTION = 'banners';

export const productService = {
  // Get all products real-time
  subscribeProducts: (callback: (products: Product[]) => void) => {
    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('clicks', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      callback(products);
    }, (error) => console.error("Firestore Product Error:", error));
  },

  // Add Product
  addProduct: async (product: Omit<Product, 'id' | 'clicks'>) => {
    return await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...product,
      clicks: 0,
      lastClickedAt: null
    });
  },

  // Update Product
  updateProduct: async (id: string, product: Partial<Product>) => {
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    return await updateDoc(productRef, product);
  },

  // Delete Product
  deleteProduct: async (id: string) => {
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    return await deleteDoc(productRef);
  },

  // Track Click
  trackClick: async (id: string) => {
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(productRef, {
      clicks: increment(1),
      lastClickedAt: serverTimestamp()
    });
  },

  // Banners
  subscribeBanners: (callback: (banners: Banner[]) => void) => {
    return onSnapshot(collection(db, BANNERS_COLLECTION), (snapshot) => {
      const banners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
      callback(banners);
    }, (error) => console.error("Firestore Banner Error:", error));
  },

  addBanner: async (banner: Omit<Banner, 'id'>) => {
    return await addDoc(collection(db, BANNERS_COLLECTION), banner);
  },

  deleteBanner: async (id: string) => {
    return await deleteDoc(doc(db, BANNERS_COLLECTION, id));
  }
};
