import React, { useEffect, useState } from "react";
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
  Box,
} from "@mui/material";
import useMainStore from "../store/mainStore";
import { HouseAuth } from "../../context/HouseContext";
import { UserAuth } from "../../context/AuthContext";
import { useFetchAllHouses } from "../functions/houseFunctions";
import NewHouseForm from "./NewHouseForm";

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
const AddHouse = () => {
  const { registerHouse } = HouseAuth();
  const { user } = UserAuth();
  const storedUserData = useMainStore((state) => state.userData);
  const { activeLink, setActiveLink } = useMainStore();
  const [formData, setFormData] = useState({
    type: "",
    peopleNeeded: 0,
    areaSize: 0,
    location: null,
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
  const [unsavedChanges, setUnsavedChanges] = useState(false);

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
    setUnsavedChanges(true);
  };

  const handleImageChange = (field, event) => {
    const selectedImage = event.target.files[0];
    handleInputChange(field, selectedImage);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      // Show an alert or update a state variable to show a message to the user.
      alert("Please fill all the required fields and atleast 1 image.");
      return;
    }
    const fullName = storedUserData.firstName + " " + storedUserData.lastName;
    console.log(formData);
    try {
      const houseId = await registerHouse(user.uid, formData, fullName);
      console.log("House registered with ID:", houseId);
      setUnsavedChanges(false);
      setActiveLink("home");
    } catch (error) {
      console.error("Error registering a house:", error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (unsavedChanges) {
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        event.returnValue = message; // Standard for most browsers
        return message; // For some older browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [unsavedChanges]);

  return (
    <Box style={styles.modalContainer}>
      <Typography variant="h6">Register Your House</Typography>
      <Typography>
        Fill in the details to register your house for listing.
      </Typography>
      <NewHouseForm
        formData={formData}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
      />
      <Button
        variant="contained"
        disabled={isLoading}
        onClick={handleSubmit}
        sx={{ backgroundColor: "#2D6072" }}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
      </Button>
    </Box>
  );
};

export default AddHouse;
