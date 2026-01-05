
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Helper to safely access process.env in browser without crashing
const env = (key: string) => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || 
           process.env[`REACT_APP_${key}`] || 
           process.env[`VITE_${key}`];
  }
  return undefined;
};

// Configuration
const apiKey = env("FIREBASE_API_KEY");
const isConfigValid = apiKey && apiKey !== "AIzaSy_PLACEHOLDER_KEY";

const firebaseConfig = {
  apiKey: apiKey || "AIzaSy_PLACEHOLDER_KEY",
  authDomain: env("FIREBASE_AUTH_DOMAIN") || "placeholder.firebaseapp.com",
  projectId: env("FIREBASE_PROJECT_ID") || "placeholder-project",
  storageBucket: env("FIREBASE_STORAGE_BUCKET") || "placeholder.appspot.com",
  messagingSenderId: env("FIREBASE_MESSAGING_SENDER_ID") || "0000000000",
  appId: env("FIREBASE_APP_ID") || "1:0000000000:web:placeholder",
  measurementId: env("FIREBASE_MEASUREMENT_ID")
};

let app: any;
let db: any;
let auth: any;
let analytics: Analytics | undefined = undefined;

if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    if (typeof window !== "undefined") {
      isSupported().then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      }).catch((err) => {
        console.warn("Firebase Analytics not supported in this environment:", err);
      });
    }
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
  }
} else {
  console.warn("Firebase Configuration missing or invalid. App running in Offline/Demo Mode.");
}

export { db, auth, analytics };
