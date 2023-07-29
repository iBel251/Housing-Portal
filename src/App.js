// App.js
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Houses from "./pages/Houses";
import Requests from "./pages/Requests";
import Messages from "./pages/Messages";
import Help from "./pages/Help";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Index from "./pages/Index";
import Navbar from "./components/Navbar";
import Logout from "./pages/Logout";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="houses" element={<Houses />} />
        <Route path="requests" element={<Requests />} />
        <Route path="messages" element={<Messages />} />
        <Route path="help" element={<Help />} />
        <Route path="signup" element={<Signup />} />
        <Route path="profile" element={<Profile />} />
        <Route path="logout" element={<Logout />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
