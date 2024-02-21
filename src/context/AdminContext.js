import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../services/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  arrayUnion,
} from "@firebase/firestore";
import { UserAuth } from "./AuthContext";
import useMainStore from "../components/store/mainStore";

const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const { user } = UserAuth();
  const userData = useMainStore((state) => state.userData);

  const fetchAllUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      console.log("Fetched all users successfully");
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  // Function to fetch admin data from the adminSite collection
  const fetchAdminData = async () => {
    try {
      const collectionRef = collection(db, "adminSite"); // Reference to the adminSite collection
      const querySnapshot = await getDocs(collectionRef);
      let adminData = [];
      querySnapshot.forEach((doc) => {
        adminData.push({ id: doc.id, ...doc.data() }); // Combine document ID with its data
      });
      console.log("Fetched admin data successfully");
      return adminData; // Returns an array of all documents in the adminSite collection
    } catch (error) {
      console.error("Error fetching admin data:", error);
      return [];
    }
  };

  const setStatus = async (type, id, status) => {
    if (!user) {
      console.error("Admin user not logged in");
      return;
    }

    try {
      const docRef = doc(db, type === "user" ? "users" : "houses", id);
      await updateDoc(docRef, { status: status });
      console.log(
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } status updated successfully`
      );
    } catch (error) {
      console.error(`Error setting status on ${type}:`, error);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        fetchAdminData,
        fetchAllUsers,
        setStatus,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook to use the RoommateContext
export const AdminAuth = () => {
  return useContext(AdminContext);
};

export default AdminContextProvider;
