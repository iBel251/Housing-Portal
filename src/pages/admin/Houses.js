import React, { useState, useEffect } from "react";
import HousesTable from "./HousesTable";
import { Box, TextField } from "@mui/material";
import { HouseAuth } from "../../context/HouseContext";

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
  const { searchHouses } = HouseAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const search = async () => {
        try {
          const results = await searchHouses(searchTerm);
          setSearchResults(results);
        } catch (error) {
          console.error("Error occurred while searching: ", error);
        }
      };

      search();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, searchHouses]);

  return (
    <Box sx={styles.container}>
      <Box>
        <TextField
          label="Search by House ID" // Adjust the label to suit your needs
          variant="outlined"
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={styles.textField}
        />
        <HousesTable houses={searchResults} />{" "}
        {/* Make sure to pass the appropriate prop */}
      </Box>
    </Box>
  );
};

export default Houses;
