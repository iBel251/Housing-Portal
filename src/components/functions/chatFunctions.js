import React, { useContext, useState } from "react";
import useMainStore from "../store/mainStore";
import { HouseAuth } from "../../context/HouseContext";
import { UserAuth } from "../../context/AuthContext";
import { ChatAuth } from "../../context/ChatContext";

export function useToggleFavorites() {
  const { toggleHouseInFavorites } = HouseAuth();
  const { user } = UserAuth();
  const { userData, setUserData } = useMainStore();

  const toggleFavorites = async (houseId) => {
    const userId = user.uid;

    // Check if the house ID is already in the user's favorites
    const isFavorite = userData.favorites.includes(houseId);

    // Update the favorites array accordingly
    const updatedFavorites = isFavorite
      ? userData.favorites.filter((id) => id !== houseId)
      : [...userData.favorites, houseId];

    // Update the userData in the Zustand store
    setUserData({ ...userData, favorites: updatedFavorites });

    // Call the async function to update favorites in the HouseAuth context
    await toggleHouseInFavorites(userId, houseId);
  };

  return toggleFavorites;
}

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

const ChatFunctions = () => {
  return <div>Chat Functions</div>;
};

export default ChatFunctions;
