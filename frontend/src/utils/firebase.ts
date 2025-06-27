// initialize firebase in app and create object
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDAwJpgjoL6ujOP8xrUM0HQNg5Q8k9fN_A",
  authDomain: "brianna-flores-capstone-c61dd.firebaseapp.com",
  projectId: "brianna-flores-capstone-c61dd",
  storageBucket: "brianna-flores-capstone-c61dd.firebasestorage.app",
  messagingSenderId: "948923171194",
  appId: "1:948923171194:web:990de33daac6fd201d96c3",
  measurementId: "G-VTGPZ429HH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log(auth)

export { auth }