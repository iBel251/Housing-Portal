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

const HouseEditModal = ({ open, onClose, houseData, onEditSubmit }) => {
  const [editedHouseData, setEditedHouseData] = useState({ ...houseData });
  const [oldImageIdsToDelete, setOldImageIdsToDelete] = useState([]);
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
    "Lemi Kura",
  ];

  const handleFieldChange = (fieldName, value) => {
    setEditedHouseData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleImageChange = (field, event) => {
    const selectedImage = event.target.files[0];
    // If an old image existed for the field and it's not changed, add its ID to the deletion array
    if (editedHouseData[field] && editedHouseData[field] === houseData[field]) {
      setOldImageIdsToDelete((prevIds) => [...prevIds, editedHouseData[field]]);
    }

    handleFieldChange(field, selectedImage);
  };

  const handleEditSubmit = () => {
    // Pass the edited house data and old image IDs to the parent component for submission
    onEditSubmit(editedHouseData, oldImageIdsToDelete);
    console.log(editedHouseData);
    console.log(oldImageIdsToDelete);
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
          <Typography variant="h6">
            Edit the details of your registered house.
          </Typography>
        </Box>

        {/* Form fields for editing */}
        <FormControl style={styles.formField}>
          <InputLabel>Subcity</InputLabel>
          <Select
            value={editedHouseData.subcity}
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
          value={editedHouseData.rooms}
          onChange={(e) => handleFieldChange("rooms", e.target.value)}
        />
        <FormControl style={styles.formField}>
          <InputLabel>Bathroom</InputLabel>
          <Select
            value={editedHouseData.bathroom}
            fullWidth
            onChange={(event) =>
              handleFieldChange("bathroom", event.target.value)
            }
          >
            {/* Dropdown options */}

            <MenuItem value="private">Private</MenuItem>
            <MenuItem value="shared">Shared</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Price"
          variant="outlined"
          type="number"
          fullWidth
          style={styles.formField}
          value={editedHouseData.price}
          onChange={(e) => handleFieldChange("price", e.target.value)}
        />
        <TextField
          label="Area"
          value={editedHouseData.area}
          onChange={(event) => handleFieldChange("area", event.target.value)}
          style={styles.formField}
        />
        <TextField
          label="Detail"
          variant="outlined"
          multiline
          fullWidth
          rows={4}
          style={styles.formField}
          value={editedHouseData.detail}
          onChange={(e) => handleFieldChange("detail", e.target.value)}
        />
        {/* Add image upload inputs */}
        {/* <input type="file" accept="image/*" onChange={handleImageChange} /> */}
        {/* Repeat the above for each image */}

        {/* Form fields and image upload inputs */}
        <Grid container spacing={2}>
          {[1, 2, 3].map((index) => (
            <Grid item key={index}>
              <InputLabel>Image {index}</InputLabel>
              <Input
                type="file"
                onChange={(event) => handleImageChange(`pic${index}`, event)}
              />
              {editedHouseData[`pic${index}`] && (
                <img
                  src={editedHouseData[`pic${index}`]}
                  alt={`House ${index}`}
                  style={styles.imagePreview}
                />
              )}
            </Grid>
          ))}
        </Grid>

        <Button variant="outlined" color="primary" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="contained"
          onClick={handleEditSubmit}
          sx={{ background: "#2D6072", color: "orange" }}
        >
          Save Changes
        </Button>
      </Paper>
    </Modal>
  );
};

export default HouseEditModal;
