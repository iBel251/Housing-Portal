import React, { useState } from "react";
import {
  Avatar,
  Typography,
  Paper,
  Grid,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { UserAuth } from "../../context/AuthContext";
import PasswordChangeModal from "./PasswordChangeModal";

// Define the styles
const styles = {
  root: {
    padding: 3,
    margin: "auto",
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 2,
  },
  info: {
    display: "flex",
    alignItems: "center",
    marginBottom: 1,
  },
  label: {
    fontWeight: "bold",
    marginRight: 1,
    width: "fit-content",
  },
  text: {},
  btn: {
    width: "fit-content",
    marginLeft: "15px",
  },
};

const UserProfile = ({ userData }) => {
  const [editField, setEditField] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editValues, setEditValues] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
  });
  const houseCount = userData.houseId ? userData.houseId.length : 0;
  const { editUserData, user, sendVerificationEmail } = UserAuth();

  const togglePasswordModal = () => {
    setIsPasswordModalOpen(!isPasswordModalOpen);
  };

  const handleEdit = (field) => {
    setEditField(field);
  };

  const handleChange = (e, field) => {
    setEditValues({ ...editValues, [field]: e.target.value });
  };

  const handleRequestVerificationEmail = async () => {
    try {
      await sendVerificationEmail();
      alert(
        "Verification email sent to " +
          userData.email +
          ". Please check your inbox."
      );
    } catch (error) {
      console.error("Error sending verification email:", error);
      // Handle error (e.g., show a notification)
    }
  };

  const handleSave = async (field) => {
    try {
      await editUserData(field, editValues[field], userData.id);
      console.log(`Saved ${field}:`, editValues[field]);
      setEditField(null);
      // Optionally, update local userData state or trigger a re-fetch of user data
    } catch (error) {
      console.error(`Error saving ${field}:`, error);
      // Handle errors, e.g., show a notification
    }
  };

  const renderEditableField = (field, label, variant = "h6") => {
    return editField === field ? (
      <TextField
        size="small"
        value={editValues[field]}
        onChange={(e) => handleChange(e, field)}
        onBlur={() => handleSave(field)}
      />
    ) : (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography variant={variant} sx={styles.text}>
          {editValues[field]}
        </Typography>
        <IconButton size="small" onClick={() => handleEdit(field)}>
          <EditIcon />
        </IconButton>
      </div>
    );
  };

  return (
    <Paper sx={styles.root}>
      <Grid container direction="column" alignItems="left" spacing={2}>
        <Grid item>
          <Avatar alt="User" src={userData.pictureUrl} sx={styles.avatar} />
        </Grid>
        <Grid item sx={styles.info}>
          <Typography variant="h6" sx={styles.label}>
            First Name:
          </Typography>
          {renderEditableField("firstName", "First Name")}
        </Grid>
        <Grid item sx={styles.info}>
          <Typography variant="h6" sx={styles.label}>
            Last Name:
          </Typography>
          {renderEditableField("lastName", "Last Name")}
        </Grid>
        <Grid item sx={styles.info}>
          <Typography variant="body1" sx={styles.label}>
            Email:
          </Typography>
          {userData.email}
          {!user.emailVerified && (
            <Button
              sx={styles.btn}
              variant="outlined"
              onClick={handleRequestVerificationEmail}
            >
              Verify Email
            </Button>
          )}
        </Grid>
        <Grid item sx={styles.info}>
          <Typography variant="body1" sx={styles.label}>
            You have {houseCount} Registered houses
          </Typography>
        </Grid>
        <Button
          sx={styles.btn}
          variant="outlined"
          onClick={togglePasswordModal}
        >
          Change Password
        </Button>

        {/* Include the password change modal here and pass necessary props */}
        {isPasswordModalOpen && (
          <PasswordChangeModal
            isOpen={isPasswordModalOpen}
            onClose={togglePasswordModal}
            userId={userData.id} // or whatever identifies the user
          />
        )}
      </Grid>
    </Paper>
  );
};

export default UserProfile;
