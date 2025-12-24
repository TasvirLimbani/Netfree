import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics"; // <-- import Analytics

const firebaseConfig = {
  apiKey: "AIzaSyBtaFULbZfmlbcJARXkc912RfUqnbC5IJs",
  authDomain: "netfree-coral.firebaseapp.com",
  projectId: "netfree-coral",
  storageBucket: "netfree-coral.firebasestorage.app",
  messagingSenderId: "293784956504",
  appId: "1:293784956504:web:f124688d07b2694d17242d",
  measurementId: "G-P023T07P8H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null; 
// Note: Firebase Analytics only works in the browser, so we check for window

export default app;
