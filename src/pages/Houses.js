import React, { useState } from "react";
import { Box } from "@mui/material";
import { HashLoader } from "react-spinners";
import HousesSecondNav from "../components/housesDisplay/HousesSecondNav";
import { UserAuth } from "../context/AuthContext";
import { useEffect } from "react";
import useMainStore from "../components/store/mainStore";
import Filter from "../components/housesDisplay/Filter";

function Houses() {
  const { user, logout } = UserAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const allHouses = useMainStore((state) => state.allHouses);
  const setActivePage = useMainStore((state) => state.setActivePage);

  useEffect(() => {
    setActivePage("houses");
  }, []);

  useEffect(() => {
    if (allHouses && Object.keys(allHouses).length > 0) {
      setFilteredHouses(allHouses);
    }
    if (filteredHouses && filteredHouses.length === 0) {
      setFilteredHouses(allHouses);
    }
    if (user.emailVerified) {
      console.log("email verified");
    } else {
      console.log("email not verified");
    }
  }, []);

  useEffect(() => {
    // Set a timeout to change the loading state to false after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Clean up the timer when the component is unmounted or rerendered
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box>
      {/* search field */}
      <Filter setFilteredHouses={setFilteredHouses} />

      <Box className="spinner-parent">
        {isLoading ? (
          // Loading screen
          <div className="spinner-contained-container">
            <HashLoader color="orange" size={100} />
            <div className="spinner-text">Loading...</div>
          </div>
        ) : (
          // Display houses
          <HousesSecondNav allHouseData={filteredHouses} />
        )}
      </Box>
    </Box>
  );
}

export default Houses;
