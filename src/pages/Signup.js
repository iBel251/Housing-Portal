import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { HashLoader } from "react-spinners";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createUser } = UserAuth();
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    const picid = "https://picsum.photos/200";
    event.preventDefault();
    setError("");
    setIsLoading(true);
    // Check for password mismatch
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await createUser(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        picid
      );
      navigate("/houses");
    } catch (error) {
      // Firebase specific error codes
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("Email already in use");
          break;
        case "auth/invalid-email":
          setError("Invalid email format");
          break;
        case "auth/weak-password":
          setError("Weak password, should be atleast 6 characters.");
          break;
        case "auth/network-request-failed":
          setError("Network error/ Please turn any running VPNs");
          break;
        default:
          setError(error.message);
          break;
      }
      setIsLoading(false);
      console.log(error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ my: "50px" }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">Sign Up</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
              type="email"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          {error && (
            <Typography
              variant="body2"
              color="error"
              sx={{ textAlign: "center", width: "100%" }}
            >
              {error}
            </Typography>
          )}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner-container">
                  <HashLoader color="orange" size={100} />
                  <div className="spinner-text">Loading...</div>
                </div>
              ) : (
                "Signup"
              )}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" align="center">
              Already have an account?{" "}
              <Button onClick={() => navigate("/login")}>Login</Button>
            </Typography>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Signup;
