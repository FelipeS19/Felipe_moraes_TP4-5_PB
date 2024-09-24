//src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDB-NcuQayffWDDDvwtafK3bnP94v4BNKY",
  authDomain: "pb--sistema-de-gestao-acme.firebaseapp.com",
  projectId: "pb--sistema-de-gestao-acme",
  storageBucket: "pb--sistema-de-gestao-acme.appspot.com",
  messagingSenderId: "546295654635",
  appId: "1:546295654635:web:203238625ff76859c2f6ae",
  measurementId: "G-7618W6P657"
};


const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp); 

export { auth, signInWithEmailAndPassword,db };
