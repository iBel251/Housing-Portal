import React, { useEffect } from "react";
import CardsDisplay from "./CardsDisplay";
import useMainStore from "./store/mainStore";
import { Typography } from "@mui/material";
import { useFetchAllHouses } from "./functions/houseFunctions";

const Roommate = ({ onClick }) => {
  const houses = useMainStore((state) => state.allHouses);
  const fetchHousesAndUpdateStore = useFetchAllHouses();

  useEffect(() => {
    fetchHousesAndUpdateStore();
  }, []);

  const rentalHouses = houses.filter(
    (house) => house.type === "roommate/shared"
  );

  return (
    <div>
      <Typography variant="h4">Shared Houses</Typography>
      <CardsDisplay onHouseClick={onClick} allHouses={rentalHouses} />
    </div>
  );
};

export default Roommate;
