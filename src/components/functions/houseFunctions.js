import React, { useContext } from "react";
import useMainStore from "../store/mainStore";
import { HouseAuth } from "../../context/HouseContext";
import { UserAuth } from "../../context/AuthContext";

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

export function useFetchAllHouses() {
  const { fetchAllHouses } = HouseAuth();
  const setAllHouses = useMainStore((state) => state.setAllHouses);

  const fetchHousesAndUpdateStore = async () => {
    try {
      const houses = await fetchAllHouses();
      // Update the Zustand store with the fetched houses
      setAllHouses(houses);
    } catch (error) {
      console.error("Error fetching all houses:", error);
    }
  };

  return fetchHousesAndUpdateStore;
}

export function useFilteredHouses() {
  const allHouses = useMainStore((state) => state.allHouses);

  const filterHouses = ({ subcity = "", rooms = "", price = "" } = {}) => {
    return allHouses.filter((house) => {
      const matchesSubcity =
        !subcity || house.subcity.toLowerCase() === subcity.toLowerCase();
      let matchesRooms = true;
      if (rooms) {
        const isPlus = rooms.endsWith("+");
        const roomNumber = parseInt(rooms, 10);
        matchesRooms = isPlus
          ? house.rooms >= roomNumber
          : house.rooms === roomNumber;
      }

      let matchesPrice = true;
      if (price) {
        const isPlus = price.endsWith("+");
        const [minPriceStr, maxPriceStr] = price.split("-").map(Number);
        const minPrice = isNaN(minPriceStr) ? 0 : minPriceStr;
        let maxPrice = isNaN(maxPriceStr) ? Infinity : maxPriceStr;
        if (isPlus) {
          maxPrice = Infinity;
        }
        matchesPrice = house.price >= minPrice && house.price <= maxPrice;
      }

      return matchesSubcity && matchesRooms && matchesPrice;
    });
  };

  return filterHouses;
}

export function formatTimestamp(timestamp) {
  const { seconds, nanoseconds } = timestamp;
  // Convert seconds and nanoseconds to milliseconds
  const milliseconds = seconds * 1000 + nanoseconds / 1000000;

  // Create a Date object using the milliseconds
  const date = new Date(milliseconds);

  // Get individual date components (year, month, day, hours, minutes, seconds)
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Month is 0-based, so add 1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const second = date.getSeconds();

  // Create a formatted string (e.g., "2023-09-01 14:30:45")
  const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}`;

  return formattedTimestamp;
}

const HouseFunctions = () => {
  return <div>House Functions</div>;
};

export default HouseFunctions;
