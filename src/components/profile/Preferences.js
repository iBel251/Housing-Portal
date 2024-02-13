import React, { useState } from "react";
import PreferencesModal from "../PreferencesModal";
import PreferencesEditModal from "../PreferencesEditModal";
import { Box, Typography, Button, Divider, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { UserAuth } from "../../context/AuthContext";

const styles = {
  container: {
    padding: "2rem",
    backgroundColor: "#f7f7f7",
    borderRadius: "8px",
  },
  header: {
    marginBottom: "1rem",
  },
  preferenceContainer: {
    margin: "1rem 0",
  },
  preferenceHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    color: "primary",
    size: "small",
  },
};

const Preferences = ({ userData }) => {
  const { user, setUserPreferences, editUserPreference, deleteUserPreference } =
    UserAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPreferenceIndex, setEditingPreferenceIndex] = useState(0);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const handleEditModalOpen = (index) => {
    setEditingPreferenceIndex(index);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => setEditModalOpen(false);

  const handleSubmit = async (preferenceData) => {
    try {
      await setUserPreferences(preferenceData);
      window.location.reload();
    } catch (error) {
      console.error("Could not set preferences:", error);
    }
    handleModalClose();
  };
  const handleEditSubmit = async (index, preferenceData) => {
    try {
      await editUserPreference(index, preferenceData);
      // window.location.reload();
    } catch (error) {
      console.error("Could not set preferences:", error);
    }
    handleModalClose();
  };

  const handleDelete = async (index) => {
    try {
      await deleteUserPreference(index);
    } catch (error) {
      console.error(`Failed to delete preference at index ${index}.`, error);
    }
  };

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" gutterBottom sx={styles.header}>
        Preferences
      </Typography>
      <Divider />
      <Box sx={{ marginTop: "1rem" }}>
        {userData &&
        Array.isArray(userData.preferences) &&
        userData.preferences.length > 0 ? (
          userData.preferences.map((preference, index) => (
            <Box key={index} sx={styles.preferenceContainer}>
              <Box sx={styles.preferenceHeader}>
                <Typography variant="h6">Preference {index + 1}</Typography>
                <Box>
                  <IconButton
                    sx={styles.iconButton}
                    onClick={() => handleEditModalOpen(index)}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDelete(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography variant="body1">
                Bathroom: {preference.bathroom}
              </Typography>
              <Typography variant="body1">Price: {preference.price}</Typography>
              <Typography variant="body1">
                Subcity: {preference.subcity}
              </Typography>
              <Typography variant="body1">Rooms: {preference.rooms}</Typography>
            </Box>
          ))
        ) : (
          <Typography variant="subtitle1">No data available.</Typography>
        )}
      </Box>
      <Button
        variant="contained"
        onClick={handleModalOpen}
        style={{ background: "#2D6072" }}
      >
        Add Preferences
      </Button>
      <PreferencesModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
      />
      <PreferencesEditModal
        preference={userData?.preferences?.[editingPreferenceIndex]}
        index={editingPreferenceIndex}
        open={editModalOpen}
        onClose={handleEditModalClose}
        onSubmit={handleEditSubmit}
      />
    </Box>
  );
};

export default Preferences;
