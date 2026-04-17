/// <reference types="vite/client" />
/// <reference types="vite/client" />
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase configuration with fallback to environment variables for Vercel deployment
const config = {
  apiKey: firebaseConfig.apiKey || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: firebaseConfig.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: firebaseConfig.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: firebaseConfig.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseConfig.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseConfig.appId || import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: firebaseConfig.measurementId || import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const databaseId = firebaseConfig.firestoreDatabaseId || import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || "(default)";

// Initialize Firebase SDK
const app = initializeApp(config);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app, databaseId);

export default app;
