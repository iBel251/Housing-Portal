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
} from "@firebase/firestore";
import { UserAuth } from "./AuthContext";

const RoommateContext = createContext();

export const RoommateContextProvider = ({ children }) => {
  const { user } = UserAuth();
  const updateRoommateData = async (houseId, updatedRoommateData) => {
    try {
      const houseRef = doc(db, "houses", houseId);
      // Update only the roommateData field of the house document
      await updateDoc(houseRef, {
        roommateData: updatedRoommateData,
      });
    } catch (error) {
      console.error("Error updating roommate data:", error);
      throw error;
    }
  };

  const toggleInterestInHouse = async (houseId, enrollingUserId, formData) => {
    console.log("enrollinguserid :", enrollingUserId);
    try {
      // Reference to the specific house document
      const houseRef = doc(db, "houses", houseId);
      const houseDoc = await getDoc(houseRef);
      if (!houseDoc.exists()) throw new Error("House does not exist.");
      let houseData = houseDoc.data();

      // Reference to the enrolling user's document
      const enrollingUserRef = doc(db, "users", enrollingUserId);
      const enrollingUserDoc = await getDoc(enrollingUserRef);
      if (!enrollingUserDoc.exists())
        throw new Error("Enrolling user does not exist.");
      let enrollingUserData = enrollingUserDoc.data();

      // Ensure the enrolling user has an appliedHouses array
      if (!enrollingUserData.appliedHouses)
        enrollingUserData.appliedHouses = [];

      // Ensure roommateData structure exists
      if (!houseData.roommateData) {
        houseData.roommateData = {
          interestedPeople: {},
          registeredPeople: {},
          preferences: [],
          commonRooms: [],
        };
      }

      // Reference to the house owner's data (assuming houseData.userId is the owner's ID)
      const ownerRef = doc(db, "users", houseData.userId);
      const ownerDoc = await getDoc(ownerRef);
      if (!ownerDoc.exists()) throw new Error("House owner does not exist.");
      let ownerData = ownerDoc.data();

      // Ensure the owner has a notifications array
      if (!ownerData.notifications) ownerData.notifications = [];

      if (formData) {
        // Enrollment: Add or update the enrolling user's data
        houseData.roommateData.interestedPeople[enrollingUserId] = formData;

        // Create a notification for the house owner
        const notification = {
          type: "enrollment",
          userId: enrollingUserId, // The ID of the user who is enrolling
          houseId: houseId,
          status: "unseen",
          date: new Date(),
        };
        ownerData.notifications.push(notification);
      } else {
        // Withdrawal: Remove the enrolling user's data and their notification
        delete houseData.roommateData.interestedPeople[enrollingUserId];
        ownerData.notifications = ownerData.notifications.filter(
          (notification) =>
            notification.userId !== enrollingUserId ||
            notification.houseId !== houseId
        );
      }

      // Update the house document
      await updateDoc(houseRef, {
        "roommateData.interestedPeople":
          houseData.roommateData.interestedPeople,
      });
      await updateDoc(enrollingUserRef, {
        appliedHouses: enrollingUserData.appliedHouses,
      });
      await toggleAppliedHouseForUser(enrollingUserId, houseId);
      // Update the house owner's notifications
      await updateDoc(ownerRef, { notifications: ownerData.notifications });
    } catch (error) {
      console.error("Error toggling interest in the house:", error);
      throw error;
    }
  };

  const toggleAppliedHouseForUser = async (userId, houseId) => {
    try {
      // Reference to the user's document
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("User does not exist.");
      }

      let userData = userDoc.data();
      let appliedHouses = userData.appliedHouses || [];

      if (appliedHouses.includes(houseId)) {
        // Remove the houseId if it's already in the array
        appliedHouses = appliedHouses.filter((id) => id !== houseId);
      } else {
        // Add the houseId if it's not in the array
        appliedHouses.push(houseId);
      }

      // Update the user's appliedHouses array
      await updateDoc(userRef, { appliedHouses });
      console.log("Successfully toggled applied house for user.");
    } catch (error) {
      console.error("Error toggling applied house for user:", error);
    }
  };

  const updateNotificationStatusToSeen = async (userId, houseId, status) => {
    try {
      // Reference to the user's document
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("User does not exist.");
      }

      let userData = userDoc.data();
      let notifications = userData.notifications || [];

      // Find the notification that matches the houseId and the enrollment type
      const updatedNotifications = notifications.map((notification) => {
        if (
          notification.houseId === houseId &&
          notification.userId === userId &&
          notification.type === "enrollment"
        ) {
          return { ...notification, status: status }; // Update status to 'seen'
        }
        return notification; // Return unchanged if not a match
      });

      // Update the user's document with the updated notifications array
      await updateDoc(userRef, { notifications: updatedNotifications });

      console.log("Notification status updated to seen successfully.");
    } catch (error) {
      console.error("Error updating notification status to seen:", error);
      throw error;
    }
  };

  return (
    <RoommateContext.Provider
      value={{
        updateRoommateData,
        toggleInterestInHouse,
        updateNotificationStatusToSeen,
      }}
    >
      {children}
    </RoommateContext.Provider>
  );
};

// Custom hook to use the RoommateContext
export const RoommateAuth = () => {
  return useContext(RoommateContext);
};

export default RoommateContextProvider;
