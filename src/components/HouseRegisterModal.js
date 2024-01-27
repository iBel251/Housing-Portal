import React, { useState } from "react";
import {
  Modal,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Input,
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
    overflow: "auto",
  },
  formControl: {
    width: "100%",
    marginBottom: "10px",
  },
};
const HouseRegisterModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: "",
    peopleNeeded: 0,
    subcity: "",
    bathroom: "",
    rooms: 0,
    price: 0,
    detail: "",
    area: "",
    pic1: null,
    pic2: null,
    pic3: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const subcities = [
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
  const types = ["Rental", "Exchange", "Sale", "Roommate/Shared"];
  const validateForm = () => {
    const { subcity, bathroom, rooms, price, detail, area, pic1 } = formData;

    if (
      !subcity ||
      !bathroom ||
      !rooms ||
      !price ||
      !detail ||
      !area ||
      !pic1
    ) {
      return false;
    }

    if (rooms === 0 || price === 0) {
      return false;
    }

    return true;
  };
  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleImageChange = (field, event) => {
    const selectedImage = event.target.files[0];
    handleInputChange(field, selectedImage);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      // Show an alert or update a state variable to show a message to the user.
      alert("Please fill all the required fields and atleast 1 image.");
      return;
    }
    setIsLoading(true);
    onSubmit(formData); // Pass the form data to the parent component
    // onClose(); // Close the modal after submitting
    console.log(formData);
  };

  return (
    <Modal open={open} onClose={onClose} style={styles.modalContainer}>
      <Paper elevation={3} style={styles.modalPaper}>
        <Typography variant="h6">Register Your House</Typography>
        <Typography>
          Fill in the details to register your house for listing.
        </Typography>
        <FormControl style={styles.formControl}>
          <InputLabel>Type</InputLabel>
          <Select
            value={formData.type}
            onChange={(event) => handleInputChange("type", event.target.value)}
          >
            {types.map((type) => (
              <MenuItem key={type} value={type.toLowerCase()}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {formData.type === "roommate/shared" && (
          <TextField
            label="People Needed"
            type="number"
            value={formData.peopleNeeded}
            onChange={(event) =>
              handleInputChange("peopleNeeded", event.target.value)
            }
            style={styles.formControl}
          />
        )}
        <FormControl style={styles.formControl}>
          <InputLabel>Subcity</InputLabel>
          <Select
            value={formData.subcity}
            onChange={(event) =>
              handleInputChange("subcity", event.target.value)
            }
          >
            {/* Dropdown options */}
            {subcities.map((city) => (
              <MenuItem key={city} value={city.toLowerCase()}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={styles.formControl}>
          <InputLabel>Bathroom</InputLabel>
          <Select
            value={formData.bathroom}
            onChange={(event) =>
              handleInputChange("bathroom", event.target.value)
            }
          >
            {/* Dropdown options */}

            <MenuItem value="shared">Shared</MenuItem>
            <MenuItem value="private">Private</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Rooms"
          type="number"
          value={formData.rooms}
          onChange={(event) => handleInputChange("rooms", event.target.value)}
          style={styles.formControl}
        />
        <TextField
          label="Price"
          type="number"
          value={formData.price}
          onChange={(event) => handleInputChange("price", event.target.value)}
          style={styles.formControl}
        />
        {/* Add ImageInput components for image uploads */}
        <Grid container spacing={2}>
          {[1, 2, 3].map((index) => (
            <Grid item key={index}>
              <InputLabel>Image {index}</InputLabel>
              <Input
                type="file"
                onChange={(event) => handleImageChange(`pic${index}`, event)}
              />
            </Grid>
          ))}
        </Grid>
        <TextField
          label="Detail"
          value={formData.detail}
          onChange={(event) => handleInputChange("detail", event.target.value)}
          style={styles.formControl}
        />
        <TextField
          label="Area"
          value={formData.area}
          onChange={(event) => handleInputChange("area", event.target.value)}
          style={styles.formControl}
        />

        <Button
          variant="contained"
          disabled={isLoading}
          onClick={handleSubmit}
          sx={{ backgroundColor: "#2D6072" }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Submit"
          )}
        </Button>
        <Button variant="outlined" color="primary" onClick={onClose}>
          Close
        </Button>
      </Paper>
    </Modal>
  );
};

export default HouseRegisterModal;
