import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PasswordResetPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const query = useQuery();
  const oobCode = query.get("oobCode");

  useEffect(() => {
    const auth = getAuth();
    verifyPasswordResetCode(auth, oobCode).catch((error) => {
      console.error("Error verifying code:", error);
      setMessage(
        "Invalid or expired code. Please request a new password reset."
      );
      setTimeout(() => navigate("/login"), 3000);
    });
  }, [oobCode, navigate]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const auth = getAuth();
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage(
        "Your password has been reset successfully. You can now login with your new password."
      );
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMessage("Failed to reset password. Please try again.");
      console.error(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Box component="form" onSubmit={handlePasswordReset} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="New Password"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          {message && (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {message}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Reset Password
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PasswordResetPage;
