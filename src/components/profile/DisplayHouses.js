import React, { useState } from "react";
import { Grid, Pagination, Typography } from "@mui/material";
import HouseCard from "./HouseCard";

const DisplayHouses = ({ onHouseClick, houses }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const pagesCount = Math.ceil(houses.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const currentHouses = houses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Check if there are no houses to display
  if (houses.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h6">You have no registered houses.</Typography>
      </div>
    );
  }

  return (
    <div>
      <Grid container spacing={4} style={{ padding: "20px" }}>
        {currentHouses.map((house, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <HouseCard onHouseClick={onHouseClick} house={house} />
          </Grid>
        ))}
      </Grid>
      {pagesCount > 1 && (
        <Pagination
          count={pagesCount}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          style={{
            marginTop: "20px",
            justifyContent: "center",
            display: "flex",
          }}
        />
      )}
    </div>
  );
};

export default DisplayHouses;
