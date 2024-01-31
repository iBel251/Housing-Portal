import React, { useState, useContext } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { UserAuth } from "../../context/AuthContext";

const modalStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outline: "none",
};

const PasswordChangeModal = ({ isOpen, onClose, userId }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { changePassword } = UserAuth();

  const validatePasswords = () => {
    if (newPassword.length < 6) {
      setErrorMessage("Passwords must be at least 6 characters long.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return false;
    }
    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePasswords()) return;
    try {
      await changePassword(oldPassword, newPassword);
      onClose(); // Close the modal after successfully changing the password
    } catch (error) {
      console.error("Password change failed:", error);
      /// Set the error message based on the error
      if (error.code === "auth/wrong-password") {
        setErrorMessage("The old password is incorrect.");
      } else {
        setErrorMessage("Failed to change password. Please try again.");
      }
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={modalStyles}>
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>
        <TextField
          label="Old Password"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        {errorMessage && (
          <Typography color="error" gutterBottom>
            {errorMessage}
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={handleChangePassword}
          sx={{ mt: 2 }}
        >
          Update Password
        </Button>
      </Box>
    </Modal>
  );
};

export default PasswordChangeModal;
