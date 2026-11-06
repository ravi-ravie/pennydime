import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyBJS6X-I02tZ7pJBtg9DDGbY9tgrYrCXnQ",
  authDomain: "pennydime-auth.firebaseapp.com",
  projectId: "pennydime-auth",
  storageBucket: "pennydime-auth.firebasestorage.app",
  messagingSenderId: "215778342791",
  appId: "1:215778342791:web:984767ba67f01cb3f24522",
  measurementId: "G-LBQF3840NL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); 