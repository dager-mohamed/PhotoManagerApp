// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDU9mDwme3ibwjZvd-JwaCdTLbe968nxtQ",
    authDomain: "dagvy-7429a.firebaseapp.com",
    projectId: "dagvy-7429a",
    storageBucket: "dagvy-7429a.appspot.com",
    messagingSenderId: "1042504043220",
    appId: "1:1042504043220:web:7cb84afe0393cb87e28941",
    measurementId: "G-QTPHVQ6QXK"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
