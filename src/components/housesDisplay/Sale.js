import React, { useEffect } from "react";
import CardsDisplay from "./CardsDisplay";
import useMainStore from "../store/mainStore";
import { Typography } from "@mui/material";
import { useFetchAllHouses } from "../functions/houseFunctions";

const Sale = ({ onClick, allHouseData }) => {
  const fetchHousesAndUpdateStore = useFetchAllHouses();

  useEffect(() => {
    fetchHousesAndUpdateStore();
  }, []);

  const rentalHouses = allHouseData.filter((house) => house.type === "sale");

  return (
    <div>
      <Typography variant="h4">For sale</Typography>
      <CardsDisplay onHouseClick={onClick} allHouses={rentalHouses} />
    </div>
  );
};

export default Sale;
