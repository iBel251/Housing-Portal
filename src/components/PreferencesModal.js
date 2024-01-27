import React, { useState } from "react";
import {
  Modal,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  InputLabel,
  Input,
  FormControl,
  Select,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material";

const styles = {
  modalContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  modalPaper: {
    padding: "20px",
    width: "300px",
    textAlign: "center",
    maxHeight: "90vh",
    overflow: "auto", // Add scrollbars when content overflows
  },
  formField: {
    marginBottom: "15px",
    width: "100%",
  },
  imagePreview: {
    width: "50px",
    height: "auto",
    marginBottom: "10px",
  },
};

const PreferencesModal = ({ open, onClose, onSubmit }) => {
  const [preferenceData, setPreferenceData] = useState({
    subcity: "",
    rooms: 0,
    bathroom: "",
    price: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const subcities = [
    "Any",
    "Arada",
    "Addis Ketema",
    "Bole",
    "Gullele",
    "Kirkos",
    "Kolfe Keranio",
    "Lideta",
    "Nifas Silk-Lafto",
    "Yeka",
  ];

  const handleFieldChange = (fieldName, value) => {
    setError("");
    setPreferenceData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const isValid = (data) => {
    // Check if data is not an empty string
    if (data.subcity === "" || data.bathroom === "" || data.price === "") {
      return false;
    }

    // Check if rooms is not 0
    if (data.rooms === 0) {
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    // Validate the preference data
    if (!isValid(preferenceData)) {
      setError("Invalid preference data");
      return;
    }
    setIsLoading(true);
    onSubmit(preferenceData);
    console.log(preferenceData);
  };

  return (
    <Modal open={open} onClose={onClose} style={styles.modalContainer}>
      <Paper elevation={3} style={styles.modalPaper}>
        <Box
          sx={{
            background: "#2D6072",
            p: "5px",
            borderRadius: "5px",
            color: "orange",
            mx: "-20px",
            mb: "15px",
          }}
        >
          <Typography variant="h6">Set your preferences.</Typography>
        </Box>

        {/* Form fields for editing */}
        <FormControl style={styles.formField}>
          <InputLabel>Subcity</InputLabel>
          <Select
            value={preferenceData.subcity}
            fullWidth
            onChange={(event) =>
              handleFieldChange("subcity", event.target.value)
            }
          >
            {/* Dropdown options */}
            {subcities.map((subcity, index) => (
              <MenuItem key={index} value={subcity}>
                {subcity}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Rooms"
          variant="outlined"
          type="number"
          fullWidth
          style={styles.formField}
          value={preferenceData.rooms}
          onChange={(e) => handleFieldChange("rooms", e.target.value)}
        />
        <FormControl style={styles.formField}>
          <InputLabel>Bathroom</InputLabel>
          <Select
            value={preferenceData.bathroom}
            fullWidth
            onChange={(event) =>
              handleFieldChange("bathroom", event.target.value)
            }
          >
            {/* Dropdown options */}
            <MenuItem value="any">Any</MenuItem>
            <MenuItem value="private">Private</MenuItem>
            <MenuItem value="shared">Shared</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" style={styles.formField}>
          <InputLabel>Price-Range</InputLabel>
          <Select
            value={preferenceData.price}
            onChange={(e) => handleFieldChange("price", e.target.value)}
            label="pricerange"
            fullWidth
            style={styles.formField}
            required
          >
            <MenuItem value="any">Any</MenuItem>
            <MenuItem value="1-5000">0 - 5k Birr</MenuItem>
            <MenuItem value="5000-9000">5k - 9k Birr</MenuItem>
            <MenuItem value="9000-15000">9k - 15k Birr</MenuItem>
            <MenuItem value="15000-200000">15k+ Birr</MenuItem>
          </Select>
        </FormControl>
        <Typography sx={{ color: "red" }}>{error}</Typography>
        <Button variant="outlined" color="primary" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ background: "#2D6072", color: "orange" }}
        >
          {isLoading ? <CircularProgress size={"25px"} /> : "Save Changes"}
        </Button>
      </Paper>
    </Modal>
  );
};

export default PreferencesModal;
