import React, { useEffect } from "react";
import CardsDisplay from "./CardsDisplay";
import useMainStore from "../store/mainStore";
import { Typography } from "@mui/material";
import { useFetchAllHouses } from "../functions/houseFunctions";

const Exchange = ({ onClick, allHouseData }) => {
  const houses = useMainStore((state) => state.allHouses);
  const fetchHousesAndUpdateStore = useFetchAllHouses();

  useEffect(() => {
    fetchHousesAndUpdateStore();
  }, []);

  const rentalHouses = allHouseData.filter(
    (house) => house.type === "exchange"
  );

  return (
    <div>
      <Typography variant="h4">Exchange Houses</Typography>
      <CardsDisplay onHouseClick={onClick} allHouses={rentalHouses} />
    </div>
  );
};

export default Exchange;
