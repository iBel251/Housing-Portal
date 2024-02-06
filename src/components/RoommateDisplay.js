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
  CircularProgress,
} from "@mui/material";
import { HashLoader } from "react-spinners";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { UserAuth } from "../context/AuthContext";
import { RoommateAuth } from "../context/RoommateContext";
import RoommateFormModal from "./RoommateFormModal";

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
  const { user } = UserAuth();
  const [isInterested, setIsInterested] = useState(false);
  const [interestedCount, setInterestedCount] = useState(0);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  useEffect(() => {
    // console.log(houseData.roommateData);
    console.log(user.uid);
    // Adjusted to work with objects instead of arrays
    setIsInterested(
      Object.hasOwnProperty.call(
        houseData?.roommateData?.interestedPeople,
        user.uid
      )
    );
    setInterestedCount(
      Object.keys(houseData?.roommateData?.interestedPeople || {}).length
    );
    setRegisteredCount(
      Object.keys(houseData?.roommateData?.registeredPeople || {}).length
    );
  }, [houseData, user.uid]);
  if (!houseData.roommateData) {
    return;
  }
  const { roommateData } = houseData;
  const { toggleInterestInHouse } = RoommateAuth();

  const preferences = roommateData?.preferences || [];
  const commonRooms = roommateData?.commonRooms || [];

  const handleOpenForm = () => {
    if (isInterested) {
      toggleInrollment();
    } else {
      setOpenFormDialog(true);
    }
  };

  const handleFormSubmit = async (formData) => {
    setOpenFormDialog(false); // Close the form dialog
    toggleInrollment(formData);
  };

  const toggleInrollment = async (formData) => {
    setLoading(true);
    try {
      // First, toggle the interest state
      await toggleInterestInHouse(houseData.id, user.uid, formData); // Assuming this function can also handle formData if needed
      setIsInterested(!isInterested); // Update the interested state based on the toggle action

      // Next, decide what action was taken (enroll or withdraw) based on the new state of isInterested
      if (!isInterested) {
        // Note the use of !isInterested because we've already toggled the state
        // Enroll scenario: Increase interestedCount and set the success message
        setInterestedCount((prevCount) => prevCount + 1);
        setSnackbarMessage(
          "You have successfully enrolled for shared housing. Contact owner for further processing."
        );
      } else {
        // Withdraw scenario: Decrease interestedCount and set the withdrawal message
        setInterestedCount((prevCount) => prevCount - 1);
        setSnackbarMessage("You have successfully withdrawn your interest.");
      }

      // Optionally, handle form data here if your application needs to store this information
      // For example, updating user profile with formData details
      // This part depends on how you've set up your backend to receive and store this additional data

      setOpenSnackbar(true); // Show the snackbar with the success message
    } catch (error) {
      console.error("Error toggling interest:", error);
      // Optionally, set a snackbar message for errors
      setSnackbarMessage("An error occurred. Please try again.");
      setOpenSnackbar(true);
    }

    setLoading(false); // Reset loading state regardless of the outcome
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
        onClick={handleOpenForm}
        disabled={loading} // Disable the button while loading
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <CircularProgress
              size={24}
              style={{ color: "white", marginRight: "8px" }}
            />
          ) : isInterested ? (
            "Withdraw Interest"
          ) : (
            "Enroll for Shared Housing"
          )}
        </Box>
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
      <RoommateFormModal
        open={openFormDialog}
        onClose={() => setOpenFormDialog(false)}
        onSubmit={handleFormSubmit}
      />
    </Paper>
  );
};

export default RoommateDisplay;
