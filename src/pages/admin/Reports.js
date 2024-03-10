import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import useMainStore from "../../components/store/mainStore";
import HouseReports from "./HouseReports";
import UserReports from "./UserReports";
import BlockedUsers from "./BlockedUsers";

const styles = {
  navBtns: {
    background: "orange",
    margin: "0 0.5px",
    fontWeight: "bold",
    color: "#2D6072",
    borderRadius: "0px",
    border: "1px solid orange",
    "&:hover": {
      border: "1px solid #2D6072",
      background: "orange",
      color: "#2D6072",
      borderBottom: "1px solid #2D6072",
    },
  },
  activeBtn: {
    background: "#2D6072",
    color: "orange",
    borderBottom: "1px solid #2D6072",
    "&:hover": {
      border: "1px solid orange",
      background: "#2D6072",
      color: "orange",
      borderBottom: "1px solid #2D6072",
    },
  },
};

const Reports = () => {
  const { adminData } = useMainStore();
  const [selectedReport, setSelectedReport] = useState("house");

  // Assuming adminData[1] contains house reports based on your sample data
  const blockedUsers = adminData&&adminData.length>0? adminData[0] : [];
  const houseReports = adminData&&adminData.length>1? adminData[1] : [];;
  const userReports = adminData&&adminData.length>2? adminData[2] : [];;

  const formatDate = (seconds) => {
    const date = new Date(seconds * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Function to apply active button styles conditionally
  const getButtonStyle = (reportType) => ({
    ...styles.navBtns,
    ...(selectedReport === reportType ? styles.activeBtn : {}),
  });

  return (
    <Box sx={{ margin: 2 }}>
      <Box>
        <Button
          variant="contained"
          sx={getButtonStyle("house")}
          disableElevation
          onClick={() => setSelectedReport("house")}
        >
          House Reports
        </Button>
        <Button
          variant="contained"
          disableElevation
          sx={getButtonStyle("user")}
          onClick={() => setSelectedReport("user")}
        >
          User Reports
        </Button>
        <Button
          disableElevation
          variant="contained"
          sx={getButtonStyle("blocked")}
          onClick={() => setSelectedReport("blocked")}
        >
          Blocked Users
        </Button>
      </Box>
      {selectedReport === "house" ? (
        <HouseReports houseReports={houseReports} formatDate={formatDate} />
      ) : selectedReport === "user" ? (
        <UserReports userReports={userReports} formatDate={formatDate} />
      ) : (
        <BlockedUsers blockedUsers={blockedUsers} />
      )}
    </Box>
  );
};

export default Reports;
