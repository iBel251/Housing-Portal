import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  PulseLoader,
  HashLoader,
  RingLoader,
  CircleLoader,
} from "react-spinners";
import { UserAuth } from "../context/AuthContext";
import useMainStore from "../components/store/mainStore";

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
    backgroundColor: "rgba(255, 255, 255, 0.8)", // semi-transparent background
  },
  spinnerText: {
    color: "orange",
    paddingLeft: "15px",
    fontSize: "20px",
    fontWeight: "bold",
  },
};

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = UserAuth();
  const [isLoading, setIsLoading] = useState(true);
  const adminEmails = ["admin1@gmail.com", "admin2@gmail.com"];
  const { userStatus } = useMainStore();

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div style={styles.spinnerContainer}>
        <HashLoader color="orange" size={100} />
        <div style={styles.spinnerText}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !adminEmails.includes(user.email)) {
    return <Navigate to="/" />;
  }
  if (userStatus === "full blocked") {
    return <Navigate to="/user_blocked" />;
  }
  return children;
};

export default ProtectedRoute;
