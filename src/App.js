// App.js
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Houses from "./pages/Houses";
import Favorites from "./pages/Favorites";
import Messages from "./pages/Messages";
import Help from "./pages/Help";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Index from "./pages/Index";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Logout from "./pages/Logout";
import Login from "./pages/Login";
import Recommended from "./pages/Recommended";
import Admin from "./pages/admin/Admin";
import MessageDetail from "./pages/MessageDetail";
import { AuthContextProvider } from "./context/AuthContext";
import { HouseContextProvider } from "./context/HouseContext";
import { ChatContextProvider } from "./context/ChatContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import StoreInitializer from "./components/StoreInitializer";
import { useLocation } from "react-router-dom";
import HouseDetails from "./components/HouseDetails";
import EditHouse from "./components/profile/EditHouse";

const tele = window.Telegram.WebApp;
const NavContent = () => {
  const location = useLocation();
  return <>{location.pathname !== "/admin" && <Navbar />}</>;
};
const FooterContent = () => {
  const location = useLocation();
  return <>{location.pathname !== "/admin" && <Footer />}</>;
};
function App() {
  useEffect(() => {
    tele.ready();
  });

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <HouseContextProvider>
          <ChatContextProvider>
            <NavContent />
            <StoreInitializer />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="houses" element={<Houses />} />
              <Route
                path="favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route path="help" element={<Help />} />
              <Route path="signup" element={<Signup />} />
              <Route path="login" element={<Login />} />
              <Route
                path="admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="recommended" element={<Recommended />} />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="logout" element={<Logout />} />

              <Route path="/messages/:messageId" element={<MessageDetail />} />
              <Route path="/houses/:houseId" element={<HouseDetails />} />
              <Route path="/profile/:houseId" element={<EditHouse />} />
            </Routes>
            <FooterContent />
          </ChatContextProvider>
        </HouseContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
