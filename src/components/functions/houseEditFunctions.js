// Import necessary dependencies here
import { Grid, IconButton, Typography } from "@mui/material";
import { formatTimestamp } from "../functions/houseFunctions";
import EditIcon from "@mui/icons-material/Edit";
import MapDisplay from "../profile/MapDisplay";
import RoommateDetails from "../profile/RoommateDetails";

const styles = {
  detailContainer: {
    display: "flex",
    flexDirection: "column",
    padding: "10px 0 5px 20px",
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
// Functions for handling various actions in EditHouse component
export const handleLocationInputChange =
  (locationInput, setLocationInput) => (e) => {
    setLocationInput({ ...locationInput, [e.target.name]: e.target.value });
  };

// Only render MapDisplay if location exists and has lat & lng
export const renderMapDisplay = (house) => {
  if (house?.location?.lat && house?.location?.lng) {
    return (
      <MapDisplay
        location={{ lat: house.location.lat, lng: house.location.lng }}
      />
    );
  } else {
    return <Typography>Location data is not available.</Typography>;
  }
};
export const renderHouseDetails = (house, openModal) => {
  let excludedKeys = [
    "pic1",
    "pic2",
    "pic3",
    "id",
    "userId",
    "location",
    "roommateData",
    "feedback",
  ];
  if (house.type !== "roommate/shared") {
    excludedKeys = [...excludedKeys, "peopleNeeded"];
  }
  if (house.type === "roommate/shared" || house.type === "sale") {
    excludedKeys = [...excludedKeys, "bathroom"];
  }
  if (house.type === "roommate/shared") {
    excludedKeys = [...excludedKeys, "areaSize"];
  }

  const details = Object.keys(house)
    .filter((key) => !excludedKeys.includes(key))
    .map((key) => (
      <Grid container spacing={2} key={key} style={styles.detailContainer}>
        <div style={styles.detailItemContainer}>
          <Typography variant="body1" style={styles.detailKey}>
            {key.charAt(0).toUpperCase() + key.slice(1)}:
          </Typography>
          <Typography variant="body1" style={styles.detailValue}>
            {key.toLowerCase().includes("date") ||
            key.toLowerCase().includes("timestamp")
              ? formatTimestamp(house[key])
              : house[key]}
          </Typography>
          {key !== "timestamp" &&
            key !== "type" &&
            key !== "owner" &&
            key !== "status" && (
              <IconButton
                size="small"
                onClick={() => openModal(key, house[key])}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
        </div>
      </Grid>
    ));

  // Conditionally render RoommateDetails if house type is "roommate/shared"
  const roommateDetailsComponent =
    house.type === "roommate/shared" ? (
      <RoommateDetails houseData={house} />
    ) : null;

  return (
    <>
      {details}
      {roommateDetailsComponent}
    </>
  );
};

export const redirectToGoogleMaps = (house) => {
  if (house.location?.lat && house.location?.lng) {
    const lat = house.location.lat;
    const lng = house.location.lng;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank");
  } else {
    // Handle the case where location data is not available
    console.error("Location data is not available for this house.");
  }
};
export const handleGetCurrentLocation = (
  houseId,
  handleHouseFieldChange,
  fetchHousesAndUpdateStore
) => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await handleHouseFieldChange(houseId, "location", {
            lat: latitude,
            lng: longitude,
          });
          await fetchHousesAndUpdateStore();
          console.log("Location updated successfully");
        } catch (error) {
          console.error("Error updating location:", error);
        }
      },
      (error) => {
        console.error("Error getting location:", error.message);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};

export const handleImageChange = (
  picKey,
  file,
  setSelectedFileNames,
  setNewImages,
  selectedFileNames,
  newImages
) => {
  if (file) {
    setSelectedFileNames({ ...selectedFileNames, [picKey]: file.name });
    setNewImages({ ...newImages, [picKey]: file });
  } else {
    setSelectedFileNames({ ...selectedFileNames, [picKey]: "" });
  }
};

export const handleSaveAllImages = async (
  isAnyImageSelected,
  houseId,
  houseUserId,
  newImages,
  updateHouseImages,
  fetchHousesAndUpdateStore,
  setSelectedFileNames,
  setIsLoading
) => {
  if (isAnyImageSelected) {
    setIsLoading(true);
    try {
      const response = await updateHouseImages(houseId, houseUserId, newImages);
      console.log("Images updated successfully", response);
      await fetchHousesAndUpdateStore();
      setSelectedFileNames({ pic1: "", pic2: "", pic3: "" });
    } catch (error) {
      console.error("Error saving images:", error);
    }
    setIsLoading(false);
  } else {
    console.log("No image selected");
  }
};

export const handleSaveField = async (
  houseId,
  fieldName,
  value,
  handleHouseFieldChange,
  fetchHousesAndUpdateStore,
  closeModal,
  setIsLoading
) => {
  try {
    await handleHouseFieldChange(houseId, fieldName, value);
    await fetchHousesAndUpdateStore();
    console.log(`Saved ${fieldName}: ${value}`);
    closeModal();
    setIsLoading(false);
  } catch (error) {
    console.error(`Error saving ${fieldName}:`, error);
  }
};

export const handleDeleteHouse = async (
  houseId,
  houseUserId,
  deleteHouse,
  setActiveLink
) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this house?"
  );
  if (confirmDelete) {
    try {
      if (houseId) {
        await deleteHouse(houseUserId, houseId);
        setActiveLink("home");
      } else {
        console.error("houseId is undefined or null");
      }
    } catch (error) {
      console.error("Error deleting the house:", error);
    }
  }
};
