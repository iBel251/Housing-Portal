// HouseDetails.js
import React, { useEffect, useState } from "react";
import { Paper, Typography, Grid, Box, Button } from "@mui/material";
import useMainStore from "./store/mainStore";
import { useParams, useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import { HashLoader } from "react-spinners";
import { formatTimestamp } from "./functions/houseFunctions";
import { useStartMessage } from "./functions/chatFunctions";

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
  },
  contactButton: {
    marginTop: "20px",
  },
  longText: {
    whiteSpace: "pre-line", // Ensures proper rendering of newlines
  },
  mapBtn: {
    marginLeft: "15px",
    fontSize: "10px",
  },
};

const HouseDetails = () => {
  const [currentImage, setCurrentImage] = useState("pic1");
  const [isLoading, setIsLoading] = useState(false);
  const { houseId } = useParams();

  const houses = useMainStore((state) => state.allHouses);

  const house = houses.find((h) => h.id === houseId);
  const { handleChat, chatRoomId } = useStartMessage(house);

  const navigate = useNavigate();

  useEffect(() => {
    if (chatRoomId) {
      console.log("Chat Room ID:", chatRoomId);
      navigate(`/messages/${chatRoomId}`);
      // You can navigate to the chat room or perform other actions here.
    }
  }, [chatRoomId]);

  // Function to construct Google Maps URL
  const getGoogleMapsUrl = (lat, lng) => {
    return `https://www.google.com/maps/?q=${lat},${lng}`;
  };

  // Check if house has location data
  const hasLocationData =
    house.location && house.location.lat && house.location.lng;

  const goBack = () => {
    navigate(-1); // Implements back functionality
  };
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the window
  }, []);

  const handleImageNavigation = (direction) => {
    const imageKeys = ["pic1", "pic2", "pic3"];
    const currentIndex = imageKeys.indexOf(currentImage);
    const nextIndex =
      (currentIndex + direction + imageKeys.length) % imageKeys.length;
    setCurrentImage(imageKeys[nextIndex]);
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
    <Paper elevation={3} style={styles.container}>
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
        {hasLocationData ? (
          <Button
            variant="contained"
            color="secondary"
            style={styles.mapBtn}
            onClick={() =>
              window.open(
                getGoogleMapsUrl(house.location.lat, house.location.lng),
                "_blank"
              )
            }
          >
            View location on Google Maps
          </Button>
        ) : (
          <Typography style={{ color: "red", marginLeft: "15px" }}>
            Location data not available.
          </Typography>
        )}
      </Grid>

      {/* Add a back button or more functionality as needed */}
      <Button
        variant="contained"
        color="primary"
        style={styles.backButton}
        onClick={goBack}
      >
        Go Back
      </Button>

      <Button
        disabled={isLoading}
        variant="outlined"
        onClick={handleChatRequest}
        style={styles.contactButton}
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
    </Paper>
  );
};

export default HouseDetails;
