import React from "react";
import "./admin.css";
import Header from "./Header";
import Footer from "./Footer";
import Houses from "./Houses";
import Chats from "./Chats";
import Users from "./Users";
import Reports from "./Reports";
import Dashboard from "./Dashboard";
import Sidebar from "./Sidebar";
import { useState } from "react";

const Admin = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [activeComponent, setActiveComponent] = useState("Dashboard");

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const styles = {
    hidden: {
      display: "none",
    },
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
        gh
        changeActiveComponent={setActiveComponent}
      />
      <div style={activeComponent === "Dashboard" ? {} : styles.hidden}>
        <Dashboard />
      </div>
      <div style={activeComponent === "Houses" ? {} : styles.hidden}>
        <Houses />
      </div>
      <div style={activeComponent === "Users" ? {} : styles.hidden}>
        <Users />
      </div>
      <div style={activeComponent === "Chats" ? {} : styles.hidden}>
        <Chats />
      </div>
      <div style={activeComponent === "Reports" ? {} : styles.hidden}>
        <Reports />
      </div>
    </div>
  );
};

export default Admin;
