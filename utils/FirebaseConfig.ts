import Constants from "expo-constants";
import { initializeApp } from "firebase/app";

const {firebaseApiKey,firebaseAuthDomain,firebaseProjectId,firebaseStorageBucket,firebaseMessagingSenderId,firebaseAppId} = Constants.expoConfig?.extra || {};

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId
};

export const app = initializeApp(firebaseConfig);
