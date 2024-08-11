// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKeQZJv4-nkdKiB-fmyHoVGOGPs3hQn8Y",
  authDomain: "inventory-management-efe35.firebaseapp.com",
  projectId: "inventory-management-efe35",
  storageBucket: "inventory-management-efe35.appspot.com",
  messagingSenderId: "877790921294",
  appId: "1:877790921294:web:3b715238ad71be3fe7f91f",
  measurementId: "G-L9Y17TG5F3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

export {firestore, storage}