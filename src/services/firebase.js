// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfigOld = {
  apiKey: "AIzaSyDrQE28RqPlD8Gm3q5ivkP1QvORNHwFgzM",
  authDomain: "housing-portal-9e6bf.firebaseapp.com",
  projectId: "housing-portal-9e6bf",
  storageBucket: "housing-portal-9e6bf.appspot.com",
  messagingSenderId: "177447060300",
  appId: "1:177447060300:web:db6abc8b0c63cabe6a05e9",
};

const firebaseConfigNew = {
  apiKey: "AIzaSyAMQScf_fOYqW5ysg16elywwWbyRjoTWwM",
  authDomain: "yegna-housing.firebaseapp.com",
  projectId: "yegna-housing",
  storageBucket: "yegna-housing.appspot.com",
  messagingSenderId: "774595292885",
  appId: "1:774595292885:web:c6710c5a2d413e179f3c5c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfigOld);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
