import { createContext, useEffect, useState, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  AuthErrorCodes,
} from "firebase/auth";
import { auth, db, storage } from "../services/firebase";
import {
  setDoc,
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  limit,
  endAt,
  startAt,
  startAfter,
  limitToLast,
  endBefore,
  where,
  onSnapshot,
} from "@firebase/firestore";
import useMainStore from "../components/store/mainStore";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  // Function to create a chat room between two users
  const createChatRoom = async (user1Id, user2Id, user1Name, user2Name) => {
    try {
      // Check if a chat room between these two users already exists
      const chatRoomsRef = collection(db, "chats");
      const user1ChatQuery = query(
        chatRoomsRef,
        where("user1Id", "==", user1Id),
        where("user2Id", "==", user2Id)
      );

      const user2ChatQuery = query(
        chatRoomsRef,
        where("user1Id", "==", user2Id),
        where("user2Id", "==", user1Id)
      );

      const [user1ChatSnapshot, user2ChatSnapshot] = await Promise.all([
        getDocs(user1ChatQuery),
        getDocs(user2ChatQuery),
      ]);

      let chatRoomId;

      if (!user1ChatSnapshot.empty) {
        // Chat room between user1 and user2 already exists, use its ID
        chatRoomId = user1ChatSnapshot.docs[0].id;
      } else if (!user2ChatSnapshot.empty) {
        // Chat room between user2 and user1 already exists, use its ID
        chatRoomId = user2ChatSnapshot.docs[0].id;
      } else {
        // Chat room doesn't exist, create a new one
        const chatRoomDocRef = await addDoc(chatRoomsRef, {
          user1Id,
          user2Id,
          messages: [],
          user1Name,
          user2Name,
          blockStatus: { user1Id: false, user2Id: false },
        });
        chatRoomId = chatRoomDocRef.id;
      }

      // Return the ID of the chat room
      return chatRoomId;
    } catch (error) {
      console.error("Error creating chat room:", error);
      throw error;
    }
  };

  const getMessageDataById = (messageId, setDataCallback) => {
    // Reference to the message document in Firestore
    const messageDocRef = doc(db, "chats", messageId);

    // Set up a real-time subscription to the Firestore document
    const unsubscribe = onSnapshot(
      messageDocRef,
      (doc) => {
        if (doc.exists()) {
          // Update the state using the callback function
          setDataCallback(doc.data());
        } else {
          console.log("Message not found");
          // You can also update the state here to indicate that the message was not found
          setDataCallback(null);
        }
      },
      (error) => {
        console.error("Error getting message data:", error);
      }
    );

    return unsubscribe;
  };

  const addMessageToChat = async (chatId, body, sender, senderName) => {
    try {
      // Assuming you already have logic to add the message to the chat document
      const chatDocRef = doc(db, "chats", chatId);
      const chatDocSnapshot = await getDoc(chatDocRef);

      if (!chatDocSnapshot.exists()) {
        throw new Error("Chat does not exist.");
      }

      const chatData = chatDocSnapshot.data();
      const messages = chatData.messages || [];
      const newMessage = {
        sender,
        senderName,
        timestamp: new Date(), // Use server timestamps in real implementation
        body,
      };

      // Add the new message to the chat's messages array
      messages.push(newMessage);

      // Update the chat document with the new message
      await updateDoc(chatDocRef, { messages });

      // Determine the recipient of the notification
      const recipientId =
        sender === chatData.user1Id ? chatData.user2Id : chatData.user1Id;

      // Create the notification object
      const notification = {
        type: "message",
        status: "unseen",
        chatRoomId: chatId,
        timestamp: new Date(), // Again, use server timestamps where applicable
        senderId: sender,
        recipientId: recipientId,
      };

      // Reference to the recipient's user document
      const recipientRef = doc(db, "users", recipientId);
      const recipientDoc = await getDoc(recipientRef);

      if (!recipientDoc.exists()) {
        throw new Error("Recipient does not exist.");
      }

      const recipientData = recipientDoc.data();
      const notifications = recipientData.notifications || [];

      // Add the new notification to the recipient's notifications array
      notifications.push(notification);

      // Update the recipient's user document with the new notification
      await updateDoc(recipientRef, { notifications });

      return newMessage;
    } catch (error) {
      console.error("Error adding message to chat:", error);
      throw error;
    }
  };

  const removeMessageNotificationsForChatRoom = async (userId, chatRoomId) => {
    try {
      // Reference to the user's document
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("User does not exist.");
      }

      let userData = userDoc.data();
      let notifications = userData.notifications || [];

      // Filter out message notifications for the specified chat room
      const filteredNotifications = notifications.filter(
        (notification) =>
          !(
            notification.type === "message" &&
            notification.chatRoomId === chatRoomId
          )
      );

      // Update the user's document with the filtered notifications
      await updateDoc(userRef, { notifications: filteredNotifications });

      // After successful Firestore update, also update the Zustand store
      const updatedNotifications = useMainStore
        .getState()
        .notifications.filter(
          (notification) =>
            !(
              notification.type === "message" &&
              notification.chatRoomId === chatRoomId
            )
        );
      useMainStore.getState().setNotifications(updatedNotifications);

      console.log("Message notifications for chat room removed successfully.");
    } catch (error) {
      console.error(
        "Error removing message notifications for chat room:",
        error
      );
      throw error;
    }
  };

  const resetUnreadCount = async (chatId, userId) => {
    try {
      // Reference to the chat document in Firestore
      const chatDocRef = doc(db, "chats", chatId);

      // Use Firestore's FieldValue to ensure atomic updates
      const updateData = {};
      updateData[`unreadCount.${userId}`] = 0;

      // Update the unreadCount for the user
      await updateDoc(chatDocRef, updateData);

      console.log("Reset unread count successfully");
    } catch (error) {
      console.error("Error resetting unread count:", error);
      throw error;
    }
  };

  const getAllUserMessages = async (userId) => {
    try {
      const chatRoomsRef = collection(db, "chats");
      const chatRoomSnapshots = await getDocs(chatRoomsRef);

      const userMessages = [];

      // Loop through the chat rooms and fetch their details
      for (const chatRoomSnapshot of chatRoomSnapshots.docs) {
        const chatRoomId = chatRoomSnapshot.id;
        const chatRoomData = chatRoomSnapshot.data();
        // Access the user IDs directly
        const user1Id = chatRoomData.user1Id;
        const user2Id = chatRoomData.user2Id;

        if (user1Id === userId || user2Id === userId) {
          // Fetch messages for this chat room
          const messagesData = chatRoomData || [];

          userMessages.push({
            chatRoomId,
            messagesData,
          });
        }
      }
      // Sort the messages by the timestamp of the last message in each chat room, newest first
      userMessages.sort((a, b) => {
        const lastTimestampA =
          a.messagesData.messages[a.messagesData.messages.length - 1]
            ?.timestamp;
        const lastTimestampB =
          b.messagesData.messages[b.messagesData.messages.length - 1]
            ?.timestamp;

        return lastTimestampB - lastTimestampA;
      });

      return userMessages;
    } catch (error) {
      console.error("Error getting user messages:", error);
      throw error;
    }
  };

  const countChats = async () => {
    try {
      const chatsCollectionRef = collection(db, "chats");
      const chatsSnapshot = await getDocs(chatsCollectionRef);
      return chatsSnapshot.size;
    } catch (error) {
      console.error("Error counting chats:", error);
      throw error;
    }
  };

  const countUnreadMessages = async (userId) => {
    try {
      // Reference to all chat rooms in Firestore
      const chatRoomsRef = collection(db, "chats");

      // Fetch chat rooms where the user is a participant
      const userChatQuery1 = query(
        chatRoomsRef,
        where("user1Id", "==", userId)
      );
      const userChatQuery2 = query(
        chatRoomsRef,
        where("user2Id", "==", userId)
      );

      const [userChatSnapshots1, userChatSnapshots2] = await Promise.all([
        getDocs(userChatQuery1),
        getDocs(userChatQuery2),
      ]);

      let totalUnreadCount = 0;

      // Sum the unread count from chat rooms where user is user1
      userChatSnapshots1.docs.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        totalUnreadCount += (data.unreadCount && data.unreadCount[userId]) || 0;
      });

      // Sum the unread count from chat rooms where user is user2
      userChatSnapshots2.docs.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        totalUnreadCount += (data.unreadCount && data.unreadCount[userId]) || 0;
      });
      return totalUnreadCount;
    } catch (error) {
      console.error("Error counting unread messages:", error);
      throw error;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        createChatRoom,
        getMessageDataById,
        addMessageToChat,
        getAllUserMessages,
        removeMessageNotificationsForChatRoom,
        countChats,
        resetUnreadCount,
        countUnreadMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the context
export const ChatAuth = () => {
  return useContext(ChatContext);
};
