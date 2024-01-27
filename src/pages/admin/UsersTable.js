import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Tooltip,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import UserDetail from "./UserDetail";

const styles = {
  paper: {
    width: "95%",
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
    backgroundColor: "lightyellow", // change to your preferred color
  },
};

const UsersTable = ({ users }) => {
  const [openUserDetails, setOpenUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeCell, setActiveCell] = useState(null);

  const handleEditClick = (user, id) => {
    setSelectedUser(user);
    setOpenUserDetails(true);
    setActiveCell(id);
  };

  return (
    <Box
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        alignItems: "start",
      }}
    >
      <Paper elevation={3} sx={styles.paper}>
        <Table sx={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>House ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={user.id === activeCell ? styles.activeCell : {}}
                onClick={() => handleEditClick(user, user.id)} // Add onClick event here
                style={{ cursor: "pointer" }} // Change the cursor to pointer when hovering over a row
              >
                <TableCell>
                  <Tooltip title={user.id} arrow>
                    <div style={styles.cell}>{user.id}</div>
                  </Tooltip>
                </TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>
                  <Tooltip title={user.houseId} arrow>
                    <div style={styles.cell}>{user.houseId}</div>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      {openUserDetails && <UserDetail user={selectedUser} />}
    </Box>
  );
};

export default UsersTable;
