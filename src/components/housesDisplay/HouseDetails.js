// HouseDetails.js
import React, { useEffect, useState } from "react";
import { Paper, Typography, Grid, Box, Button } from "@mui/material";
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
    margin: "20px 10px 0 10px",
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
    marginLeft: "15px",
    fontSize: "14px",
  },
  roommateContainer: {
    width: "100%",
    background: "yellow",
  },
  btnGroup: {
    width: "100%",
    marginLeft: "15px",
  },
};

const HouseDetails = () => {
  const [currentImage, setCurrentImage] = useState("pic1");
  const [isLoading, setIsLoading] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const { houseId } = useParams();

  const houses = useMainStore((state) => state.allHouses);

  const house = houses.find((h) => h.id === houseId);
  const { handleChat, chatRoomId } = useStartMessage(house);

  const navigate = useNavigate();

  useEffect(() => {
    if (chatRoomId) {
      console.log("Chat Room ID:", chatRoomId);
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
  // useEffect(() => {
  //   window.scrollTo(0, 0); // Scroll to the top of the window
  // }, []);

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
    setIsLoading(true);
    await handleChat();
    setIsLoading(false);
  };

  if (!house) {
    return <div>No house selected</div>;
  }

  return (
    <Paper elevation={2} style={styles.container}>
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
            Area: {house.area}
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
