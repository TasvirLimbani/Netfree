// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCxGTNoRirKf90XGPHd6q7Y2PTrWHvyz4g",
    authDomain: "netfree-co.firebaseapp.com",
    projectId: "netfree-co",
    storageBucket: "netfree-co.firebasestorage.app",
    messagingSenderId: "707360894491",
    appId: "1:707360894491:web:1f5fbd7400c1e7594752be"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);