import React, { useEffect } from "react";
import useMainStore from "./store/mainStore";
import { UserAuth } from "../context/AuthContext";
import { HouseAuth } from "../context/HouseContext";
import { ChatAuth } from "../context/ChatContext";
import { useState } from "react";

const StoreInitializer = () => {
  const { getUserDataById, user } = UserAuth();
  const {
    getHouseDetailsById,
    getTotalHouseCount,
    getFevoriteHousesByIds,
    fetchAllHouses,
  } = HouseAuth();
  const { countUnreadMessages } = ChatAuth();
  const refetchTrigger = useMainStore((state) => state.refetchTrigger);
  const recountTrigger = useMainStore((state) => state.recountTrigger);
  const [favoriteHouseIds, setFavoriteHouseIds] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(user ? user.uid : null);
  }, [user]);

  useEffect(() => {
    if (userId) {
      const fetchUserDataAndHouseData = async () => {
        try {
          const userData = await getUserDataById(userId);
          if (userData) {
            // Store the userData in Zustand store
            useMainStore.getState().setUserData(userData);

            // Check if houseId exists in userData
            if (userData.houseId) {
              const houseData = await getHouseDetailsById(userData.houseId[0]);
              if (houseData) {
                // Store the houseData in Zustand store
                useMainStore.getState().setUserHouse(houseData);
              } else {
                console.log("House data not found");
              }
            }
            if (userData.favorites) {
              setFavoriteHouseIds(userData.favorites);
            }
          } else {
            console.log("User data not found");
          }
        } catch (error) {
          console.log("Error fetching user and house data:", error);
        }
      };

      fetchUserDataAndHouseData();
    }
  }, [userId, refetchTrigger]);

  useEffect(() => {
    const fetchAllHousesData = async () => {
      try {
        const houses = await fetchAllHouses();
        if (houses) {
          // Store the houses data in Zustand store
          useMainStore.getState().setAllHouses(houses);
        } else {
          console.log("No houses found");
        }
      } catch (error) {
        console.log("Error fetching all houses:", error);
      }
    };

    fetchAllHousesData();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchUnreadMessageCount = async () => {
        try {
          const unreadCount = await countUnreadMessages(userId);
          useMainStore.getState().setUnreadMessageCount(unreadCount);
        } catch (error) {
          console.log("Error fetching unread message count:", error);
        }
      };

      fetchUnreadMessageCount();
    }
  }, [userId, recountTrigger]);

  useEffect(() => {
    if (favoriteHouseIds.length > 0) {
      const fetchFavHouses = async () => {
        try {
          const favHouseData = await getFevoriteHousesByIds(favoriteHouseIds);
          if (favHouseData) {
            // Store the userData in Zustand store
            useMainStore.getState().setFavoriteHouses(favHouseData);
          }
        } catch (error) {
          console.log("Error fetching user and house data:", error);
        }
      };
      fetchFavHouses();
    }
  }, [favoriteHouseIds]);
  // Fetch the total house count from Firestore using getTotalHouseCount
  useEffect(() => {
    if (userId) {
      const fetchTotalHousePageCount = async () => {
        try {
          const PAGE_SIZE = 10;
          const totalHouseNumber = await getTotalHouseCount();
          const pages = Math.ceil(totalHouseNumber / PAGE_SIZE);
          useMainStore.getState().setTotalHousePages(pages);
        } catch (error) {
          console.log("Error fetching total house count:", error);
        }
      };

      fetchTotalHousePageCount();
    }
  }, []);

  return null;
};
export default StoreInitializer;
