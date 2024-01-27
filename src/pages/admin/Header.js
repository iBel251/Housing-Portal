import { Button } from "@mui/material";
import React from "react";
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsSearch,
  BsJustify,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";

function Header({ OpenSidebar }) {
  const navigate = useNavigate();
  const { logout } = UserAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      console.log("you are logged out");
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-right">
        <BsFillBellFill className="icon" />
        <BsFillEnvelopeFill className="icon" />
        <BsPersonCircle className="icon" />
      </div>
      <Button sx={{ color: "white", background: "red" }} onClick={handleLogout}>
        Logout
      </Button>
    </header>
  );
}

export default Header;
