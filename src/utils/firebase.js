// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoAaAflICYWEOMJtGOsc3ffHJaOE0_Ve4",
  authDomain: "do-note-3f1f7.firebaseapp.com",
  projectId: "do-note-3f1f7",
  storageBucket: "do-note-3f1f7.appspot.com",
  messagingSenderId: "427584178179",
  appId: "1:427584178179:web:be1b62d644e53c26466636",
  measurementId: "G-4QTM4TGKFD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
