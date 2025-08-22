import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "affiliateace-a4ggb",
  "appId": "1:223377863:web:3411915d1f0850651501e2",
  "storageBucket": "affiliateace-a4ggb.firebasestorage.app",
  "apiKey": "AIzaSyBwoSOq_Kj_8ZO4oFiRLU5mozIgdae78SE",
  "authDomain": "affiliateace-a4ggb.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "223377863"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
