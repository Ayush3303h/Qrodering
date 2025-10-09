import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";          // ✅ ADD THIS LINE
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAczbs5Mhgq7MjF-qn7Sl0cxS-YyLtB0RM",
  authDomain: "streake.firebaseapp.com",
  projectId: "streake",
  storageBucket: "streake.firebasestorage.app",   // ✅ Check this spelling
  messagingSenderId: "558427518449",
  appId: "1:558427518449:web:e64f499b251f31eb07c050"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
