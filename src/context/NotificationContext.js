import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, query, where, onSnapshot, doc } from "@firebase/firestore";
import { UserAuth } from "./AuthContext";
import { ChatAuth } from "./ChatContext";
import useMainStore from "../components/store/mainStore";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = UserAuth();
  const { getAllUserMessages } = ChatAuth();
  const setNotifications = useMainStore((state) => state.setNotifications);
  const setMessages = useMainStore((state) => state.setMessages);
  const messagesRefetch = useMainStore((state) => state.refetchMessagesTrigger);
  const refetchMessages = useMainStore((state) => state.toggleMessagesRefetch);

  useEffect(() => {
    if (!user?.uid) return;

    // Notifications subscription
    const notificationUnsubscribe = onSnapshot(
      doc(db, "users", user.uid),
      (docSnapshot) => {
        const userData = docSnapshot.data();
        setNotifications(userData.notifications || []);

        // Check for new message notifications
        const hasNewMessageNotification = userData.notifications?.some(
          (notification) => notification.type === "message"
        );
        if (hasNewMessageNotification) {
          // Trigger refetch of messages
          refetchMessages(); // Assuming this function toggles a Zustand state that causes a refetch
        }
      }
    );

    // Cleanup function
    return () => {
      notificationUnsubscribe();
    };
  }, [user, setNotifications, refetchMessages]);

  useEffect(() => {
    if (user?.uid) {
      const fetchAndStoreMessages = async () => {
        try {
          const messages = await getAllUserMessages(user.uid);
          setMessages(messages); // Update Zustand store with fetched messages
        } catch (error) {
          console.error("Error fetching user messages:", error);
        }
      };

      fetchAndStoreMessages();
    }
  }, [messagesRefetch, user?.uid]);

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
};
