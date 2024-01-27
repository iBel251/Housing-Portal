import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Box,
} from "@mui/material";
import HouseDetail from "./HouseDetail"; // Replace with your actual HouseDetail component

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
    backgroundColor: "lightyellow",
  },
};

const HousesTable = ({ houses }) => {
  const [openHouseDetails, setOpenHouseDetails] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [activeCell, setActiveCell] = useState(null);
  console.log(houses);
  const handleRowClick = (house, id) => {
    setSelectedHouse(house);
    setOpenHouseDetails(true);
    setActiveCell(id);
  };

  return (
    <Box
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 2fr",
        alignItems: "start",
      }}
    >
      <Paper elevation={3} sx={styles.paper}>
        <Table sx={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Price</TableCell>
              {/* Add other house related header cells as needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {houses.map((house) => (
              <TableRow
                key={house.id}
                sx={house.id === activeCell ? styles.activeCell : {}}
                onClick={() => handleRowClick(house, house.id)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>
                  <Tooltip title={house.id} arrow>
                    <div style={styles.cell}>{house.id}</div>
                  </Tooltip>
                </TableCell>
                <TableCell>{house.subcity}</TableCell>
                <TableCell>{house.owner}</TableCell>
                <TableCell>{house.price}</TableCell>
                {/* Add other house related cells as needed */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {openHouseDetails && <HouseDetail house={selectedHouse} />}
      </Paper>
    </Box>
  );
};

export default HousesTable;
