// // signupAuth.js
// import firebase from "firebase/app";
// import "firebase/auth";
// import { app } from "./firebase";

// // Function to handle user signup
// export const signUpWithEmailAndPassword = async (email, password) => {
//   try {
//     const userCredential = await firebase
//       .auth(app)
//       .createUserWithEmailAndPassword(email, password);
//     return userCredential.user;
//   } catch (error) {
//     throw error;
//   }
// };
