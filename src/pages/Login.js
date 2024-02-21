import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  Checkbox,
  Box,
} from "@mui/material";
import { HashLoader } from "react-spinners";
import CircularProgress from "@mui/material/CircularProgress";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useMainStore from "../components/store/mainStore";

function Login() {
  const setActivePage = useMainStore((state) => state.setActivePage);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { signIn, sendResetEmail } = UserAuth();

  useEffect(() => {
    setActivePage("login");
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleForgotPassword = async () => {
    const email = prompt("Please enter your email address:");
    if (email) {
      try {
        await sendResetEmail(email);
        alert(
          "A password reset link is sent to " +
            email +
            ". Please make sure this the the correct email."
        );
      } catch (error) {
        console.error("Failed to send password reset email:", error);
        alert("An error occurred. Please try again later.");
      }
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await signIn(formData.email, formData.password);
      navigate("/houses");
    } catch (error) {
      console.log(error.message);
      // Check the type of error
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setError("Invalid email or password");
      } else {
        setError(error.message);
      }
      setIsLoading(false);
    }
  };

  const styles = {
    spinnerContainer: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255,0.8)", // semi-transparent background
      zIndex: 150,
    },
    spinnerText: {
      color: "orange",
      paddingLeft: "15px",
      fontSize: "20px",
      fontWeight: "bold",
    },
  };

  return (
    <Container maxWidth="sm" sx={{ my: "50px" }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">Login</Typography>
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Checkbox
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleCheckboxChange}
              />
              <Typography variant="body2">Remember Me</Typography>
            </Box>
          </Grid>
          {/* Show error message */}
          {error && (
            <Grid item xs={12}>
              <Typography
                variant="body2"
                color="error"
                sx={{ textAlign: "center" }}
              >
                {error}
              </Typography>
            </Grid>
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
                "Login"
              )}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button color="primary" onClick={handleForgotPassword}>
              Forgot Password?
            </Button>
            <Typography variant="body2" align="center">
              Don't have an account?{" "}
              <Button onClick={() => navigate("/signup")}>Register</Button>
            </Typography>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Login;
