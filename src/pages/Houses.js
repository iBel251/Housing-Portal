import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { HashLoader } from "react-spinners";
import CircularProgress from "@mui/material/CircularProgress";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import HouseModal from "../components/HouseModal";
import HousesSecondNav from "../components/HousesSecondNav";
import { UserAuth } from "../context/AuthContext";
import { HouseAuth } from "../context/HouseContext";
import { useEffect } from "react";
import useMainStore from "../components/store/mainStore";
import Filter from "../components/Filter";

function Houses() {
  const { user, logout } = UserAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [filteredHouses, setFilteredHouses] = useState({});
  const allHouses = useMainStore((state) => state.allHouses);

  useEffect(() => {
    if (filteredHouses && filteredHouses.length === 0) {
      setFilteredHouses(allHouses);
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
