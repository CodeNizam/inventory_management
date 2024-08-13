// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIKlSj4h7_k7bW4JcKG5OuSyyxWz6C7aw",
  authDomain: "inventory-management-1d1e3.firebaseapp.com",
  projectId: "inventory-management-1d1e3",
  storageBucket: "inventory-management-1d1e3.appspot.com",
  messagingSenderId: "403516363146",
  appId: "1:403516363146:web:50b1a86de223a28bcf3873",
  measurementId: "G-YK7ZRV6GPX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export { firestore };