import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { HashLoader } from "react-spinners";

const FieldEditModal = ({
  isOpen,
  onClose,
  fieldName,
  houseData,
  onSave,
  value,
  isLoading,
  setIsLoading,
}) => {
  const [editedValue, setEditedValue] = useState("");

  // Reset the editedValue when fieldName changes
  useEffect(() => {
    setEditedValue(value || "");
  }, [fieldName, houseData]);

  const handleSave = () => {
    setIsLoading(true);
    onSave(fieldName, editedValue);
  };

  const isDropdownField = fieldName === "subcity" || fieldName === "bathroom";
  const isNumberInput = fieldName === "price" || fieldName === "rooms";
  const isMultilineText = fieldName === "area" || fieldName === "detail";

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
  const bathroomOptions = ["private", "shared"];
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          "@media (max-width: 600px)": {
            width: "80%",
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Edit {fieldName}
        </Typography>

        {isDropdownField ? (
          <Select
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            fullWidth
          >
            {fieldName === "subcity"
              ? subcities.map((subcity) => (
                  <MenuItem key={subcity} value={subcity.toLowerCase()}>
                    {subcity}
                  </MenuItem>
                ))
              : bathroomOptions.map((option) => (
                  <MenuItem key={option} value={option.toLowerCase()}>
                    {option}
                  </MenuItem>
                ))}
          </Select>
        ) : isNumberInput ? (
          <TextField
            label={fieldName}
            type="number"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            fullWidth
          />
        ) : isMultilineText ? (
          <TextField
            label={fieldName}
            multiline
            rows={4}
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            fullWidth
          />
        ) : (
          <TextField
            label={fieldName}
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            fullWidth
          />
        )}
        {isLoading ? (
          <Box display="flex" alignItems="center">
            <HashLoader size={20} color="orange" />
            <Typography
              variant="body2"
              style={{ marginLeft: 10, color: "orange" }}
            >
              Updating...
            </Typography>
          </Box>
        ) : (
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ marginTop: 2 }}
          >
            Save
          </Button>
        )}
      </Box>
    </Modal>
  );
};

export default FieldEditModal;
