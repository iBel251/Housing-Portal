import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import HouseIcon from "@mui/icons-material/House";
import PersonIcon from "@mui/icons-material/Person";
import Badge from "@mui/material/Badge";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

import "../styles/customstyles.css";
import { useEffect } from "react";
import useMainStore from "./store/mainStore";

let pages = [];
const settings = ["Profile", "Logout"];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const { user, logout } = UserAuth();
  const unreadMessageCount = useMainStore((state) => state.unreadMessageCount);

  const location = useLocation(); //Get the current route location
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      if (user) {
        setIsLoggedIn(true);
        pages = [
          "Houses",
          "Favorites",
          "Recommended",
          "Messages",
          "Profile",
          "Help",
        ];
      } else {
        setIsLoggedIn(false);
        pages = ["Houses", "Help"];
      }
    };
    checkLoginStatus();
  }, [user]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      console.log("you are logged out");
    } catch (e) {
      console.log(e.message);
    }
  };

  const styles = {
    nonActiveStyles: {
      textDecoration: "none",
      color: "inherit",
      backgroundColor: "inherit",
    },
    activeStyles: {
      textDecoration: "none",
      position: "relative",
      color: "Black",
    },
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl" sx={{ backgroundColor: "#2D6072" }}>
        <Toolbar disableGutters>
          <HouseIcon
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1,
              color: "orange",
              fontSize: "50px",
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "orange",
              textDecoration: "none",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "50px",
                fontWeight: "bold",
              }}
            >
              የኛ
            </span>
            <span style={{ textDecoration: "underline" }}>HOUSING</span>
          </Typography>

          {/* For mobile devices */}

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Link
                    to={`/${page.toLowerCase()}`}
                    className={`menu-link ${
                      location.pathname === `/${page.toLowerCase()}`
                        ? "active"
                        : ""
                    }`}
                    style={{
                      ...styles[
                        location.pathname === `/${page.toLowerCase()}`
                          ? "activeStyles"
                          : "nonActiveStyles"
                      ],
                    }}
                  >
                    <Typography textAlign="center">
                      {page === "Messages" && unreadMessageCount > 0 ? (
                        <Badge badgeContent={unreadMessageCount} color="error">
                          {page}
                        </Badge>
                      ) : (
                        page
                      )}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}
              {!isLoggedIn && (
                <MenuItem onClick={handleCloseUserMenu}>
                  <Link
                    to="/signup"
                    className={`menu-link ${
                      location.pathname === "/signup" ? "active" : ""
                    }`}
                    style={{
                      ...styles[
                        location.pathname === "/signup"
                          ? "activeStyles"
                          : "nonActiveStyles"
                      ],
                    }}
                  >
                    <Typography textAlign="center">Signup</Typography>
                  </Link>
                </MenuItem>
              )}
            </Menu>
          </Box>
          <HouseIcon
            sx={{
              display: { xs: "flex", md: "none" },
              color: "orange",
              fontSize: "40px",
            }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "orange",
              textDecoration: "none",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "30px",
                fontWeight: "bold",
              }}
            >
              የኛ
            </span>
            HOUSING
          </Typography>

          {/* Desktop version  */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <MenuItem key={page} onClick={handleCloseNavMenu}>
                <Link
                  to={`/${page.toLowerCase()}`}
                  className={`menu-link ${
                    location.pathname === `/${page.toLowerCase()}`
                      ? "active"
                      : ""
                  }`}
                  style={{
                    ...styles[
                      location.pathname === `/${page.toLowerCase()}`
                        ? "activeStyles"
                        : "nonActiveStyles"
                    ],
                  }}
                >
                  <Typography textAlign="center">
                    {page === "Messages" && unreadMessageCount > 0 ? (
                      <Badge badgeContent={unreadMessageCount} color="error">
                        {page}
                      </Badge>
                    ) : (
                      page
                    )}
                  </Typography>
                </Link>
              </MenuItem>
            ))}

            {!isLoggedIn && (
              <MenuItem onClick={handleCloseUserMenu}>
                <Link
                  to="/login"
                  className={`menu-link ${
                    location.pathname === "/login" ||
                    location.pathname === "/signup"
                      ? "active"
                      : ""
                  }`}
                  style={{
                    ...styles[
                      location.pathname === "/login" ||
                      location.pathname === "/signup"
                        ? "activeStyles"
                        : "nonActiveStyles"
                    ],
                  }}
                >
                  <Typography textAlign="center">Login/Signup</Typography>
                </Link>
              </MenuItem>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User">
                  <PersonIcon sx={{ fontSize: "45px" }} />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {isLoggedIn ? ( // Check if the user is logged in
                [
                  <MenuItem key="profile" onClick={handleCloseUserMenu}>
                    <Link to="/profile" className="menu-link">
                      <Typography textAlign="center">Profile</Typography>
                    </Link>
                  </MenuItem>,
                  <MenuItem key="logout" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center" onClick={handleLogout}>
                      Logout
                    </Typography>
                  </MenuItem>,
                ]
              ) : (
                <MenuItem key="signup" onClick={handleCloseUserMenu}>
                  <Link to="/signup" className="menu-link">
                    <Typography textAlign="center">Signup</Typography>
                  </Link>
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
