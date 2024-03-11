import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  Tooltip,
} from "@mui/material";
import UserDetail from "./UserDetail";

const styles = {
  paper: {
    overflow: "auto",
  },
  table: {
    width: "100%",
    tableLayout: "fixed",
  },
  cell: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  activeCell: {
    backgroundColor: "lightyellow",
  },
};

const UsersTable = ({ users }) => {
  const [openUserDetails, setOpenUserDetails] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [activeCell, setActiveCell] = useState(null);

  const handleEditClick = (user, id) => {
    setSelectedUserId(id);
    setOpenUserDetails(true);
    setActiveCell(id);
  };

  if (!users || !Array.isArray(users)) {
    // Display a loading or placeholder message if users data is not yet available
    return <Box>Loading users data, please wait...</Box>;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "3fr 2fr" },
        alignItems: "start",
        gap: 1,
      }}
    >
      <Paper elevation={3} sx={styles.paper}>
        <Table sx={styles.table}>
          <TableHead sx={{ background: "orange" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={user.id === activeCell ? styles.activeCell : {}}
                onClick={() => handleEditClick(user, user.id)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>
                  <Tooltip title={user.id} arrow>
                    <div style={styles.cell}>{user.id}</div>
                  </Tooltip>
                </TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>
                  <Tooltip title={user.email} arrow>
                    <div style={styles.cell}>{user.email}</div>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      {openUserDetails && <UserDetail userId={selectedUserId} />}
    </Box>
  );
};

export default UsersTable;
