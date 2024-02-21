import React, { useState } from "react";
import UsersTable from "./UsersTable";
import { Box, TextField } from "@mui/material";
import { UserAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import useMainStore from "../../components/store/mainStore";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const allUsers = useMainStore((state) => state.allUsers);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      // Filter users based on search term matching the userID, firstName, or lastName
      const results = allUsers.filter(
        (user) =>
          user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults(allUsers); // Show all users if there's no search term
    }
  }, [searchTerm, allUsers]);

  return (
    <Box sx={styles.container}>
      <Box>
        <TextField
          label="Search User (Id / Name)"
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
