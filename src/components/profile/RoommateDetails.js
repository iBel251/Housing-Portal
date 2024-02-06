import React, { useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
  IconButton,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { HouseAuth } from "../../context/HouseContext";
import { RoommateAuth } from "../../context/RoommateContext";

const RoommateDetails = ({ houseData }) => {
  // Initial state setup for roommateData
  const [roommateData, setRoommateData] = useState({
    ...houseData.roommateData,
    interestedPeople: houseData.roommateData?.interestedPeople || {},
    registeredPeople: houseData.roommateData?.registeredPeople || {},
  });

  const [expanded, setExpanded] = useState(false);
  // Input states for new entries
  const [inputValue, setInputValue] = useState({
    preferences: "",
    commonRooms: "",
  });
  if (!houseData.roommateData) {
    return;
  }
  const { updateRoommateData } = RoommateAuth();

  // Sample suggestions for autocomplete (you can replace these with your actual data)
  const preferenceSuggestions = ["Quiet", "Clean", "Student", "Professional"];
  const commonRoomSuggestions = [
    "Kitchen",
    "Living Room",
    "Bathroom",
    "Balcony",
  ];

  const handleAdd = (value, itemType) => {
    if (value && !roommateData[itemType].includes(value)) {
      const updatedItems = [...roommateData[itemType], value];
      const updatedRoommateData = { ...roommateData, [itemType]: updatedItems };

      // Update state locally for immediate UI feedback
      setRoommateData(updatedRoommateData);

      // Persist the update to Firestore
      updateRoommateData(houseData.id, updatedRoommateData);
    }
  };

  const handleDelete = (item, itemType) => {
    const updatedItems = roommateData[itemType].filter((i) => i !== item);
    const updatedRoommateData = { ...roommateData, [itemType]: updatedItems };

    // Update state locally for immediate UI feedback
    setRoommateData(updatedRoommateData);

    // Persist the update to Firestore
    updateRoommateData(houseData.id, updatedRoommateData);
  };

  const updateInputValue = (type, newValue) => {
    setInputValue((prevValues) => ({
      ...prevValues,
      [type]: newValue,
    }));
  };

  const AccordionSection = ({ title, itemType, suggestions }) => {
    // Local state to manage the input value for the autocomplete, ensuring responsiveness
    const [localInputValue, setLocalInputValue] = useState("");

    return (
      <Accordion
        expanded={expanded === itemType}
        onChange={() => setExpanded(expanded === itemType ? false : itemType)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Autocomplete
            freeSolo
            options={suggestions}
            inputValue={localInputValue} // Use local state for the input value
            onInputChange={(event, newInputValue) => {
              setLocalInputValue(newInputValue); // Update local state to reflect input changes
            }}
            onChange={(event, newValue) => {
              handleAdd(newValue, itemType);
              setLocalInputValue(""); // Reset local input state after selection
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={`Add ${title}`}
                variant="outlined"
              />
            )}
          />
          <List>
            {roommateData[itemType].map((item, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(item, itemType)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} style={{ padding: "16px", marginBottom: "16px" }}>
          <Typography variant="h6">
            Interested People:{" "}
            {Object.keys(roommateData.interestedPeople).length}
          </Typography>
        </Paper>
        <Paper elevation={3} style={{ padding: "16px" }}>
          <Typography variant="h6">
            Registered People:{" "}
            {Object.keys(roommateData.registeredPeople).length}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <AccordionSection
          title="Preferences"
          itemType="preferences"
          suggestions={preferenceSuggestions}
          expanded={expanded}
          setExpanded={setExpanded}
        />
        <AccordionSection
          title="Common Rooms"
          itemType="commonRooms"
          suggestions={commonRoomSuggestions}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      </Grid>
    </Grid>
  );
};

export default RoommateDetails;
