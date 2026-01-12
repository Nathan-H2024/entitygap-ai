import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Direct access to Vite environment variables
const apiKey = import.meta.env.VITE_GAP_API_KEY;
const appId = import.meta.env.VITE_GAP_APP_ID;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "entitygap-ai.firebaseapp.com",
  projectId: "entitygap-ai",
  storageBucket: "entitygap-ai.appspot.com",
  messagingSenderId: "592829622852",
  appId: appId,
  measurementId: "G-X8BERZNVLY"
};

// Log for debugging (You can remove this after successful login)
console.log("Firebase App Initializing...");

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let analytics: Analytics | undefined = undefined;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, auth, analytics };