import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBtaFULbZfmlbcJARXkc912RfUqnbC5IJs",
  authDomain: "netfree-coral.firebaseapp.com",
  projectId: "netfree-coral",
  storageBucket: "netfree-coral.firebasestorage.app",
  messagingSenderId: "293784956504",
  appId: "1:293784956504:web:f124688d07b2694d17242d",
  measurementId: "G-P023T07P8H"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
