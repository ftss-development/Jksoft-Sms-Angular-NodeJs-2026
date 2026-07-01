import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBAL6qf_YFTszSRUtkwnr4TwhH37GLp0hA",
  authDomain: "jksoft-sms-db.firebaseapp.com",
  projectId: "jksoft-sms-db",
  storageBucket: "jksoft-sms-db.firebasestorage.app",
  messagingSenderId: "102658223110",
  appId: "1:102658223110:web:2c2e9f22e4f2ef997fe787",
  measurementId: "G-3950HKLSEF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
