import React, { useState } from "react";
import useMainStore from "../store/mainStore";
import { UserAuth } from "../../context/AuthContext";
import HouseCard from "./HouseCard";
import EnrollmentList from "./EnrollmentList";
import { Box } from "@mui/material";

const styles = {
  cardsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    flexWrap: "wrap",
    width: "100%",
    "@media (max-width: 600px)": {
      // Media query for small screens
      justifyContent: "space-around",
    },
  },
};
const RoommateNotifications = () => {
  const { user } = UserAuth();
  const allHouseData = useMainStore((state) => state.allHouses);
  const notifications = useMainStore((state) => state.notifications);

  const [selectedHouseId, setSelectedHouseId] = useState(null);

  // Filter houses to only include those belonging to the current user
  const userHouses = allHouseData.filter((house) => house.userId === user.uid);

  // Further filter to get houses shared with roommates
  const userSharedHouses = userHouses.filter(
    (house) => house.type === "roommate/shared"
  );

  // Filter notifications related to roommate enrollments
  const roommateNotifications = notifications.filter(
    (notification) => notification.type === "enrollment"
  );

  // Handler for when a house is clicked
  const onHouseClick = (houseId) => {
    setSelectedHouseId(houseId);
  };

  // Find the selected house and its notifications
  const selectedHouse = userHouses.find(
    (house) => house.id === selectedHouseId
  );
  const selectedHouseNotifications = roommateNotifications.filter(
    (notification) => notification.houseId === selectedHouseId
  );

  return (
    <div>
      <h2>Shared Houses</h2>
      <Box sx={styles.cardsContainer}>
        {userSharedHouses.length > 0 ? (
          userSharedHouses.map((house, index) => (
            <div key={house.id}>
              <HouseCard
                house={house}
                onHouseClick={onHouseClick}
                houseIndex={index + 1}
              />
            </div>
          ))
        ) : (
          <p>You have no shared houses listed.</p>
        )}
      </Box>

      {selectedHouseId && (
        <div>
          <h3>Roommate Requests for Selected House</h3>
          <EnrollmentList
            houseData={selectedHouse}
            roommateNotifications={selectedHouseNotifications}
          />
        </div>
      )}
    </div>
  );
};

export default RoommateNotifications;
