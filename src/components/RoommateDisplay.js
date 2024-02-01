import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { HashLoader } from "react-spinners";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { UserAuth } from "../context/AuthContext";
import { HouseAuth } from "../context/HouseContext";

const styles = {
  container: {
    margin: "20px 0",
    padding: "20px",
    backgroundColor: "#f5f5f5", // Light grey background
  },
  title: {
    marginBottom: "10px",
    fontWeight: "bold",
  },
  accordion: {
    margin: "10px 0",
    width: "200px",
  },
  enrollButton: {
    // Style for the enroll button
    marginTop: "20px",
    backgroundColor: "#1976d2", // Example button color
    color: "#fff",
    "&:hover": {
      backgroundColor: "#1565c0",
    },
  },
};

const RoommateDisplay = ({ houseData }) => {
  const { roommateData } = houseData;
  const { user } = UserAuth();
  const { toggleInterestInHouse } = HouseAuth();
  const [isInterested, setIsInterested] = useState(false);
  const [interestedCount, setInterestedCount] = useState(
    houseData?.roommateData?.interestedPeople?.length || 0
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Safely access the data with optional chaining
  const registeredCount = roommateData?.registeredPeople?.length || 0;
  const preferences = roommateData?.preferences || [];
  const commonRooms = roommateData?.commonRooms || [];

  useEffect(() => {
    setIsInterested(
      houseData?.roommateData?.interestedPeople?.includes(user.uid)
    );
  }, [houseData, user.uid]);

  const handleEnrollClick = async () => {
    try {
      await toggleInterestInHouse(houseData.id, user.uid);
      setIsInterested(!isInterested);
      if (isInterested) {
        setInterestedCount((prevCount) => prevCount - 1);
        setSnackbarMessage("You have successfully withdrawn your interest.");
      } else {
        setInterestedCount((prevCount) => prevCount + 1);
        setSnackbarMessage(
          "You have successfully enrolled for shared housing. Contact owner for further processing."
        );
      }
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error toggling interest:", error);
      // Handle error case, possibly set a different snackbar message
    }
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Paper elevation={0} style={styles.container}>
      <Typography variant="h6" style={styles.title}>
        Roommate Information
      </Typography>
      <Box>
        <Typography variant="body1">
          Interested Users: {interestedCount}
        </Typography>
        <Typography variant="body1">
          Registered Users: {registeredCount}
        </Typography>
      </Box>
      {/* Accordion for Preferences */}
      <Accordion style={styles.accordion}>
        <AccordionSummary
          style={{ borderBottom: "1px solid black" }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>Preferences</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {preferences.length > 0 ? (
            preferences.map((preference, index) => (
              <Typography key={index}>{preference}</Typography>
            ))
          ) : (
            <Typography>No specific preferences listed.</Typography>
          )}
        </AccordionDetails>
      </Accordion>
      {/* Accordion for Common Rooms */}
      <Accordion style={styles.accordion}>
        <AccordionSummary
          style={{ borderBottom: "1px solid black" }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>Shared Rooms</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {commonRooms.length > 0 ? (
            commonRooms.map((room, index) => (
              <Typography key={index}>{room}</Typography>
            ))
          ) : (
            <Typography>No common rooms specified.</Typography>
          )}
        </AccordionDetails>
      </Accordion>
      <Button
        variant="contained"
        style={styles.enrollButton}
        onClick={handleEnrollClick}
      >
        {isInterested ? "Withdraw Interest" : "Enroll for Shared Housing"}
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default RoommateDisplay;
