// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// My web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_rlJIsxAJGzPqMZqq5BX6l9eEM8KQU2g",
  authDomain: "surau-digital-display.firebaseapp.com",
  projectId: "surau-digital-display",
  storageBucket: "surau-digital-display.firebasestorage.app",
  messagingSenderId: "968646006236",
  appId: "1:968646006236:web:1cbd212aaec55d12172b19",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
