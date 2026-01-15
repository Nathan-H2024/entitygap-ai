import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Direct access to Vite environment variables
const apiKey = import.meta.env.VITE_GAP_API_KEY;
const appId = import.meta.env.VITE_GAP_APP_ID;

const firebaseConfig = {
  apiKey: :AIzaSyDqUgFoTVuGuyJemYWhg2xGnojNBP82qyY",
  authDomain: "entitygap-ai.firebaseapp.com",
  projectId: "entitygap-ai",
  storageBucket: "entitygap-ai.appspot.com",
  messagingSenderId: "592829622852",
  appId: "1:592829622852:web:b9b222ed1cb8c6516c2a11",
  measurementId: "G-X8BERZNVLY"
};

// Log for debugging (You can remove this after successful login)
console.log("Firebase App Initializing...");

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

let analytics: Analytics | undefined = undefined;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, auth, analytics };