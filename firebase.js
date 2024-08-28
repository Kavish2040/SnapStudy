// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZgWtvwvhqRURgrCTFSR2Mjq9VliSLfoc",
  authDomain: "flashcardsaas-ccc47.firebaseapp.com",
  projectId: "flashcardsaas-ccc47",
  storageBucket: "flashcardsaas-ccc47.appspot.com",
  messagingSenderId: "978228746679",
  appId: "1:978228746679:web:264d2642acf66cc20e7032",
  measurementId: "G-R9ZLMM40FD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export {db}
