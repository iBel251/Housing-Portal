import React, { useState, useEffect } from "react";
import HousesTable from "./HousesTable";
import { Box, TextField } from "@mui/material";
import useMainStore from "../../components/store/mainStore"; // Adjust the import path to your store location

const styles = {
  container: {
    width: "100%",
  },
  textField: {
    backgroundColor: "#fff",
    margin: "10px auto",
    borderRadius: "4px",
  },
};

const Houses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const allHouses = useMainStore((state) => state.allHouses); // Assume allHouses is available in your store

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      // Filter houses based on search term matching the id, owner, or suburb
      const results = allHouses.filter(
        (house) =>
          house.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          house.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
          house.subcity.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults(allHouses); // Show all houses if there's no search term
    }
  }, [searchTerm, allHouses]);

  return (
    <Box sx={styles.container}>
      <Box>
        <TextField
          label="Search by House ID, Owner, or Suburb"
          variant="outlined"
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={styles.textField}
        />
        <HousesTable houses={searchResults} />
      </Box>
    </Box>
  );
};

export default Houses;
