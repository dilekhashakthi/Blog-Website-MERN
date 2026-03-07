// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-4f0ae.firebaseapp.com",
  projectId: "mern-blog-4f0ae",
  storageBucket: "mern-blog-4f0ae.firebasestorage.app",
  messagingSenderId: "565722385692",
  appId: "1:565722385692:web:a358480419040877a97ed9",
  measurementId: "G-VYGZZK9YPZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);