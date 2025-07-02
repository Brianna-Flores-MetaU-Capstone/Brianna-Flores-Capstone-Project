// initialize firebase in app and create object
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDAwJpgjoL6ujOP8xrUM0HQNg5Q8k9fN_A",
  authDomain: "brianna-flores-capstone-c61dd.firebaseapp.com",
  projectId: "brianna-flores-capstone-c61dd",
  storageBucket: "brianna-flores-capstone-c61dd.firebasestorage.app",
  messagingSenderId: "948923171194",
  appId: "1:948923171194:web:990de33daac6fd201d96c3",
  measurementId: "G-VTGPZ429HH"
};

const errorCodes: {[errorMessage: string]: string} = {
  "auth/email-already-in-use": "Email already in use, try to login",
  "auth/internal-error": "Internal error, please try again",
  "auth/invalid-email": "Please enter a valid email",
  "auth/password-does-not-meet-requirements": "Password must be at least 8 characters long",
  "auth/invalid-credential": "Login failed",
  "auth/wrong-password": "Login failed"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, errorCodes }