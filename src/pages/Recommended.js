import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { UserAuth } from "../context/AuthContext";
import { HouseAuth } from "../context/HouseContext";
import useMainStore from "../components/store/mainStore";
import PreferencesModal from "../components/PreferencesModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import HouseModal from "../components/HouseModal";
import { HashLoader } from "react-spinners";

const Recommended = () => {
  const { user, setUserPreferences } = UserAuth();
  const { getHousesByPreferences, toggleHouseInFavorites } = HouseAuth();
  const userData = useMainStore((state) => state.userData);
  const [houses, setHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHouseData, setSelectedHouseData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const storedUserData = useMainStore((state) => state.userData);
  const setActivePage = useMainStore((state) => state.setActivePage);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    setActivePage("recommended");
  }, []);

  useEffect(() => {
    const fetchHouses = async () => {
      setIsLoading(true);
      if (userData?.preferences) {
        try {
          const fetchedHouses = await getHousesByPreferences(
            userData.preferences
          );
          setHouses(fetchedHouses);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.error("Failed to fetch houses:", error);
        }
      }
      setIsLoading(false);
    };

    fetchHouses();
  }, [userData.preferences]);

  const handleModalOpen = () => setModalOpen(true);

  const handleModalClose = () => setModalOpen(false);

  const handleSubmit = async (preferenceData) => {
    console.log("Submitted preferences:", preferenceData);
    try {
      await setUserPreferences(preferenceData);
      window.location.reload();
    } catch (error) {
      console.error("Could not set preferences:", error);
    }
    handleModalClose();
  };

  const handleToggleFavorites = async (userId, houseId) => {
    try {
      const updatedUser = { ...storedUserData }; // Create a copy of the user data

      // Toggle the houseId in the favorites array
      const favoritesIndex = updatedUser?.favorites?.indexOf(houseId);
      if (favoritesIndex !== -1) {
        updatedUser.favorites.splice(favoritesIndex, 1); // Remove from favorites
      } else {
        updatedUser.favorites.push(houseId); // Add to favorites
      }

      // Update the user data in Zustand
      useMainStore.getState().setUserData(updatedUser);
      await toggleHouseInFavorites(userId, houseId);
      console.log("House toggled in favorites successfully.");
    } catch (error) {
      console.error("Error toggling house in favorites:", error);
    }
  };

  // Handle Next Page button click
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  // Handle Previous Page button click
  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  // Function to open the modal and set the selected house data
  const openModal = (houseData) => {
    setSelectedHouseData(houseData);
    setModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedHouseData(null);
    setModalOpen(false);
  };

  const styles = {
    cardContainer: {
      width: { xs: "90%", md: "300px" },
      height: "400px",
      margin: "auto",
      backgroundColor: "white",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    cardImage: {
      minHeight: "200px",
      objectFit: "cover",
    },
    cardContent: {
      padding: "16px",
    },
    cardTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    cardText: {
      fontSize: "16px",
      marginBottom: "8px",
    },
    cardActions: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    detailsButton: {
      backgroundColor: "#2D6072",
      color: "white",
    },
  };

  return (
    <Box>
      <div>
        <Typography
          variant="h4"
          sx={{ color: "orange", fontWeight: "bold", textAlign: "center" }}
        >
          Recommended houses
        </Typography>
        {/* Check if userData exists */}
        {userData ? (
          // Check if preferences exist and contain at least one object
          userData.preferences && userData.preferences.length > 0 ? (
            <div>
              <h3>
                You can add more or edit your Preferences in{" "}
                <Button
                  variant="contained"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </Button>
              </h3>
            </div>
          ) : (
            <div>
              <p>You haven't set your preferences yet.</p>
              {/* Display a button that could lead to a preferences setting page */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleModalOpen}
              >
                Set Preferences
              </Button>
            </div>
          )
        ) : (
          <p>You need to be logged in to set preferences.</p>
        )}
        <PreferencesModal
          open={modalOpen}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
        />
      </div>
      <Box>
        {isLoading ? (
          // Loading screen
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <HashLoader />
            Loading houses...
          </div>
        ) : houses?.length === 0 ? (
          // Empty data message
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Typography variant="h6">No houses found.</Typography>
          </div>
        ) : (
          // Display favorite houses
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr 1fr",
              },
              gap: "20px",
              width: "100%",
              marginTop: "20px",
              color: "black",
            }}
          >
            {houses
              ?.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((house) => (
                <Card key={house.id} sx={styles.cardContainer}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={house.pic1} // Replace with the actual image URL
                    alt={house.subcity}
                    sx={styles.cardImage}
                  />
                  <CardContent sx={styles.cardContent}>
                    <Typography variant="h6" sx={styles.cardTitle}>
                      {house.subcity}
                    </Typography>
                    <Typography variant="h6" sx={styles.cardText}>
                      {house.price} Birr
                    </Typography>
                    <Typography variant="h6" sx={styles.cardText}>
                      {house.area}
                    </Typography>
                    <Typography variant="h6" sx={styles.cardText}>
                      {house.rooms} Room
                    </Typography>
                    <Box sx={styles.cardActions}>
                      <IconButton
                        aria-label="Add to favorites"
                        sx={{
                          color: storedUserData?.favorites?.includes(house.id)
                            ? "red"
                            : "gray",
                        }}
                        onClick={() =>
                          handleToggleFavorites(user.uid, house.id)
                        }
                      >
                        <FavoriteOutlinedIcon />
                      </IconButton>
                      <Button
                        variant="contained"
                        onClick={() => openModal(house)}
                        sx={styles.detailsButton}
                      >
                        Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
          </Box>
        )}
        <div>
          {/* Modal */}
          <HouseModal
            open={modalOpen}
            onClose={closeModal}
            house={selectedHouseData}
          />
          {/* Previous and Next navigation */}
          <div>
            {currentPage > 1 && (
              <Button variant="outlined" onClick={handlePreviousPage}>
                Previous
              </Button>
            )}
            {currentPage * itemsPerPage < houses?.length && (
              <Button variant="outlined" onClick={handleNextPage}>
                Next
              </Button>
            )}
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default Recommended;
