import React, { useState } from "react";
import { Grid, Pagination, Typography } from "@mui/material";
import Card from "./Card";

const CardsDisplay = ({ onHouseClick, allHouses }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const pagesCount = Math.ceil(allHouses.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const currentHouses = allHouses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Check if there are no houses to display
  if (allHouses.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h6">No houses available.</Typography>
      </div>
    );
  }

  return (
    <div>
      <Grid container spacing={4} style={{ padding: "20px" }}>
        {currentHouses.map((house, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Card onClick={() => onHouseClick(house)} house={house} />
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

export default CardsDisplay;
