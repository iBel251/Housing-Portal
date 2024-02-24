import React from "react";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
} from "react-icons/bs";
import { GrUserAdmin } from "react-icons/gr";
import useMainStore from "../../components/store/mainStore";

function Sidebar({ openSidebarToggle, OpenSidebar, changeActiveComponent }) {
  const { activeLink } = useMainStore();
  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <GrUserAdmin className="icon_header" /> Admin
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <li
          className={`sidebar-list-item ${
            activeLink === "Dashboard" ? "active" : ""
          }`}
          onClick={() => {
            changeActiveComponent("Dashboard");
          }}
        >
          <a>
            <BsGrid1X2Fill className="icon" /> Dashboard
          </a>
        </li>
        <li
          className={`sidebar-list-item ${
            activeLink === "Users" ? "active" : ""
          }`}
          onClick={() => {
            changeActiveComponent("Users");
          }}
        >
          <a>
            <BsPeopleFill className="icon" /> Customers
          </a>
        </li>
        <li
          className={`sidebar-list-item ${
            activeLink === "Houses" ? "active" : ""
          }`}
          onClick={() => {
            changeActiveComponent("Houses");
          }}
        >
          <a>
            <BsFillArchiveFill className="icon" /> Houses
          </a>
        </li>
        {/* <li
          className={`sidebar-list-item ${
            activeLink === "Chats" ? "active" : ""
          }`}
          onClick={() => {
            changeActiveComponent("Chats");
          }}
        >
          <a>
            <BsListCheck className="icon" /> Chat Room
          </a>
        </li> */}
        <li
          className={`sidebar-list-item ${
            activeLink === "Reports" ? "active" : ""
          }`}
          onClick={() => {
            changeActiveComponent("Reports");
          }}
        >
          <a>
            <BsMenuButtonWideFill className="icon" /> Reports
          </a>
        </li>
        <li
          className={`sidebar-list-item ${
            activeLink === "Settings" ? "active" : ""
          }`}
          onClick={() => {
            changeActiveComponent("Settings");
          }}
        >
          <a>
            <BsFillGearFill className="icon" /> Setting
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
