const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
require("dotenv").config();
console.log("FIREBASE_API_KEY:", process.env.FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

console.log("[FIREBASE] Firebase config values:");
Object.entries(firebaseConfig).forEach(([key, value]) => {
  console.log(`  ${key}:`, value);
});

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

console.log(
  "[FIREBASE] Initialized Firebase app with projectId:",
  firebaseConfig.projectId
);

module.exports = { db, firebaseApp };
