import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STRAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MASSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
// let app = !getApps().length ? initializeApp(firebaseConfig):  getApp();
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  initializeFirestore(app, {
    ignoreUndefinedProperties: true,
  });
} else {
  app = getApp();
}

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app, "(default)");

export default db;