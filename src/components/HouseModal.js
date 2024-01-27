import React, { useState } from "react";
import {
  Modal,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { HashLoader } from "react-spinners";
import EmailIcon from "@mui/icons-material/Email";
import CancelIcon from "@mui/icons-material/Cancel";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { ChatAuth } from "../context/ChatContext";
import useMainStore from "./store/mainStore";

const modalStyles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
};

const cardStyles = {
  card: {
    maxWidth: 600,
    width: "90%",
    maxHeight: "90vh",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    backgroundColor: "white",
    position: "relative",
  },
  media: {
    height: 200,
    objectFit: "contain",
    width: "100%",
  },
  content: {
    padding: "16px",
    backgroundColor: "#2D6072",
    color: "white",
    display: "flex", // Display as flex container
    flexDirection: "column", // Arrange items vertically
  },
  btnContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  requestBtn: {
    marginTop: "auto",
    color: "black",
    backgroundColor: "orange",
    alignSelf: "flex-start",
  },
  closeButton: {
    position: "absolute",
    top: "0px",
    right: "0px",
    color: "red",
    backgroundColor: "white",
    padding: "0px",
    width: "fit-content",
    fontSize: "30px",
  },
  navButtonsContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    gap: "10px", // provides spacing between the buttons
    color: "orange",
  },
  navButtons: {
    color: "orange",
    backgroundColor: "white",
    padding: "0",
  },
};

function formatTimestamp(timestamp) {
  const { seconds, nanoseconds } = timestamp;
  // Convert seconds and nanoseconds to milliseconds
  const milliseconds = seconds * 1000 + nanoseconds / 1000000;

  // Create a Date object using the milliseconds
  const date = new Date(milliseconds);

  // Get individual date components (year, month, day, hours, minutes, seconds)
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Month is 0-based, so add 1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const second = date.getSeconds();

  // Create a formatted string (e.g., "2023-09-01 14:30:45")
  const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}`;

  return formattedTimestamp;
}
const HouseModal = ({ open, onClose, house }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const userData = useMainStore((state) => state.userData);
  const { user } = UserAuth();
  const { createChatRoom } = ChatAuth();
  let fullName;
  if (userData) {
    fullName = userData.firstName + " " + userData.lastName;
  }

  if (!house) {
    return null;
  }
  const images = [house.pic1, house.pic2, house.pic3];

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 3);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? 2 : prevIndex - 1));
  };

  const handleRequest = async () => {
    setIsLoading(true);
    if (!userData.houseId) {
      console.log("Register your house first.");
      setOpenDialog(true);
      setIsLoading(false);
    } else if (user && house.userId && user.uid != house.userId) {
      // Create a chat room between the user and the house owner
      const chatRoomId = await createChatRoom(
        user.uid,
        house.userId,
        fullName,
        house.owner
      );
      setIsLoading(false);
      // use the chatRoomId to navigate to the chat room
      navigate(`/messages/${chatRoomId}`);
    } else if (user.uid == house.userId) {
      console.log("this is your own house");
      setOpenSnackbar(true);
      setIsLoading(false);
    } else {
      // Handle the case where user or house owner ID is missing
      console.error("User or house owner ID not found");
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box style={modalStyles.container}>
        <Card style={cardStyles.card}>
          <CardMedia
            component="img"
            style={cardStyles.media}
            image={images[currentImageIndex]}
            alt="House"
            loading="lazy"
          />
          <CardContent style={cardStyles.content}>
            <Box style={cardStyles.navButtonsContainer}>
              <Button
                onClick={handlePreviousImage}
                style={cardStyles.navButtons}
              >
                <NavigateBeforeIcon fontSize="large" sx={{ margin: "0px" }} />
              </Button>
              <Button onClick={handleNextImage} style={cardStyles.navButtons}>
                <NavigateNextIcon fontSize="large" />
              </Button>
            </Box>
            <Typography variant="h6">{house.subcity}</Typography>
            <Typography variant="subtitle1">
              {`Price: ${house.price}`} Birr
            </Typography>
            <Typography variant="subtitle1">{`By: ${house.owner}`}</Typography>
            <Typography variant="subtitle1">{`Rooms: ${house.rooms}`}</Typography>
            <Typography variant="subtitle1">{`Bathroom: ${house.bathroom}`}</Typography>
            <Typography variant="body2">
              {"Details : "}
              {house.detail}
            </Typography>
            <Typography variant="body2">
              Date : {formatTimestamp(house.timestamp)}
            </Typography>
            <Box sx={cardStyles.btnContainer}>
              <Button
                disabled={isLoading}
                variant="outlined"
                onClick={handleRequest}
                style={cardStyles.requestBtn}
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
              <CancelIcon onClick={onClose} style={cardStyles.closeButton} />
            </Box>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={4000}
              onClose={() => setOpenSnackbar(false)}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // position of the snackbar
            >
              <Alert
                onClose={() => setOpenSnackbar(false)}
                severity="info"
                variant="filled"
              >
                This is your own house.
              </Alert>
            </Snackbar>
            <Dialog
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  To message other owners you have to Register your house first.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  onClick={() => setOpenDialog(false)}
                  color="error"
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  autoFocus
                  onClick={() => navigate("/profile")}
                >
                  Register House
                </Button>
              </DialogActions>
            </Dialog>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default HouseModal;
