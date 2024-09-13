// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';  // Make sure this import is correct

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEHtZ5Nr4IayTRA0AUzWyl0lXoxarEg0g",
  authDomain: "nsuu-e5c72.firebaseapp.com",
  projectId: "nsuu-e5c72",
  storageBucket: "nsuu-e5c72.appspot.com",
  messagingSenderId: "169476878220",
  appId: "1:169476878220:web:027c19b5bb3e56e429f0a9",
  measurementId: "G-2PJE6V2GNH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Storage (if you need to upload files)
const storage = getStorage(app);



// Initialize other Firebase services
const firestore = getFirestore(app);
const auth = getAuth(app);
export { firestore, auth,storage };