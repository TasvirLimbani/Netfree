// src/authService.js
import { auth, googleProvider, db } from "./FirebaseSetup.js";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
const getDeviceType = () => {
  const userAgent = navigator.userAgent;
  if (/Mobi|Android/i.test(userAgent)) {
    return "mobile";
  }
  return "web";
};
export const signup = async (email, password, name) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;

  const deviceType = getDeviceType();
  const createdAt = new Date();

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: name,
    authProvider: "email",
    email: email,
    password: password,
    type: deviceType,
    createdAt: createdAt,
  });
};

export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async () => {
  const res = await signInWithPopup(auth, googleProvider);
  const user = res.user;
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      name: user.displayName,
      authProvider: "google",
      email: user.email,
    },
    { merge: true }
  );
};

export const forgotPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};
