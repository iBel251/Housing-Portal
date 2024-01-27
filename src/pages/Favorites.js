import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Avatar,
  Box,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import { HashLoader } from "react-spinners";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { UserAuth } from "../context/AuthContext";
import { HouseAuth } from "../context/HouseContext";
import useMainStore from "../components/store/mainStore";
import HouseModal from "../components/HouseModal";

const styles = {
  root: {
    flexGrow: 1,
  },
  appBar: {
    marginBottom: "5px",
    backgroundColor: "orange",
    color: "#2D6072",
  },
  paper: {
    padding: "5px",
  },
  avatar: {
    marginRight: "5px",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
  },
};

function Favorites() {
  const { user } = UserAuth();
  const { toggleHouseInFavorites, getFevoriteHousesByIds } = HouseAuth();
  const [houses, setHouses] = useState([]); // Store fetched houses here
  const [isLoading, setIsLoading] = useState(true);
  const [privateBathroom, setPrivateBathroom] = useState(false);
  const [selectedHouseData, setSelectedHouseData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const storedUserData = useMainStore((state) => state.userData);

  const PAGE_SIZE = 5; // Number of houses per page
  const favHouseIds = useMainStore((state) => state.userData.favorites);
  useEffect(() => {
    if (favHouseIds.length > 0) {
      const fetchFavHouses = async () => {
        setIsLoading(true);
        try {
          const favHouseData = await getFevoriteHousesByIds(favHouseIds);
          setIsLoading(false);
          if (favHouseData) {
            // Store the userData in Zustand store
            // useMainStore.getState().setFavoriteHouses(favHouseData);
            setHouses(favHouseData);
          }
        } catch (error) {
          console.log("Error fetching user and house data:", error);
          setIsLoading(false);
        }
      };
      fetchFavHouses();
    } else {
      setIsLoading(false); // Set loading to false when there are no favorite house IDs
    }
  }, [favHouseIds]);
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
      flexDirection: "column", // Ensure content stacks vertically
    },
    cardImage: {
      minHeight: "200px",
      objectFit: "cover", // Maintain aspect ratio and cover the entire card
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
    <div className="spinner-parent">
      {isLoading ? (
        // Loading screen
        <div className="spinner-contained-container">
          <HashLoader color="orange" size={100} />
          <div className="spinner-text">Loading...</div>
        </div>
      ) : houses.length === 0 ? (
        // Empty data message
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Typography variant="h6">No favorite houses found.</Typography>
        </div>
      ) : (
        // Display favorite houses
        <Box>
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
            {houses.map((house) => (
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
                      onClick={() => handleToggleFavorites(user.uid, house.id)}
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
        </Box>
      )}

      {/* Modal */}
      <HouseModal
        open={modalOpen}
        onClose={closeModal}
        house={selectedHouseData}
      />
    </div>
  );
}

export default Favorites;
