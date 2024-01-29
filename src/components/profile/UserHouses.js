import React, { useState, useEffect, useMemo } from "react";
import useMainStore from "../store/mainStore";
import DisplayHouses from "./DisplayHouses";
import { useFetchAllHouses } from "../functions/houseFunctions";
import { useFetchUserDataById } from "../functions/userFunctions";
import { UserAuth } from "../../context/AuthContext";

const UserHouses = ({ userData, onHouseClick }) => {
  const { user } = UserAuth();
  const [houseData, setHouseData] = useState();
  const allHouses = useMainStore((state) => state.allHouses);

  // Use the useMemo hook to recompute the filtered houses only if allHouses or userData.houseId changes
  const userHouses = useMemo(() => {
    if (userData && userData.houseId) {
      return allHouses.filter((house) => userData.houseId.includes(house.id));
    }
    return [];
  }, [allHouses, userData?.houseId]);

  // Use the useFetchAllHouses hook to get the fetchHousesAndUpdateStore function
  const fetchHousesAndUpdateStore = useFetchAllHouses();
  const fetchUserData = useFetchUserDataById();

  // Use useEffect to trigger fetching and updating houses on each render
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await fetchHousesAndUpdateStore();
        await fetchUserData(user.uid);
      } catch (error) {
        console.error("Error fetching houses:", error);
      }
    };

    fetchAllData();
  }, []);

  const handleHouseClick = (data) => {
    setHouseData(data);
  };

  return (
    <div>
      <DisplayHouses houses={userHouses} onHouseClick={onHouseClick} />
    </div>
  );
};

export default UserHouses;
