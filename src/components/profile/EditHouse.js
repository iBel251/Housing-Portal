import React, { useState } from "react";
import { Paper, Typography, Box, Button } from "@mui/material";
import useMainStore from "../store/mainStore";
import { useFetchAllHouses } from "../functions/houseFunctions";
import { HouseAuth } from "../../context/HouseContext";
import { HashLoader } from "react-spinners";
import FieldEditModal from "./FieldEditModal.js";
import {
  handleDeleteHouse,
  handleSaveField,
  handleSaveAllImages,
  handleGetCurrentLocation,
  redirectToGoogleMaps,
  renderHouseDetails,
  renderMapDisplay,
} from "../functions/houseEditFunctions.js";
import FeedbackDisplay from "./FeedbackDisplay.js";

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

  // Check if any image is selected
  const isAnyImageSelected = Object.values(selectedFileNames).some(
    (fileName) => fileName !== ""
  );

  // Modified call to handleImageChange function
  const onImageChange = (picKey, file) => {
    if (file) {
      setSelectedFileNames((prev) => ({ ...prev, [picKey]: file.name }));
      setNewImages((prev) => ({ ...prev, [picKey]: file }));
    } else {
      setSelectedFileNames((prev) => ({ ...prev, [picKey]: "" }));
    }
  };

  // Corrected call to handleSaveAllImages function
  const onSaveAllImages = async () => {
    await handleSaveAllImages(
      isAnyImageSelected,
      houseId,
      house.userId,
      newImages,
      updateHouseImages,
      fetchHousesAndUpdateStore,
      setSelectedFileNames,
      setIsLoading
    );
  };

  const handleFileButtonClick = (e, picKey) => {
    e.preventDefault(); // Prevent the default action
    e.stopPropagation(); // Stop the event from bubbling up
    document.getElementById(`file-input-${picKey}`).click();
  };

  // Function to handle saving a field
  const onSaveField = (fieldName, value) => {
    handleSaveField(
      houseId,
      fieldName,
      value,
      handleHouseFieldChange,
      fetchHousesAndUpdateStore,
      closeModal,
      setIsLoading
    );
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
          onClick={() =>
            handleDeleteHouse(houseId, house.userId, deleteHouse, setActiveLink)
          }
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
                  onChange={(e) => onImageChange(picKey, e.target.files[0])}
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
          onClick={onSaveAllImages}
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

        {renderHouseDetails(house, openModal)}

        <FieldEditModal
          isOpen={isModalOpen}
          onClose={closeModal}
          fieldName={editFieldName}
          houseData={house}
          onSave={onSaveField}
          value={house[editFieldName]}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </Paper>
      <Box style={{ marginTop: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => redirectToGoogleMaps(house)}
          style={{ marginTop: "20px" }}
          disabled={!house?.location?.lat || !house?.location?.lng}
        >
          Open in Google Maps
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            handleGetCurrentLocation(
              houseId,
              handleHouseFieldChange,
              fetchHousesAndUpdateStore
            )
          }
          style={{ marginTop: "20px" }}
        >
          {house?.location?.lat && house?.location?.lng
            ? "Update Location"
            : "Set Current Location"}
        </Button>
        <Typography variant="h6">House Location on Map</Typography>
        {renderMapDisplay(house)}
      </Box>
      <Box>
        {house?.feedback ? (
          <FeedbackDisplay feedbackData={house.feedback} />
        ) : null}
      </Box>
    </Box>
  );
};

export default EditHouse;
