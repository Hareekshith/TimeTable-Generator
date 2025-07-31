// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASKBC_4ftE_U_uNfIhHlvk1UKJH1Ysjr4",
  authDomain: "stmg-bf25f.firebaseapp.com",
  projectId: "stmg-bf25f",
  storageBucket: "stmg-bf25f.firebasestorage.app",
  messagingSenderId: "855982754520",
  appId: "1:855982754520:web:ef43fefe70df3de36225ad",
  measurementId: "G-XKD2M1WYCS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
