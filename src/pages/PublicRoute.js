import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user } = UserAuth();

  if (user) {
    // Redirect logged-in users to a default route, e.g., their dashboard
    return <Navigate to="/houses" />;
  }

  return children; // Render children (Login or Signup components) for non-logged-in users
};

export default PublicRoute;
