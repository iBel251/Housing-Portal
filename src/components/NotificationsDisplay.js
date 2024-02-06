import React, { useEffect } from "react";
import useMainStore from "./store/mainStore"; // Adjust the import path as necessary

const NotificationsDisplay = () => {
  const notifications = useMainStore((state) => state.notifications);
  const housesData = useMainStore((state) => state.allHouses);
  const userData = useMainStore((state) => state.userData);

  useEffect(() => {
    console.log("Notifications:", notifications);
    console.log("Houses Data:", housesData);
    console.log("User Data:", userData);
  }, [notifications, housesData, userData]);

  return (
    <div>
      <h2>Data Logger Component</h2>
      {/* Display or further processing of the data can be done here */}
    </div>
  );
};

export default NotificationsDisplay;
