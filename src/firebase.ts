/// <reference types="vite/client" />
/// <reference types="vite/client" />
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Initialize Firebase configuration with the user-provided keys
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBazKvDqauUyaPP-zv1F6sku3IlxGg8pYw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "wolf-bc7ae.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "wolf-bc7ae",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "wolf-bc7ae.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "764680226456",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:764680226456:web:387bea4e8e707a1ba1f2ed",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-H3LEVZJZBP",
};

const databaseId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || "(default)";

// Initialize Firebase SDK
const app = initializeApp(config);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app, databaseId);

export default app;
