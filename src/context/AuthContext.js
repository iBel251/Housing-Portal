import { createContext, useEffect, useState, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  AuthErrorCodes,
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import {
  setDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  getDocs,
  where,
  query,
} from "@firebase/firestore";
import useMainStore from "../components/store/mainStore";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const userData = useMainStore((state) => state.userData);
  const setUserData = useMainStore((state) => state.setUserData);

  const navigate = useNavigate();

  const createUser = async (
    email,
    password,
    firstName,
    lastName,
    pictureUrl
  ) => {
    try {
      const { user: authUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (authUser) {
        await saveUserDataToFirestore(
          authUser.uid,
          firstName,
          lastName,
          pictureUrl,
          email
        );
      }
    } catch (error) {
      console.error("Error creating user:", error);
      throw error; // <-- Re-throw the error
    }
  };

  const saveUserDataToFirestore = async (
    userId,
    firstName,
    lastName,
    pictureUrl,
    email
  ) => {
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {
        firstName,
        lastName,
        pictureUrl,
        favorites: [],
        email,
      });
    } catch (error) {
      throw error; // <-- Re-throw the error
    }
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    useMainStore.getState().setUserData({});
    useMainStore.getState().setUserHouse({});
    return signOut(auth);
  };

  const getUserDataById = async (userId) => {
    if (userId) {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          return userDocSnapshot.data();
        } else {
          console.log("User data not found");
          return null;
        }
      } catch (error) {
        console.error("Error getting user data:", error);
        return null;
      }
    }
  };

  const setUserPreferences = async (preferences) => {
    try {
      if (!user || !user.uid) {
        throw new Error("User is not authenticated");
      }

      const userDocRef = doc(db, "users", user.uid);

      // Ensure the rooms property is a number
      if (preferences.rooms !== undefined && preferences.rooms !== null) {
        preferences.rooms = Number(preferences.rooms);
      }

      // Convert subcity to lowercase
      if (preferences.subcity) {
        preferences.subcity = preferences.subcity.toLowerCase();
      }

      // Update Firestore document with new preferences
      await updateDoc(userDocRef, {
        // Using arrayUnion to add the new preferences object to the array
        preferences: arrayUnion(preferences),
      });
    } catch (error) {
      console.error("Error setting user preferences:", error);
      throw error;
    }
  };

  const editUserPreference = async (index, newPreference) => {
    try {
      // Directly clone the preferences array from userData
      const updatedPreferences = [...userData.preferences];

      // Validate the index
      if (index < 0 || index >= updatedPreferences.length) {
        throw new Error("Index out of bounds");
      }

      // Ensure rooms is a number
      newPreference.rooms = parseInt(newPreference.rooms, 10);

      // Ensure subcity is in lowercase
      newPreference.subcity = newPreference.subcity.toLowerCase();

      // Update the specific preference
      updatedPreferences[index] = newPreference;

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { preferences: updatedPreferences });

      // Update Zustand store
      setUserData({
        ...userData,
        preferences: updatedPreferences,
      });
    } catch (error) {
      console.error("Error editing user preference:", error);
      throw error;
    }
  };

  const deleteUserPreference = async (index) => {
    try {
      // Directly clone the favorites array from userData to avoid modifying the original array
      const updatedPreferences = [...userData.preferences];

      // Validate the index
      if (index < 0 || index >= updatedPreferences.length) {
        throw new Error("Index out of bounds");
      }

      // Remove the specific preference
      updatedPreferences.splice(index, 1);

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { preferences: updatedPreferences });

      // Update Zustand store
      setUserData({
        ...userData,
        preferences: updatedPreferences,
      });
    } catch (error) {
      console.error("Error deleting user preference:", error);
      throw error;
    }
  };

  const countUsers = async () => {
    try {
      const usersCollectionRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollectionRef);
      return usersSnapshot.size;
    } catch (error) {
      console.error("Error counting users:", error);
      throw error;
    }
  };

  const searchUsers = async (searchTerm) => {
    try {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const usersCollectionRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollectionRef);

      const users = [];
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        const lowerFirstName = userData.firstName.toLowerCase();
        const lowerLastName = userData.lastName.toLowerCase();

        if (
          doc.id.includes(lowerSearchTerm) ||
          lowerFirstName.includes(lowerSearchTerm) ||
          lowerLastName.includes(lowerSearchTerm)
        ) {
          users.push({ id: doc.id, ...userData });
        }
      });

      return users;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  };

  const addRestriction = async (userId, restrictionType) => {
    try {
      // Ensure user is authenticated
      if (!user || !user.uid) {
        throw new Error("User is not authenticated");
      }

      // Validate restrictionType (you can add more validation if needed)
      if (!restrictionType || typeof restrictionType !== "string") {
        throw new Error("Invalid restriction type");
      }

      const userDocRef = doc(db, "users", userId);

      // Set the new restriction directly in the Firestore document
      await updateDoc(userDocRef, {
        restriction: restrictionType,
      });

      // Update Zustand store
      setUserData({
        ...userData,
        restriction: restrictionType,
      });
    } catch (error) {
      console.error("Error adding user restriction:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const adminEmails = ["admin1@gmail.com", "admin2@gmail.com"];

        if (adminEmails.includes(currentUser.email)) {
          navigate("/admin");
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  return (
    <UserContext.Provider
      value={{
        user,
        logout,
        createUser,
        signIn,
        getUserDataById,
        setUserPreferences,
        editUserPreference,
        deleteUserPreference,
        countUsers,
        searchUsers,
        addRestriction,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const UserAuth = () => {
  return useContext(UserContext);
};
