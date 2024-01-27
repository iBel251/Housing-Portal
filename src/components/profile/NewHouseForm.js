// NewHouseForm.js

import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Input,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import "leaflet/dist/leaflet.css";

const styles = {
  modalContainer: {
    display: "flex",
    flexDirection: "column",
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

const NewHouseForm = ({ formData, handleInputChange, handleImageChange }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState("Location not set");

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
  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setOpenDialog(true);
    } else {
      setNotification("Geolocation is not available.");
    }
  };

  const handleDialogClose = (agree) => {
    setOpenDialog(false);
    if (agree) {
      const geoOptions = {
        enableHighAccuracy: true, // High accuracy (can be slower and use more battery)
        timeout: 10000, // Wait 10 seconds before timing out
        maximumAge: 60000, // Accept a cached position within 60 seconds
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          handleInputChange("location", currentLocation);
          setNotification("Location set successfully.");
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setNotification("Location permission denied.");
              break;
            case error.POSITION_UNAVAILABLE:
              setNotification("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setNotification("Location request timed out.");
              break;
            default:
              setNotification("An unknown error occurred.");
              break;
          }
        },
        geoOptions
      );
    } else {
      setNotification("Location setting canceled.");
    }
  };
  useEffect(() => {
    console.log("formData updated:", formData);
  }, [formData]);
  return (
    <>
      <Typography variant="body1" style={{ margin: "10px 0" }}>
        Please ensure you are at the house location before setting the location.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={getCurrentLocation}
        style={{ marginBottom: "3px" }}
      >
        Set House Location
      </Button>
      {notification && (
        <Typography
          variant="body2"
          style={{ marginBottom: "10px", color: "green" }}
        >
          {notification}
        </Typography>
      )}
      <Dialog
        open={openDialog}
        onClose={() => handleDialogClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Location"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you at the house location now?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDialogClose(true)}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
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
      {formData.type === "sale" && (
        <TextField
          label="Area Size"
          type="number"
          value={formData.areaSize}
          onChange={(event) =>
            handleInputChange("areaSize", event.target.value)
          }
          style={styles.formControl}
        />
      )}
      <FormControl style={styles.formControl}>
        <InputLabel>Subcity</InputLabel>
        <Select
          value={formData.subcity}
          onChange={(event) => handleInputChange("subcity", event.target.value)}
        >
          {subcities.map((city) => (
            <MenuItem key={city} value={city.toLowerCase()}>
              {city}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {formData.type !== "sale" && (
        <FormControl style={styles.formControl}>
          <InputLabel>Bathroom</InputLabel>
          <Select
            value={formData.bathroom}
            onChange={(event) =>
              handleInputChange("bathroom", event.target.value)
            }
          >
            <MenuItem value="shared">Shared</MenuItem>
            <MenuItem value="private">Private</MenuItem>
          </Select>
        </FormControl>
      )}
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
    </>
  );
};

export default NewHouseForm;
