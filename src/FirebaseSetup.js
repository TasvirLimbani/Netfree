// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxGTNoRirKf90XGPHd6q7Y2PTrWHvyz4g",
  authDomain: "netfree-co.firebaseapp.com",
  projectId: "netfree-co",
  storageBucket: "netfree-co.firebasestorage.app",
  messagingSenderId: "707360894491",
  appId: "1:707360894491:web:1f5fbd7400c1e7594752be",
  measurementId: "G-MV2QVXGH23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore database
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
// const db = getFirestore(app);

// export { db };

