// HouseDetails.js
import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import useMainStore from "../store/mainStore";
import { useParams, useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReportIcon from "@mui/icons-material/Report";
import { HashLoader } from "react-spinners";
import { formatTimestamp } from "../functions/houseFunctions";
import { useStartMessage } from "../functions/chatFunctions";
import RoommateDisplay from "./RoommateDisplay";
import UserFeedback from "./UserFeedback";
import Report from "../Report";
import { FaMapMarkedAlt } from "react-icons/fa";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";

const styles = {
  container: {
    padding: "20px",
    margin: "20px auto",
    maxWidth: "800px",
  },
  image: {
    width: "100%",
    maxHeight: "400px",
    objectFit: "cover",
  },
  detailItem: {
    margin: "10px 0",
  },
  backButton: {
    marginTop: "20px",
    color: "orange",
    borderColor: "#2D6072",
  },
  contactButton: {
    margin: "20px 0px 0 10px",
  },
  reportButton: {
    marginTop: "20px",
    backgroundColor: "#D32F2F", // Deep red background
    color: "#FFFFFF", // White text
    "&:hover": {
      backgroundColor: "#C62828", // A slightly darker red on hover
    },
  },
  mainBtns: {
    color: "white",
    height: "37px",
    background: "#2D6072",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#2D6069", // A slightly darker red on hover
    },
  },
  longText: {
    whiteSpace: "pre-line", // Ensures proper rendering of newlines
  },
  mapBtn: {
    margin: "20px 0 0 5px",
    fontSize: "14px",
  },
  roommateContainer: {
    width: "100%",
  },
  btnGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: "5px",
  },
};

const HouseDetails = () => {
  const [currentImage, setCurrentImage] = useState("pic1");
  const [isLoading, setIsLoading] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const { houseId } = useParams();
  const { userStatus } = useMainStore();
  const houses = useMainStore((state) => state.allHouses);

  const house = houses.find((h) => h.id === houseId);
  const { handleChat, chatRoomId } = useStartMessage(house);

  const navigate = useNavigate();

  useEffect(() => {
    if (chatRoomId) {
      navigate(`/messages/${chatRoomId}`);
    }
  }, [chatRoomId]);

  // Function to construct Google Maps URL
  const getGoogleMapsUrl = (lat, lng) => {
    return `https://www.google.com/maps/?q=${lat},${lng}`;
  };

  // Check if house has location data
  let hasLocationData;
  if (house.location?.lat && house.location?.lng) {
    hasLocationData = true;
  } else {
    hasLocationData = false;
  }
  const goBack = () => {
    navigate(-1); // Implements back functionality
  };

  const handleImageNavigation = (direction) => {
    const imageKeys = ["pic1", "pic2", "pic3"];
    const currentIndex = imageKeys.indexOf(currentImage);
    const nextIndex =
      (currentIndex + direction + imageKeys.length) % imageKeys.length;
    setCurrentImage(imageKeys[nextIndex]);
  };

  const handleOpenReportDialog = () => {
    setOpenReportDialog(true);
  };

  const handleCloseReportDialog = () => {
    setOpenReportDialog(false);
  };

  const handleChatRequest = async () => {
    if (userStatus === "chat blocked") {
      setSnackbarMessage(
        "You cannot send messages due to restrictions on your account."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } else {
      setIsLoading(true);
      await handleChat();
      setIsLoading(false);
    }
  };

  if (!house) {
    return <div>No house selected</div>;
  }
  if (house.status === "unlisted" || house.status === "blocked") {
    return <Box>House not available</Box>;
  }

  return (
    <Paper elevation={2} style={styles.container}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Report
        open={openReportDialog}
        onClose={handleCloseReportDialog}
        houseId={houseId}
        type={"house"}
      />
      <img src={house[currentImage]} alt="House" style={styles.image} />
      <Button onClick={() => handleImageNavigation(-1)}>Prev</Button>
      <Button onClick={() => handleImageNavigation(1)}>Next</Button>

      <Box style={styles.detailItem}>
        <Typography variant="h5">{house.owner}'s House</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" style={styles.detailItem}>
            Subcity: {house.subcity}
          </Typography>
          <Typography variant="body1" style={styles.detailItem}>
            Rooms: {house.rooms}
          </Typography>
          <Typography variant="body1" style={styles.detailItem}>
            Location: {house.area}
          </Typography>
          <Typography variant="body2">
            Date : {formatTimestamp(house.timestamp)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" style={styles.detailItem}>
            Price: {house.price} Birr
          </Typography>
          <Typography variant="body1" style={styles.detailItem}>
            Bathrooms: {house.bathroom}
          </Typography>
          <Typography variant="body1" style={styles.detailItem}>
            Details: {house.detail}
          </Typography>
        </Grid>
      </Grid>
      <Box sx={styles.roommateContainer}>
        {house.type === "roommate/shared" && (
          <RoommateDisplay houseData={house} />
        )}
      </Box>
      {hasLocationData ? (
        <Button
          variant="contained"
          color="secondary"
          sx={{ ...styles.mainBtns, ...styles.mapBtn }}
          onClick={() =>
            window.open(
              getGoogleMapsUrl(house.location.lat, house.location.lng),
              "_blank"
            )
          }
        >
          Location
          <FaMapMarkedAlt style={{ fontSize: "30px", marginLeft: "10px" }} />
        </Button>
      ) : (
        <Typography style={{ color: "red", marginLeft: "15px" }}>
          Location data not available.
        </Typography>
      )}
      <Box sx={styles.btnGroup}>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            style={styles.backButton}
            onClick={goBack}
          >
            <ArrowBackIcon />
          </Button>

          <Button
            disabled={isLoading}
            variant="contained"
            onClick={handleChatRequest}
            sx={{ ...styles.mainBtns, ...styles.contactButton }}
          >
            {isLoading ? (
              <div>
                <HashLoader color="black" size={20} />
              </div>
            ) : (
              "Contact"
            )}
            <EmailIcon sx={{ marginLeft: "5px", fontSize: "25px" }} />
          </Button>
          {house.phone && (
            <Button
              variant="contained"
              onClick={() => window.open(`tel:${house.phone}`)}
              sx={{ ...styles.mainBtns, ...styles.contactButton }}
            >
              Call
              <PhoneInTalkIcon sx={{ fontSize: "25px" }} />
            </Button>
          )}
        </Box>
        <Button
          disabled={isLoading}
          variant="contained"
          color="error"
          onClick={handleOpenReportDialog}
          sx={{ ...styles.mainBtns, ...styles.reportButton }}
        >
          Report
          <ReportIcon sx={{ marginLeft: "5px", fontSize: "25px" }} />
        </Button>
      </Box>
      <Box>
        <UserFeedback houseId={houseId} />
      </Box>
    </Paper>
  );
};

export default HouseDetails;
