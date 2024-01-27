import React, { useContext, useState } from "react";
import useMainStore from "../store/mainStore";
import { HouseAuth } from "../../context/HouseContext";
import { UserAuth } from "../../context/AuthContext";
import { ChatAuth } from "../../context/ChatContext";

export function useStartMessage(house) {
  const [chatRoomId, setChatRoomId] = useState(null);
  const { userData } = useMainStore();
  const { createChatRoom } = ChatAuth();
  const { user } = UserAuth();

  const handleChat = async () => {
    if (!userData.houseId) {
      console.log("Register your house first.");
      return;
    }
    if (user && house.userId && user.uid !== house.userId) {
      // Create a chat room between the user and the house owner
      const newChatRoomId = await createChatRoom(
        user.uid,
        house.userId,
        userData.firstName + " " + userData.lastName, // fullName
        house.owner
      );
      setChatRoomId(newChatRoomId);
    } else if (user.uid === house.userId) {
      console.log("This is your own house");
    } else {
      console.error("User or house owner ID not found");
    }
  };

  return { handleChat, chatRoomId };
}

export function useFetchUserDataById() {
  const { getUserDataById } = UserAuth();
  const setUserData = useMainStore((state) => state.setUserData);

  const fetchUserData = async (userId) => {
    try {
      // Fetch user data by userId

      const userData = await getUserDataById(userId);

      // Update the Zustand store with the fetched user data
      setUserData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return fetchUserData;
}

const userFunctions = () => {
  return <div>Chat Functions</div>;
};

export default userFunctions;
