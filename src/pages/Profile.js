import React, { useEffect, useState } from "react";
import useMainStore from "../components/store/mainStore";
import { UserAuth } from "../context/AuthContext";
import { HouseAuth } from "../context/HouseContext";
import { Avatar, Typography, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import Preferences from "../components/profile/Preferences";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import UserHouses from "../components/profile/UserHouses";
import AddHouse from "../components/profile/AddHouse";
import UserProfile from "../components/profile/UserProfile";
import EditHouse from "../components/profile/EditHouse";

const styles = {
  main: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "0px",
  },
  upperSection: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    background: "#2D6072",
    width: "100%",
    py: "5px",
    borderRadius: "2px",
    color: "orange",
  },
  avatar: {
    width: "150px",
    height: "150px",
    marginBottom: "15px",
  },
  name: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  email: {
    fontSize: "1rem",
  },
  lowerSection: {
    display: "flex",
    flexDirection: "row", // default to row
    width: "100%",
    "@media (max-width: 600px)": {
      // Media query for small screens
      flexDirection: "column",
    },
  },
  sidebar: {
    width: "150px", // Width for larger screens
    minHeight: "100vh",
    backgroundColor: "#2D6072",
    color: "white",
    "@media (max-width: 600px)": {
      // Media query for small screens
      width: "100%", // Full width for smaller screens
      minHeight: "auto",
      display: "flex", // Make horizontal
      flexDirection: "row",
      justifyContent: "center",
    },
  },

  content: {
    flexGrow: 1,
    padding: "20px",
    "@media (max-width: 600px)": {
      // Media query for small screens
      width: "90%",
    },
  },
};

const Profile = () => {
  const storedUserData = useMainStore((state) => state.userData);
  const storedUserHouse = useMainStore((state) => state.userHouse);
  const [selectedHouseId, setSelectedHouseId] = useState();
  const { activeLink, setActiveLink } = useMainStore();

  const { user } = UserAuth();
  const { registerHouse, editHouse, getHouseDetailsById, deleteHouse } =
    HouseAuth();

  const handleSelect = (option) => {
    setActiveLink(option);
  };
  const handleSelectHouse = (id) => {
    setSelectedHouseId(id);
    setActiveLink("editHouse");
  };
  const isHouseDataEmpty = !(
    storedUserHouse &&
    Object.keys(storedUserHouse).some((key) => storedUserHouse[key] !== "")
  );

  useEffect(() => {
    if (activeLink === "editHouse") {
      setActiveLink("home");
    }
  }, []);

  const renderContent = () => {
    switch (activeLink) {
      case "home":
        return (
          <UserHouses
            userData={storedUserData}
            onHouseClick={handleSelectHouse}
          />
        );
      case "add":
        return <AddHouse />;
      case "preferences":
        return <Preferences userData={storedUserData} />;
      case "editProfile":
        return <UserProfile />;
      case "editHouse":
        return <EditHouse houseId={selectedHouseId} />;
      default:
        return <div>Select an option</div>;
    }
  };

  return (
    <Box sx={styles.main}>
      <Box sx={styles.upperSection}>
        <Avatar
          src={storedUserData?.pictureUrl || ""}
          alt="Profile"
          sx={styles.avatar}
        >
          {storedUserData?.pictureUrl ? null : <PersonIcon />}
        </Avatar>
        <Typography sx={styles.name}>
          {storedUserData?.firstName} {storedUserData?.lastName}
        </Typography>
        <Typography sx={styles.email}>{user.email}</Typography>
      </Box>
      <Box sx={styles.lowerSection}>
        <Box sx={styles.sidebar}>
          <ProfileSidebar onSelect={handleSelect} />
        </Box>
        <Box sx={styles.content}>{renderContent()}</Box>
      </Box>
    </Box>
  );
};

export default Profile;
