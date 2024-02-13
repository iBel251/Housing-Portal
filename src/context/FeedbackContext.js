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

const FeedbackContext = createContext();

export const FeedbackContextProvider = ({ children }) => {
  const { user } = UserAuth();
  const userData = useMainStore((state) => state.userData);
  const addOrUpdateFeedbackForHouse = async (houseId, rating, comment) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }
    const fullName = userData.firstName + " " + userData.lastName;
    const feedbackKey = `feedback.${user.uid}`; // Key path for the user's feedback
    const feedback = {
      rating: rating,
      comment: comment,
      likes: 0, // Initialize likes and dislikes if not provided
      dislikes: 0,
      senderName: fullName,
      date: new Date(),
    };

    try {
      const houseRef = doc(db, "houses", houseId);

      // Prepare the update object
      const updateObject = {};
      updateObject[feedbackKey] = feedback;

      // Update the house document with the new or updated feedback
      await updateDoc(houseRef, updateObject);

      console.log("Feedback added or updated successfully");
    } catch (error) {
      console.error("Error adding or updating feedback:", error);
    }
  };

  const submitReport = async (reportType, targetId, message) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    const reportDocPath =
      reportType === "house" ? "houseReports" : "userReports";
    const reportRef = doc(db, "adminSite", reportDocPath);

    try {
      const docSnap = await getDoc(reportRef);
      let reports = docSnap.exists() ? docSnap.data()[targetId] || [] : [];
      const existingReportIndex = reports.findIndex(
        (report) => report.reporterId === user.uid
      );

      const newReport = {
        reporterId: user.uid,
        message: message,
        date: new Date(),
      };

      if (existingReportIndex !== -1) {
        // Replace the existing report with the new report
        reports[existingReportIndex] = newReport;
      } else {
        // Add the new report to the array
        reports.push(newReport);
      }

      // Update the document with the new reports array
      await updateDoc(reportRef, {
        [targetId]: reports,
      });

      console.log("Report submitted successfully");
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  const toggleUserInBlockedList = async (userIdToToggle, chatRoomId) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid); // Reference to the current user's document
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        let userData = docSnap.data();
        let blockedList = userData.blockedList || []; // Ensure blockedList is always an array
        let isBlocked = false; // Flag to indicate if the user was blocked or unblocked

        // Check if the user is in the blocked list
        if (blockedList.includes(userIdToToggle)) {
          // User is currently blocked, so unblock them
          blockedList = blockedList.filter((id) => id !== userIdToToggle);
          isBlocked = false;
        } else {
          // User is not blocked, so block them
          blockedList.push(userIdToToggle);
          isBlocked = true;
        }

        // Update the user document with the new or modified blockedList
        await updateDoc(userRef, { blockedList: blockedList });
        console.log("BlockedList updated successfully");

        // Additional safety check before accessing chat room data
        if (chatRoomId) {
          const chatRoomRef = doc(db, "chats", chatRoomId);
          await updateDoc(chatRoomRef, {
            [`blockStatus.${userIdToToggle}`]: isBlocked, // Update block status in the chat room
          });
          console.log(`Chat room ${chatRoomId} updated with block status.`);
        } else {
          console.warn("No chatRoomId provided, skipping chat room update.");
        }
      } else {
        console.error("User document does not exist");
      }
    } catch (error) {
      console.error("Error updating blockedList and chat room:", error);
    }
  };

  return (
    <FeedbackContext.Provider
      value={{
        addOrUpdateFeedbackForHouse,
        submitReport,
        toggleUserInBlockedList,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

// Custom hook to use the RoommateContext
export const FeedbackAuth = () => {
  return useContext(FeedbackContext);
};

export default FeedbackContextProvider;
