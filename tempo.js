import React from "react";
import useMainStore from "../components/store/mainStore";
import { UserAuth } from "../context/AuthContext";
import { HouseAuth } from "../context/HouseContext";
import {
  Avatar,
  Typography,
  Paper,
  Container,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import PersonIcon from "@mui/icons-material/Person";
import HouseRegisterModal from "../components/HouseRegisterModal";
import { useState } from "react";
import HouseEditModal from "../components/HouseEditModal";
import Preferences from "../components/Preferences";

const styles = {
  main: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    minHeight: "50vh",
    width: "auto",
    padding: "0",
    margin: "0",
  },
  paper: {
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  upperSection: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    background: "#2D6072",
    width: "100%",
    py: "5px",
    borderRadius: "5px",
    color: "orange",
  },
  avatar: {
    width: "150px",
    height: "150px",
    marginBottom: "15px",
  },
  name: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  email: {
    fontSize: "1rem",
  },
  houseDetails: {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    maxWidth: "400px",
    boxSizing: "border-box",
  },
  imageContainer: {
    height: "400px",
    width: "300px",
    display: "flex",
    alignItems: "center",
    margin: "auto",
  },
  imageNavigation: {
    display: "flex",
    justifyContent: "center",
  },
  houseImage: {
    width: "100%",
    maxHeight: "80%",
    objectFit: "contain",
    marginBottom: "10px",
    margin: "auto",
  },
};

