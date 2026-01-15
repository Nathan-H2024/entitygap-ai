import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: :AIzaSyDqUgFoTVuGuyJemYWhg2xGnojNBP82qyY",
  authDomain: "entitygap-ai.firebaseapp.com",
  projectId: "entitygap-ai",
  storageBucket: "entitygap-ai.appspot.com",
  messagingSenderId: "592829622852",
  appId: "1:592829622852:web:b9b222ed1cb8c6516c2a11",
};

// Log for debugging (You can remove this after successful login)
console.log("Firebase App Initializing...");

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
