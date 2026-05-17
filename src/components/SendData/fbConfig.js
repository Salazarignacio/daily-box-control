import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5cvmffjAKiKCgu_E1Al6LJ1051wnIUHM",
  authDomain: "caja-dce66.firebaseapp.com",
  projectId: "caja-dce66",
  storageBucket: "caja-dce66.appspot.com",
  messagingSenderId: "663072383299",
  appId: "1:663072383299:web:c8f81c2549419fd3260ff6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);



