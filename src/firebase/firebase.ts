
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjvFy51WgwAaQd6egpRffKekgFaPhiAFw",
  authDomain: "field-ops-auth.firebaseapp.com",
  projectId: "field-ops-auth",
  storageBucket: "field-ops-auth.firebasestorage.app",
  messagingSenderId: "610559082159",
  appId: "1:610559082159:web:35b67b659348c5bbaa1e5a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);



