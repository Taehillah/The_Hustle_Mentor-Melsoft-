import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const requiredEnv = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
];

const envOrThrow = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing Firebase env var: ${key}`);
  }
  return value;
};

const firebaseConfig = {
  apiKey: envOrThrow("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: envOrThrow("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: envOrThrow("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: envOrThrow("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: envOrThrow("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: envOrThrow("NEXT_PUBLIC_FIREBASE_APP_ID"),
  measurementId: envOrThrow("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"),
};

requiredEnv.forEach(envOrThrow);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
