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
  deleteField,
  deleteDoc,
} from "@firebase/firestore";
import useMainStore from "../components/store/mainStore";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { UserAuth } from "./AuthContext";

const HouseContext = createContext();
export const HouseContextProvider = ({ children }) => {
  const { user } = UserAuth();
  const getHouseDetailsById = async (houseId) => {
    try {
      const houseDocRef = doc(db, "houses", houseId);
      const houseDocSnapshot = await getDoc(houseDocRef);

      if (houseDocSnapshot.exists()) {
        return houseDocSnapshot.data();
      } else {
        console.log("House details not found");
        return null;
      }
    } catch (error) {
      console.error("Error getting house details:", error);
      return null;
    }
  };

  const registerHouse = async (userId, houseData, fullName) => {
    try {
      const {
        type,
        peopleNeeded,
        location,
        areaSize,
        subcity,
        bathroom,
        rooms,
        price,
        detail,
        area,
        pic1,
        pic2,
        pic3,
      } = houseData;

      // Convert rooms and price to numbers
      let newRooms = parseInt(rooms, 10); // Assuming rooms is an integer
      let newPeopleNeeded = parseInt(peopleNeeded, 10);
      let newAreaSize = parseInt(areaSize, 10);
      let newPrice = parseFloat(price);
      // Get the current timestamp
      const timestamp = new Date();
      // Upload images to Firebase Storage and get their download URLs
      const imageUrls = await Promise.all([
        uploadImageToStorage(userId, pic1),
        uploadImageToStorage(userId, pic2),
        uploadImageToStorage(userId, pic3),
      ]);
      // Create a new house document in Firestore
      const houseRef = await addHouseToFirestore({
        type,
        peopleNeeded: newPeopleNeeded,
        location,
        areaSize: newAreaSize,
        subcity,
        bathroom,
        rooms: newRooms,
        price: newPrice,
        detail,
        area,
        pic1: imageUrls[0],
        pic2: imageUrls[1],
        pic3: imageUrls[2],
        userId: userId,
        timestamp,
        owner: fullName,
      });

      // Get the ID of the created house
      const houseId = houseRef.id;

      // Update the user's data with the newly created house ID
      await updateHouseIdInUserData(userId, houseId);
      return houseId; // Return the ID of the created house
    } catch (error) {
      console.error("Error registering a house:", error);
      throw error;
    }
  };

  const uploadImageToStorage = async (userId, image) => {
    try {
      const imageRef = ref(storage, `images/${v4()}`);
      const snapshot = await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const addHouseToFirestore = async (houseData) => {
    try {
      const houseCollectionRef = collection(db, "houses");
      const houseDocRef = await addDoc(houseCollectionRef, houseData);
      return houseDocRef;
    } catch (error) {
      console.error("Error adding house to Firestore:", error);
      throw error;
    }
  };

  const updateHouseIdInUserData = async (userId, houseId) => {
    try {
      const userRef = doc(db, "users", userId);

      // Get the current user data
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      // Check if the user already has a houseId array, if not, create one
      let houseIds = userData.houseId ? userData.houseId : [];

      // Ensure houseIds is an array
      if (!Array.isArray(houseIds)) {
        houseIds = [houseIds];
      }

      // Add the new houseId to the array if it's not already there
      if (!houseIds.includes(houseId)) {
        houseIds.push(houseId);
      }

      // Update the user document with the new array of houseIds
      await updateDoc(userRef, {
        houseId: houseIds,
      });
    } catch (error) {
      console.error("Error updating house ID in user data:", error);
      throw error;
    }
  };
  const updateHouseImages = async (houseId, userId, images) => {
    try {
      const houseRef = doc(db, "houses", houseId);

      // Upload new images to Firebase Storage and get their download URLs
      const newImageUrls = await Promise.all([
        images.pic1 instanceof File
          ? uploadImageToStorage(userId, images.pic1)
          : null,
        images.pic2 instanceof File
          ? uploadImageToStorage(userId, images.pic2)
          : null,
        images.pic3 instanceof File
          ? uploadImageToStorage(userId, images.pic3)
          : null,
      ]);

      // Prepare the updated image data
      const updatedImageData = {};
      if (newImageUrls[0]) updatedImageData.pic1 = newImageUrls[0];
      if (newImageUrls[1]) updatedImageData.pic2 = newImageUrls[1];
      if (newImageUrls[2]) updatedImageData.pic3 = newImageUrls[2];

      // Update the house document in Firestore
      await updateDoc(houseRef, updatedImageData);

      return houseId; // Return the ID of the updated house
    } catch (error) {
      console.error("Error updating house images:", error);
      throw error;
    }
  };
  const handleHouseFieldChange = async (houseId, fieldName, value) => {
    try {
      // Create a reference to the specific house document
      const houseRef = doc(db, "houses", houseId);

      // Update the specific field with the new value
      await updateDoc(houseRef, {
        [fieldName]: value,
      });

      console.log(
        `Field ${fieldName} in house with ID ${houseId} updated successfully.`
      );
    } catch (error) {
      console.error(
        `Error updating field ${fieldName} in house with ID ${houseId}:`,
        error
      );
      throw error;
    }
  };
  const editHouse = async (userId, houseId, houseData) => {
    try {
      const { subcity, rooms, price, detail, area, pic1, pic2, pic3 } =
        houseData;

      // Upload new images to Firebase Storage and get their download URLs
      const newImageUrls = await Promise.all([
        pic1 instanceof File ? uploadImageToStorage(userId, pic1) : null,
        pic2 instanceof File ? uploadImageToStorage(userId, pic2) : null,
        pic3 instanceof File ? uploadImageToStorage(userId, pic3) : null,
      ]);

      // Get the existing house details
      const existingHouse = await getHouseDetailsById(houseId);

      // Prepare updated house data
      const updatedHouseData = {
        subcity: subcity || existingHouse.subcity,
        rooms: rooms || existingHouse.rooms,
        price: price || existingHouse.price,
        detail: detail || existingHouse.detail,
        area: area || existingHouse.area,
        pic1: newImageUrls[0] || existingHouse.pic1,
        pic2: newImageUrls[1] || existingHouse.pic2,
        pic3: newImageUrls[2] || existingHouse.pic3,
        userId: userId,
      };

      // Update the house document in Firestore
      await updateHouseInFirestore(houseId, updatedHouseData);

      return houseId; // Return the ID of the edited house
    } catch (error) {
      console.error("Error editing a house:", error);
      throw error;
    }
  };

  const updateHouseInFirestore = async (houseId, updatedHouseData) => {
    try {
      const houseRef = doc(db, "houses", houseId);
      await updateDoc(houseRef, updatedHouseData);
    } catch (error) {
      console.error("Error updating house in Firestore:", error);
      throw error;
    }
  };

  const getAllHouses = async (
    limitNum,
    startAfterDoc,
    subcity,
    rooms,
    price
  ) => {
    try {
      const itemsPerPage = limitNum || 10;
      const houseCollectionRef = collection(db, "houses");
      let [minPrice, maxPrice] = price.split("-").map(Number);
      let housesQuery = query(
        houseCollectionRef,
        orderBy("price"),
        orderBy("timestamp", "desc")
      );

      if (startAfterDoc) {
        housesQuery = query(
          houseCollectionRef,
          orderBy("price"),
          orderBy("timestamp", "desc"),
          startAfter(startAfterDoc),
          limit(itemsPerPage)
        );
      } else {
        housesQuery = query(
          houseCollectionRef,
          orderBy("price"),
          orderBy("timestamp", "desc"),
          limit(itemsPerPage)
        );
      }

      // Additional filtering based on search fields
      if (subcity) {
        housesQuery = query(
          housesQuery,
          where("subcity", "==", subcity.toLowerCase())
        );
      }
      if (rooms) {
        housesQuery = query(housesQuery, where("rooms", "==", Number(rooms)));
      }
      if (minPrice && maxPrice) {
        housesQuery = query(
          housesQuery,
          where("price", ">=", minPrice),
          where("price", "<=", maxPrice)
        );
      }

      const housesSnapshot = await getDocs(housesQuery);
      const lastDocumentSnapshot =
        housesSnapshot.docs[housesSnapshot.docs.length - 1];

      const houses = housesSnapshot.docs.map((houseDoc) => ({
        id: houseDoc.id,
        ...houseDoc.data(),
      }));

      const hasNextPage = houses.length === itemsPerPage;

      return {
        houses,
        hasNextPage,
        lastDocumentSnapshot,
      };
    } catch (error) {
      console.error("Error getting houses:", error);
      throw error;
    }
  };

  const fetchAllHouses = async () => {
    try {
      // Reference to the 'houses' collection
      const houseCollectionRef = collection(db, "houses");

      // Fetch all documents from the 'houses' collection
      const housesSnapshot = await getDocs(houseCollectionRef);

      // Map the documents to an array of house data
      const houses = housesSnapshot.docs.map((houseDoc) => ({
        id: houseDoc.id,
        ...houseDoc.data(),
      }));

      return houses;
    } catch (error) {
      console.error("Error fetching all houses:", error);
      throw error;
    }
  };

  const getFevoriteHousesByIds = async (houseIds) => {
    try {
      const houseCollectionRef = collection(db, "houses");
      const housesQuery = query(
        houseCollectionRef,
        where("__name__", "in", houseIds)
      );

      const housesSnapshot = await getDocs(housesQuery);

      const houses = housesSnapshot.docs.map((houseDoc) => ({
        id: houseDoc.id,
        ...houseDoc.data(),
      }));

      return houses;
    } catch (error) {
      console.error("Error fetching specific houses:", error);
      throw error;
    }
  };

  const getTotalHouseCount = async () => {
    try {
      const houseCollectionRef = collection(db, "houses");
      const houseSnapshot = await getDocs(houseCollectionRef);

      return houseSnapshot.size;
    } catch (error) {
      console.error("Error getting total house count:", error);
      throw error;
    }
  };

  const toggleHouseInFavorites = async (userId, houseId) => {
    try {
      // First, retrieve the user's document from Firestore
      const userRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userRef);

      if (userDocSnapshot.exists()) {
        // Get the current favorites array or initialize it if it doesn't exist
        const favorites = userDocSnapshot.data().favorites || [];

        // Check if the houseId is already in the favorites
        const index = favorites.indexOf(houseId);
        if (index !== -1) {
          // House is already in favorites, so remove it
          favorites.splice(index, 1);
        } else {
          // House is not in favorites, so add it
          favorites.push(houseId);
        }

        // Update the user's document with the updated favorites array
        await updateDoc(userRef, {
          favorites: favorites,
        });
      } else {
        console.log("User document not found.");
      }
    } catch (error) {
      console.error("Error toggling house in favorites:", error);
      throw error;
    }
  };
  const getHousesByPreferences = async (preferences) => {
    try {
      const allHouses = [];

      for (const preference of preferences) {
        let { subcity, rooms, price } = preference;

        let housesQuery = query(
          collection(db, "houses"),
          orderBy("price"),
          orderBy("timestamp", "desc")
        );

        // Filter by subcity only if it's not 'any' or 'Any'
        if (subcity && subcity.toLowerCase() !== "any") {
          housesQuery = query(housesQuery, where("subcity", "==", subcity));
        }

        if (rooms !== null && Number(rooms) > 0) {
          housesQuery = query(housesQuery, where("rooms", "==", Number(rooms)));
        }

        // Filter by price range only if it's not 'any' or 'Any'
        if (price && price.toLowerCase() !== "any") {
          const [minPrice, maxPrice] = price.split("-").map(Number);
          housesQuery = query(
            housesQuery,
            where("price", ">=", minPrice),
            where("price", "<=", maxPrice)
          );
        }

        const housesSnapshot = await getDocs(housesQuery);

        const houses = housesSnapshot.docs.map((houseDoc) => ({
          id: houseDoc.id,
          ...houseDoc.data(),
        }));

        allHouses.push(...houses);
      }

      return allHouses;
    } catch (error) {
      console.error("Error getting houses by preferences:", error);
      throw error;
    }
  };

  const countHouses = async () => {
    try {
      const housesCollectionRef = collection(db, "houses");
      const housesSnapshot = await getDocs(housesCollectionRef);
      return housesSnapshot.size;
    } catch (error) {
      console.error("Error counting houses:", error);
      throw error;
    }
  };

  const searchHouses = async (searchTerm) => {
    try {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const housesCollectionRef = collection(db, "houses");
      const housesSnapshot = await getDocs(housesCollectionRef);

      const houses = [];
      housesSnapshot.forEach((doc) => {
        if (doc.id.toLowerCase().includes(lowerSearchTerm)) {
          const houseData = doc.data();
          houses.push({ id: doc.id, ...houseData });
        }
      });

      return houses;
    } catch (error) {
      console.error("Error searching houses:", error);
      throw error;
    }
  };

  const deleteHouse = async (userId, houseId) => {
    try {
      if (houseId) {
        // Reference to the user's document in the 'users' collection
        const userRef = doc(db, "users", userId);

        // Get the current user data
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        if (!userData) {
          console.log(`User with ID ${userId} not found.`);
          return; // Exit if user data is not found
        }

        // Log the current user data for debugging
        console.log("Current user data:", userData);

        // Check if the user has a houseId array
        if (userData.houseId && Array.isArray(userData.houseId)) {
          // Log the current houseId array for debugging
          console.log("Current houseId array:", userData.houseId);

          // Filter out the houseId from the array
          const updatedHouseIds = userData.houseId.filter(
            (id) => id.toString() !== houseId.toString()
          );

          // Log the updated houseId array for debugging
          console.log("Updated houseId array:", updatedHouseIds);

          // Update the user document with the new array of houseIds
          await updateDoc(userRef, {
            houseId: updatedHouseIds,
          });

          // Delete the house document from the 'houses' collection
          const houseRef = doc(db, "houses", houseId);
          await deleteDoc(houseRef);

          console.log(`House with ID ${houseId} deleted successfully.`);
        } else {
          console.log(`User with ID ${userId} has no houseId array.`);
        }
      } else {
        console.log("house id is missing");
      }
    } catch (error) {
      console.error("Error deleting the house:", error);
      throw error;
    }
  };

  return (
    <HouseContext.Provider
      value={{
        getHouseDetailsById,
        registerHouse,
        updateHouseImages,
        handleHouseFieldChange,
        editHouse,
        getAllHouses,
        fetchAllHouses,
        getTotalHouseCount,
        toggleHouseInFavorites,
        getFevoriteHousesByIds,
        getHousesByPreferences,
        countHouses,
        searchHouses,
        deleteHouse,
      }}
    >
      {children}
    </HouseContext.Provider>
  );
};

// Custom hook to use the context
export const HouseAuth = () => {
  return useContext(HouseContext);
};
