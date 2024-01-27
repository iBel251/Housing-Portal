import React, { useState } from "react";
import {
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import useMainStore from "../store/mainStore";
import {
  formatTimestamp,
  useFetchAllHouses,
} from "../functions/houseFunctions";
import { HouseAuth } from "../../context/HouseContext";
import { HashLoader } from "react-spinners";
import EditIcon from "@mui/icons-material/Edit";
import FieldEditModal from "./FieldEditModal.js";
import MapDisplay from "./MapDisplay.js";

const styles = {
  container: {
    padding: "20px",
    margin: "20px auto",
    maxWidth: "800px",
  },
  image: {
    height: "150px",
    maxHeight: "400px",
    objectFit: "cover",
  },
  detailItem: {
    margin: "10px 0",
  },
  imageContainer: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "20px",
    flexWrap: "wrap",
    justifyContent: "space-between",
    "@media (max-width: 600px)": {
      display: "flex", // Make horizontal
      flexDirection: "column",
    },
  },
  imageBox: {
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column",
  },
  emptyImage: {
    textAlign: "center",
    color: "grey",
    width: "120px",
  },
  saveAllButton: {
    marginTop: "20px",
    backgroundColor: "#2D6072",
  },
  fileInput: {
    display: "none", // Hide the actual input
  },
  uploadButton: {
    // Styling for the custom upload button
    backgroundColor: "orange",
    color: "white",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100px",
    ":hover": {
      backgroundColor: "#45a049",
    },
  },
  fileName: {
    width: "150px",
  },
  detailItemContainer: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #ddd", // Border in the middle
    padding: "10px 0",
  },
  detailKey: {
    fontWeight: "bold",
    marginRight: "10px",
  },
  detailValue: {
    flex: 1,
  },
};

