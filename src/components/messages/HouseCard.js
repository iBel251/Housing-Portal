import React, { useEffect } from "react";
import {
  Card as MuiCard,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Box,
} from "@mui/material";

import useMainStore from "../store/mainStore";

// Define all your styles in the styles object
const styles = {
  card: {
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    cursor: "pointer",
    position: "relative",
    width: "200px",
    margin: "auto",
    "@media (max-width: 600px)": {
      // Media query for small screens
      width: "300px",
    },
  },
  media: {
    height: 140,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  infoValue: {
    marginLeft: "5px",
  },
  favoriteIcon: {
    position: "absolute",
    top: "0px",
    right: "0px",
    zIndex: 2,
    background: "white",
    borderTopRightRadius: "3px",
  },
  houseTag: {
    position: "absolute",
    top: 0,
    left: 0,
    borderBottomRightRadius: "10px",
    background: "orange",
    width: "fit-content",
    padding: "3px",
  },
};

const HouseCard = ({ house, onHouseClick, houseIndex }) => {
  const storedUserData = useMainStore((state) => state.userData);
  let notifications = useMainStore((state) => state.notifications);

  notifications = notifications.filter(
    (notification) => notification.houseId === house.id
  );
  const enrollmentCount = notifications.filter(
    (notification) => notification.type === "enrollment"
  ).length;
  const unseenEnrollmentCount = notifications.filter(
    (notification) =>
      notification.type === "enrollment" && notification.status === "unseen"
  ).length;
  const removedEnrollmentCount = notifications.filter(
    (notification) =>
      notification.type === "enrollment" && notification.status === "removed"
  ).length;

  const handleClick = () => {
    onHouseClick(house.id);
  };

  return (
    <Box style={{ position: "relative" }}>
      {" "}
      {/* Ensure Box has relative positioning */}
      <Box onClick={handleClick} style={{ textDecoration: "none" }}>
        <MuiCard sx={styles.card}>
          <CardMedia
            style={styles.media}
            component="img"
            image={house.pic1}
            alt={house.subcity}
          />
          <CardContent>
            <Box sx={styles.houseTag}>House {houseIndex}</Box>
            {removedEnrollmentCount > 0 ? (
              <Typography style={{ fontSize: "14px" }}>
                Removed applications : {removedEnrollmentCount}
              </Typography>
            ) : null}
            {unseenEnrollmentCount > 0 ? (
              <>
                <Typography style={{ fontSize: "14px" }}>
                  New applications :{" "}
                  <span
                    style={{
                      color: "white",
                      background: "red",
                      padding: "3px 6px",
                      borderRadius: "50%",
                    }}
                  >
                    {unseenEnrollmentCount}
                  </span>
                </Typography>
                <Typography style={{ fontSize: "14px" }}>
                  Total applications : {enrollmentCount}{" "}
                </Typography>
              </>
            ) : (
              <Typography style={{ fontSize: "14px" }}>
                Total applications : {enrollmentCount}{" "}
              </Typography>
            )}
          </CardContent>
        </MuiCard>
      </Box>
    </Box>
  );
};

export default HouseCard;
