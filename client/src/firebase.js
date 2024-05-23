// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "two-forty-two.firebaseapp.com",
  projectId: "two-forty-two",
  storageBucket: "two-forty-two.appspot.com",
  messagingSenderId: "522887105032",
  appId: "1:522887105032:web:ea6fff75eac768260f9fbd"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);