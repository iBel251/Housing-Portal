import React, { useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import New from "./New";
import Rental from "./Rental";
import Sale from "./Sale";
import Exchange from "./Exchange";
import Roommate from "./Roommate";
import HouseDetails from "./HouseDetails";

const styles = {
  navList: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: "3px 0",
    margin: 0,
    background: "#2D6072",
    borderTop: "5px solid orange",
    borderBottom: "5px solid orange",
  },
  navItem: {
    padding: "1px 8px",
    width: "fit-content",
    color: "white",
    borderLeft: "1px solid orange",
    borderRight: "1px solid orange",
    textAlign: "center",
    cursor: "pointer",
  },
  activeNavItem: {
    backgroundColor: "orange",
  },
  link: {
    textDecoration: "none",
  },
};

const HousesSecondNav = ({ allHouseData }) => {
  const [selectedOption, setSelectedOption] = useState("new");
  const [houseData, setHouseData] = useState();

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  const handleHouseClick = (data) => {
    setHouseData(data);
    setSelectedOption("detail");
  };

  const getNavItemStyle = (option) => {
    return selectedOption === option
      ? { ...styles.navItem, ...styles.activeNavItem }
      : styles.navItem;
  };

  return (
    <div>
      <List style={styles.navList}>
        <ListItem
          onClick={() => handleSelect("new")}
          style={getNavItemStyle("new")}
        >
          <ListItemText primary="All" />
        </ListItem>
        <ListItem
          onClick={() => handleSelect("rental")}
          style={getNavItemStyle("rental")}
        >
          <ListItemText primary="Rental" />
        </ListItem>
        <ListItem
          onClick={() => handleSelect("sale")}
          style={getNavItemStyle("sale")}
        >
          <ListItemText primary="Sale" />
        </ListItem>
        <ListItem
          onClick={() => handleSelect("exchange")}
          style={getNavItemStyle("exchange")}
        >
          <ListItemText primary="Exchange" />
        </ListItem>
        <ListItem
          onClick={() => handleSelect("roommate")}
          style={getNavItemStyle("roommate")}
        >
          <ListItemText primary="Roommate/Shared" />
        </ListItem>
      </List>

      {selectedOption === "new" && (
        <New onClick={handleHouseClick} allHouseData={allHouseData} />
      )}
      {selectedOption === "rental" && <Rental allHouseData={allHouseData} />}
      {selectedOption === "sale" && <Sale allHouseData={allHouseData} />}
      {selectedOption === "exchange" && (
        <Exchange allHouseData={allHouseData} />
      )}
      {selectedOption === "roommate" && (
        <Roommate allHouseData={allHouseData} />
      )}
      {selectedOption === "detail" && <HouseDetails house={houseData} />}
    </div>
  );
};

export default HousesSecondNav;
