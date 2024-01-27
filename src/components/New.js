import React, { useEffect } from "react";
import CardsDisplay from "./CardsDisplay";
import useMainStore from "./store/mainStore";
import { Typography } from "@mui/material";
import { useFetchAllHouses } from "./functions/houseFunctions";

const New = ({ onClick, allHouseData }) => {
  const houses = allHouseData;
  const fetchHousesAndUpdateStore = useFetchAllHouses();

  useEffect(() => {
    fetchHousesAndUpdateStore();
  }, []);

  return (
    <div>
      <Typography variant="h4">New Houses</Typography>
      <CardsDisplay onHouseClick={onClick} allHouses={houses} />
    </div>
  );
};

export default New;
