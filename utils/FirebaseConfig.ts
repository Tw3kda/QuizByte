import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const {firebaseApiKey,firebaseAuthDomain,firebaseProjectId,firebaseStorageBucket,firebaseMessagingSenderId,firebaseAppId} = Constants.expoConfig?.extra || {};

const firebaseConfig = {
  apiKey: "AIzaSyAQwlnGr62eh_dui8wlIjgLYGR4hwXgQz0",
  authDomain: "quizbyte-nico-santi.firebaseapp.com",
  projectId: "quizbyte-nico-santi",
  storageBucket: "quizbyte-nico-santi.firebasestorage.app",
  messagingSenderId: "169267267554",
  appId: "1:169267267554:web:1476fa991cd686029d1bbb"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