const EditHouse = ({ houseId }) => {
  const { updateHouseImages, handleHouseFieldChange, deleteHouse } =
    HouseAuth();
  const fetchHousesAndUpdateStore = useFetchAllHouses();
  const houses = useMainStore((state) => state.allHouses);
  const { activeLink, setActiveLink } = useMainStore();
  const house = houses.find((h) => h.id === houseId);
  const [isLoading, setIsLoading] = useState(false);
  const [newImages, setNewImages] = useState({
    pic1: null,
    pic2: null,
    pic3: null,
  });
  const [selectedFileNames, setSelectedFileNames] = useState({
    pic1: "",
    pic2: "",
    pic3: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFieldName, setEditFieldName] = useState("");
  const [editedValue, setEditedValue] = useState("");

  const openModal = (fieldName, initialValue) => {
    setEditFieldName(fieldName);
    setEditedValue(initialValue);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const redirectToGoogleMaps = () => {
    const lat = house.location?.lat;
    const lng = house.location?.lng;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleSaveField = async (fieldName, value) => {
    // Call the handleFieldChange function with houseId, field name, and new value
    try {
      await handleHouseFieldChange(houseId, fieldName, value);
      await fetchHousesAndUpdateStore();
      console.log(`Saved ${fieldName}: ${value}`);
      closeModal();
      setIsLoading(false);
    } catch (error) {
      console.error(`Error saving ${fieldName}:`, error);
      // Handle error (e.g., show an error message to the user)
    }
  };
  // Check if any image is selected
  const isAnyImageSelected = Object.values(selectedFileNames).some(
    (fileName) => fileName !== ""
  );

  const handleImageChange = (picKey, file) => {
    if (file) {
      setSelectedFileNames({ ...selectedFileNames, [picKey]: file.name });
      setNewImages({ ...newImages, [picKey]: file });
    } else {
      setSelectedFileNames({ ...selectedFileNames, [picKey]: "" });
    }
  };

  const handleSaveAllImages = async () => {
    if (isAnyImageSelected) {
      setIsLoading(true);
      try {
        // Call the updateHouseImages function with houseId, user ID, and new images
        const response = await updateHouseImages(
          houseId,
          house.userId,
          newImages
        );
        console.log("Images updated successfully", response);
        // Refresh the houses in the Zustand store
        await fetchHousesAndUpdateStore();
        setSelectedFileNames({ pic1: "", pic2: "", pic3: "" });
        // Optionally, update the local state or UI based on the successful update
      } catch (error) {
        console.error("Error saving images:", error);
        // Handle error (e.g., show an error message to the user)
      }
      setIsLoading(false);
    } else {
      console.log("no image");
    }
  };

  const handleFileButtonClick = (e, picKey) => {
    e.preventDefault(); // Prevent the default action
    e.stopPropagation(); // Stop the event from bubbling up
    document.getElementById(`file-input-${picKey}`).click();
  };
  const isDate = (key) => {
    // Define a pattern to recognize date properties
    return (
      key.toLowerCase().includes("date") ||
      key.toLowerCase().includes("timestamp")
    );
  };
  const renderHouseDetails = () => {
    // Exclude certain keys
    let excludedKeys = ["pic1", "pic2", "pic3", "id", "userId", "location"];
    if (house.type !== "roommate/shared") {
      excludedKeys = [...excludedKeys, "peopleNeeded"];
    }
    if (house.type === "roommate/shared" || house.type === "sale") {
      excludedKeys = [...excludedKeys, "bathroom"];
    }
    // Filter out the excluded keys and map over the remaining ones
    return (
      <div>
        {Object.keys(house)
          .filter((key) => !excludedKeys.includes(key))
          .map((key) => (
            <div key={key} style={styles.detailItemContainer}>
              <Typography variant="body1" style={styles.detailKey}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </Typography>
              <Typography variant="body1" style={styles.detailValue}>
                {isDate(key) ? formatTimestamp(house[key]) : house[key]}
              </Typography>
              {key !== "timestamp" && key !== "type" && key != "owner" && (
                <IconButton
                  size="small"
                  onClick={() => openModal(key, house[key])}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </div>
          ))}
      </div>
    );
  };

  const handleDeleteHouse = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this house?"
    );

    if (confirmDelete) {
      try {
        // Confirm that houseId is defined in props
        if (houseId) {
          // Call the deleteHouse function with userId and houseId
          await deleteHouse(house.userId, houseId);
          setActiveLink("home");
          // Optionally, update the local state or UI based on the successful deletion
        } else {
          console.error("houseId is undefined or null");
        }
      } catch (error) {
        console.error("Error deleting the house:", error);
        // Handle error (e.g., show an error message to the user)
      }
    }
  };

  if (!house) {
    return <div>No house selected</div>;
  }

  const images = [house.pic1, house.pic2, house.pic3];

  return (
    <Box>
      <Paper elevation={3} style={styles.container}>
        <Button
          variant="contained"
          style={{ backgroundColor: "#FF0000", marginTop: "20px" }}
          onClick={handleDeleteHouse}
        >
          Delete House
        </Button>
        <Box sx={styles.imageContainer}>
          {images.map((img, index) => {
            const picKey = `pic${index + 1}`;
            return (
              <Box key={picKey} style={styles.imageBox}>
                {img ? (
                  <img src={img} alt={picKey} style={styles.image} />
                ) : (
                  <Typography style={{ ...styles.image, ...styles.emptyImage }}>
                    Image {index + 1} is empty
                  </Typography>
                )}
                <input
                  id={`file-input-${picKey}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(picKey, e.target.files[0])}
                  style={styles.fileInput}
                />
                <label
                  htmlFor={`file-input-${picKey}`}
                  style={styles.uploadButton}
                  onClick={(e) => handleFileButtonClick(e, picKey)}
                >
                  Upload Image
                </label>
                {selectedFileNames[picKey] && (
                  <Typography style={styles.fileName}>
                    {selectedFileNames[picKey]}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>

        <Button
          variant="contained"
          style={styles.saveAllButton}
          onClick={handleSaveAllImages}
          disabled={!isAnyImageSelected || isLoading}
        >
          {isLoading ? (
            <Box display="flex" alignItems="center">
              <HashLoader size={20} color="#FFF" />
              <Typography
                variant="body2"
                style={{ marginLeft: 10, color: "white" }}
              >
                Uploading...
              </Typography>
            </Box>
          ) : (
            "Save Images"
          )}
        </Button>

        <Box style={styles.detailItem}>
          <Typography variant="h5">{house.owner}'s House</Typography>
        </Box>

        <Grid container spacing={2}>
          {renderHouseDetails(openModal)}
        </Grid>
        <FieldEditModal
          isOpen={isModalOpen}
          onClose={closeModal}
          fieldName={editFieldName}
          houseData={house}
          onSave={handleSaveField}
          value={house[editFieldName]}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </Paper>
      <Box style={{ marginTop: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={redirectToGoogleMaps}
          style={{ marginTop: "20px" }}
        >
          Open in Google Maps
        </Button>
        <Typography variant="h6">House Location on Map</Typography>
        <MapDisplay
          location={{ lat: house.location?.lat, lng: house.location?.lng }}
        />
      </Box>
    </Box>
  );
};

export default EditHouse;
