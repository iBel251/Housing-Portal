import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Avatar, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import HouseIcon from "@mui/icons-material/House";
import BlockIcon from "@mui/icons-material/Block";
import { UserAuth } from "../../context/AuthContext";

const styles = {
  paper: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  header: {
    marginBottom: "8px",
  },
  buttons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  avatar: {
    width: "100px",
    height: "100px",
  },
};

const UserDetail = ({ user }) => {
  const { addRestriction } = UserAuth();
  const [restrictionText, setRestrictionText] = useState("");

  useEffect(() => {
    // Update the restriction text when user data changes
    setRestrictionText(getRestrictionText());
  }, [user.restriction]);

  if (!user) return <Box>No user selected</Box>;
  const handleMailClick = () => {
    // Compose a new email to the user's email address
    window.location.href = `mailto:${user.email}`;
  };

  const handleSuspendChatClick = async () => {
    try {
      await addRestriction(user.id, "chat");
      console.log("User suspended from chat");
    } catch (error) {
      console.error("Error suspending user from chat:", error);
    }
  };

  const handleBlockUserClick = async () => {
    try {
      await addRestriction(user.id, "full");
      console.log("User blocked");
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleRemoveAllRestrictionsClick = async () => {
    try {
      await addRestriction(user.id, "none");
      console.log("All restrictions removed");
      setRestrictionText(getRestrictionText()); // Update restriction text
    } catch (error) {
      console.error("Error removing restrictions:", error);
    }
  };

  const getRestrictionText = () => {
    if (!user.restriction || user.restriction === "none") {
      return "None";
    } else if (user.restriction === "chat") {
      return "Restricted from chat";
    } else if (user.restriction === "full") {
      return "Blocked";
    } else {
      // Add more conditions as needed
      return "Unknown Restriction";
    }
  };

  return (
    <Paper elevation={3} sx={styles.paper}>
      <Typography variant="h4" sx={styles.header}>
        User Details:
      </Typography>
      <Typography variant="body1">ID: {user.id}</Typography>
      <Typography variant="body1">First Name: {user.firstName}</Typography>
      <Typography variant="body1">Last Name: {user.lastName}</Typography>
      <Typography variant="body1">Email: {user.email}</Typography>
      <Typography variant="body1">House ID: {user.houseId}</Typography>
      <Typography variant="body1">Restrictions: {restrictionText}</Typography>

      <Avatar
        src={user.picUrl}
        alt={`${user.firstName} ${user.lastName}`}
        sx={styles.avatar}
      />
      <Box sx={styles.buttons}>
        <Button
          startIcon={<ContactMailIcon />}
          variant="contained"
          color="primary"
          onClick={handleMailClick}
        >
          Mail
        </Button>
        <Button
          startIcon={<BlockIcon />}
          variant="contained"
          color="warning"
          onClick={handleSuspendChatClick}
        >
          Suspend from Chat
        </Button>
        <Button
          startIcon={<DeleteIcon />}
          variant="contained"
          color="error"
          onClick={handleBlockUserClick}
        >
          Block User
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={handleRemoveAllRestrictionsClick}
        >
          Remove All Restrictions
        </Button>
        <Button startIcon={<EditIcon />} variant="contained" color="primary">
          Edit
        </Button>
      </Box>
    </Paper>
  );
};

export default UserDetail;
