import React, { useState } from "react";
import UsersTable from "./UsersTable";
import { Box, TextField } from "@mui/material";
import { UserAuth } from "../../context/AuthContext";
import { useEffect } from "react";

const styles = {
  container: {
    width: "100%",
  },
  textField: {
    backgroundColor: "#fff", // Replace with the color you want
    margin: "10px auto",
    borderRadius: "4px",
  },
};

const Users = () => {
  const { searchUsers } = UserAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const search = async () => {
        try {
          const results = await searchUsers(searchTerm);
          setSearchResults(results);
        } catch (error) {
          console.error("Error occurred while searching: ", error);
        }
      };

      search();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, searchUsers]);

  return (
    <Box sx={styles.container}>
      <Box>
        <TextField
          label="Search by Name"
          variant="outlined"
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={styles.textField}
        />
        <UsersTable users={searchResults} />
      </Box>
    </Box>
  );
};

export default Users;
