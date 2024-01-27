import React, { useEffect } from "react";
import CardsDisplay from "./CardsDisplay";
import useMainStore from "./store/mainStore";
import { Typography } from "@mui/material";
import { useFetchAllHouses } from "./functions/houseFunctions";

const Rental = ({ onClick, allHouseData }) => {
  const fetchHousesAndUpdateStore = useFetchAllHouses();

  useEffect(() => {
    fetchHousesAndUpdateStore();
  }, []);

  const rentalHouses = allHouseData.filter((house) => house.type === "rental");

  return (
    <div>
      <Typography variant="h4">Rental Houses</Typography>
      <CardsDisplay onHouseClick={onClick} allHouses={rentalHouses} />
    </div>
  );
};

export default Rental;