const Profile = () => {
  const storedUserData = useMainStore((state) => state.userData);
  const storedUserHouse = useMainStore((state) => state.userHouse);
  const toggleRefetch = useMainStore((state) => state.toggleRefetch);
  const { user } = UserAuth();
  const { registerHouse, editHouse, getHouseDetailsById, deleteHouse } =
    HouseAuth();

  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false); // State for the modal
  const [isEditModalOpen, setEditModalOpen] = useState(false); // State for the modal
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isHouseDataEmpty = !(
    storedUserHouse &&
    Object.keys(storedUserHouse).some((key) => storedUserHouse[key] !== "")
  );

  const handleRegisterModalOpen = () => {
    setRegisterModalOpen(true);
  };

  const handleRegisterModalClose = () => {
    setRegisterModalOpen(false);
  };
  const handleEditModalOpen = () => {
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleNextImage = () => {
    const totalImages = 3; // Assuming there are 3 images (pic1, pic2, pic3)
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  const handlePreviousImage = () => {
    const totalImages = 3; // Assuming there are 3 images (pic1, pic2, pic3)
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1
    );
  };

  const handleHouseSubmit = async (formData) => {
    const fullName = storedUserData.firstName + " " + storedUserData.lastName;
    console.log(formData);
    try {
      const houseId = await registerHouse(user.uid, formData, fullName);
      console.log("House registered with ID:", houseId);
      fetchHouseData(houseId);
      toggleRefetch();
      setRegisterModalOpen(false);
    } catch (error) {
      console.error("Error registering a house:", error);
      setRegisterModalOpen(false);
    }
  };

  const handleDeleteHouse = async (userId, houseId) => {
    try {
      // Call the deleteHouse function from your HouseAuth context
      await deleteHouse(userId, houseId);

      // Clear the house data from Zustand store
      useMainStore.getState().setUserHouse();

      console.log("House deleted successfully.");
    } catch (error) {
      console.error("Error deleting the house:", error);
    }
  };

  const fetchHouseData = async (houseId) => {
    if (houseId) {
      const houseData = await getHouseDetailsById(houseId);
      if (houseData) {
        // Store the houseData in Zustand store
        useMainStore.getState().setUserHouse(houseData);
      } else {
        console.log("House data not found");
      }
    }
  };

  const handleHouseEdit = async (formData, imagesTobeDeleted) => {
    try {
      const houseId = await editHouse(
        user.uid,
        storedUserData.houseId,
        formData
      );
      setEditModalOpen(false);
      fetchHouseData(houseId);
      console.log("House edited with ID:", houseId);
    } catch (error) {
      setEditModalOpen(false);
      console.error("Error editing a house:", error);
    }
  };
  return (
    <Box sx={styles.main}>
      <Container component="main" sx={styles.container}>
        <Paper elevation={3} sx={styles.paper}>
          <Box sx={styles.upperSection}>
            <Avatar
              src={storedUserData?.pictureUrl || ""}
              alt="Profile"
              sx={styles.avatar}
            >
              {storedUserData.pictureUrl ? null : <PersonIcon />}
            </Avatar>
            <Typography sx={styles.name}>
              {storedUserData?.firstName} {storedUserData?.lastName}
            </Typography>
            <Typography sx={styles.email}>{user.email}</Typography>
          </Box>
          {/* Display other user data properties */}
          {isHouseDataEmpty ? (
            <Paper elevation={1} sx={styles.houseDetails}>
              <Typography variant="h6">House Details</Typography>
              <Typography>You haven't registered your house yet.</Typography>
              <Button
                variant="contained"
                onClick={handleRegisterModalOpen}
                sx={{ background: "#2D6072", color: "orange" }}
              >
                Register House
              </Button>
            </Paper>
          ) : (
            <Paper elevation={1} sx={styles.houseDetails}>
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "orange",
                  p: "5px",
                  color: "#2D6072",
                  borderRadius: "5px",
                  margin: "-10px",
                }}
              >
                House Details{" "}
                <Button
                  variant="contained"
                  onClick={handleRegisterModalOpen}
                  sx={{ background: "#2D6072", color: "orange" }}
                >
                  Add House
                </Button>
              </Typography>
              <Button
                variant="contained"
                onClick={() =>
                  handleDeleteHouse(user.uid, storedUserData.houseId)
                }
                sx={{ background: "red", color: "white" }}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                onClick={handleEditModalOpen}
                sx={{ background: "#2D6072", color: "orange" }}
              >
                Edit
              </Button>

              <Box sx={styles.imageContainer}>
                {storedUserHouse.pic1 && (
                  <img
                    src={storedUserHouse[`pic${currentImageIndex + 1}`]}
                    alt="House"
                    style={styles.houseImage}
                  />
                )}
              </Box>
              <div style={styles.imageNavigation}>
                <IconButton
                  color="primary"
                  aria-label="Previous Image"
                  onClick={handlePreviousImage}
                  sx={{ background: "orange" }}
                >
                  <NavigateBeforeIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  aria-label="Next Image"
                  onClick={handleNextImage}
                  sx={{ background: "orange" }}
                >
                  <NavigateNextIcon />
                </IconButton>
              </div>
              <Box
                sx={{
                  color: "orange",
                  margin: "-10px",
                  mt: "10px",
                  p: "5px",
                  borderRadius: "5px",
                  background: "#2D6072",
                }}
              >
                <Typography>
                  Subcity: {storedUserHouse.subcity || "N/A"}
                </Typography>
                <Typography>Rooms: {storedUserHouse.rooms || "N/A"}</Typography>
                <Typography>
                  Bathroom: {storedUserHouse.bathroom || "N/A"}
                </Typography>
                <Typography>Price: {storedUserHouse.price || "N/A"}</Typography>
                <Typography>Area: {storedUserHouse.area || "N/A"}</Typography>
                <Typography>
                  Detail: {storedUserHouse.detail || "N/A"}
                </Typography>
              </Box>
            </Paper>
          )}
        </Paper>
        <HouseRegisterModal
          open={isRegisterModalOpen}
          onClose={handleRegisterModalClose}
          onSubmit={handleHouseSubmit}
        />
        <HouseEditModal
          open={isEditModalOpen}
          onClose={handleEditModalClose}
          houseData={storedUserHouse}
          onEditSubmit={handleHouseEdit}
        />
      </Container>
      <Preferences userData={storedUserData} />
    </Box>
  );
};

export default Profile;
