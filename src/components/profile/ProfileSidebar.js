import React, { useState } from "react";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import useMainStore from "../store/mainStore";

const styles = {
  navBox: {
    width: "200px",
    borderRight: "1px solid #ddd",
    "@media (max-width: 600px)": {
      // Media query for small screens
      width: "100%",
      minHeight: "auto",
      display: "flex", // Make horizontal
      flexDirection: "row",
      justifyContent: "center",
      borderRight: "none",
      textAlign: "center",
    },
  },
};

const ProfileSidebar = ({ onSelect }) => {
  const { activeLink, setActiveLink } = useMainStore();

  const handleSelect = (option) => {
    onSelect(option); // Inform the parent component
    setActiveLink(option);
  };

  const getLinkStyle = (option) => {
    const commonStyle = {
      cursor: "pointer",
    };

    // Special case for "My Houses" link when active link is "editHouse"
    if (activeLink === "editHouse" && option === "home") {
      return {
        ...commonStyle,
        backgroundColor: "orange",
      };
    }

    return {
      ...commonStyle,
      backgroundColor: option === activeLink ? "orange" : "transparent",
    };
  };

  return (
    <Box display="flex">
      <Box sx={styles.navBox}>
        <ListItem
          onClick={() => handleSelect("home")}
          style={getLinkStyle("home")}
        >
          My Houses
        </ListItem>
        <ListItem
          onClick={() => handleSelect("add")}
          style={getLinkStyle("add")}
        >
          Add House
        </ListItem>
        <ListItem
          onClick={() => handleSelect("preferences")}
          style={getLinkStyle("preferences")}
        >
          Preferences
        </ListItem>
        <ListItem
          onClick={() => handleSelect("editProfile")}
          style={getLinkStyle("editProfile")}
        >
          My Profile
        </ListItem>
      </Box>
    </Box>
  );
};

export default ProfileSidebar;
