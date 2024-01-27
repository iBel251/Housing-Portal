import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFilteredHouses } from "./functions/houseFunctions";

const Filter = ({ setFilteredHouses }) => {
  const [subcity, setSubcity] = useState("");
  const [rooms, setRooms] = useState("");
  const [price, setPrice] = useState("");
  const filterHouses = useFilteredHouses();
  const subcities = [
    "Arada",
    "Addis Ketema",
    "Bole",
    "Gullele",
    "Kirkos",
    "Kolfe Keranio",
    "Lideta",
    "Nifas Silk-Lafto",
    "Yeka",
  ];

  // Using useEffect to handle data upon each change
  useEffect(() => {
    console.log({ subcity, rooms, price });
    const filteredHouses = filterHouses({ subcity, rooms, price });
    console.log("filtered houses", filteredHouses);
    setFilteredHouses(filteredHouses);
  }, [subcity, rooms, price]);
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      sx={{
        // maxWidth: "700px",
        margin: "0 auto",
        backgroundColor: "#2D6072",
        p: {
          sm: "30px",
        },
        paddingBottom: {
          sm: "30px",
        },
        borderTop: "solid orange 10px",
      }}
    >
      <Box display="flex" gap={2} flexWrap="wrap" width="100%">
        <FormControl
          variant="outlined"
          style={{ flex: 1, backgroundColor: "#f7f7f7" }}
        >
          <InputLabel>Sub-City</InputLabel>
          <Select
            value={subcity}
            onChange={(e) => setSubcity(e.target.value)}
            label="subcity"
            style={{ width: "100%" }}
          >
            <MenuItem value="">
              <em>Any</em>
            </MenuItem>
            {/* Dropdown options */}
            {subcities.map((subcity, index) => (
              <MenuItem key={index} value={subcity}>
                {subcity}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          variant="outlined"
          style={{ flex: 1, backgroundColor: "#f7f7f7" }}
        >
          <InputLabel>Rooms</InputLabel>
          <Select
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            label="Rooms"
            style={{ width: "100%" }}
          >
            <MenuItem value="">
              <em>Any</em>
            </MenuItem>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
            <MenuItem value="4">4</MenuItem>
            <MenuItem value="5+">5+</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          variant="outlined"
          style={{ flex: 1, backgroundColor: "#f7f7f7" }}
        >
          <InputLabel>Price-Range</InputLabel>
          <Select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            label="pricerange"
            style={{ width: "100%" }}
          >
            <MenuItem value="">
              <em>Any</em>
            </MenuItem>
            <MenuItem value="1-5000">0 - 5k Birr</MenuItem>
            <MenuItem value="5000-9000">5k - 9k Birr</MenuItem>
            <MenuItem value="9000-15000">9k - 15k Birr</MenuItem>
            <MenuItem value="15000-200000">15k+ Birr</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Filter;
