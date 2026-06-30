import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRdsPUhVmSdJ-_EHiUga6kn_yBTA0iLTA",
  authDomain: "long-wind-w0bnn.firebaseapp.com",
  projectId: "long-wind-w0bnn",
  storageBucket: "long-wind-w0bnn.firebasestorage.app",
  messagingSenderId: "169086042836",
  appId: "1:169086042836:web:fb29d04f1fad9e9ce2b141"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-coachingos-3266f67a-9b54-4aa9-978d-ca299a162f6f");
