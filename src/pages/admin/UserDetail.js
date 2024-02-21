import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import HouseIcon from "@mui/icons-material/House";
import BlockIcon from "@mui/icons-material/Block";
import { UserAuth } from "../../context/AuthContext";
import { AdminAuth } from "../../context/AdminContext";
import useMainStore from "../../components/store/mainStore";
import { HashLoader } from "react-spinners";
import UserProfile from "../../components/profile/UserProfile";

const styles = {
  paper: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
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

const UserDetail = ({ userId }) => {
  const { setStatus } = AdminAuth();
  const [selectedRestriction, setSelectedRestriction] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const updateUserStatus = useMainStore((state) => state.updateUserStatus);
  const { allUsers } = useMainStore();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    const user = allUsers.find((u) => u.id === userId);
    setUser(user);
    // Set the initial selected restriction based on the user's current status
    // or fall back to "active" if the user is not found or has no status set
    setSelectedRestriction(user?.status || "active");
  }, [userId, allUsers]);

  const handleRestrictionChange = (event) => {
    const restrictionType = event.target.value;
    setSelectedRestriction(restrictionType);
  };

  const applyRestriction = async () => {
    if (!selectedRestriction || !user) {
      console.error("No restriction type selected.");
      return;
    }
    try {
      setLoading(true);
      await setStatus("user", user.id, selectedRestriction); // Assuming 'user' is the type and user.id is the ID of the user
      updateUserStatus(user.id, selectedRestriction);
    } catch (error) {
      console.error(
        `Error applying restriction: ${selectedRestriction}`,
        error
      );
    }
    setLoading(false);
  };

  // Effect to reset restriction dropdown when user changes
  useEffect(() => {
    if (user?.status) {
      setSelectedRestriction(user.status);
    } else {
      setSelectedRestriction("active");
    }
  }, [user]);
  if (!user) return <Box>No user selected</Box>;

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleClose = () => {
    setEditDialogOpen(false);
  };

  const handleMailClick = () => {
    // Compose a new email to the user's email address
    window.location.href = `mailto:${user.email}`;
  };

  return (
    <Paper elevation={3} sx={styles.paper}>
      <Typography variant="h4" sx={styles.header}>
        User Details:
      </Typography>

      <Avatar
        src={user.picUrl}
        alt={`${user.firstName} ${user.lastName}`}
        sx={styles.avatar}
      />
      <Typography variant="body1">
        <span>ID: </span>
        {user.id}
      </Typography>
      <Typography variant="body1">
        <span>First Name: </span>
        {user.firstName}
      </Typography>
      <Typography variant="body1">
        <span>Last Name: </span>
        {user.lastName}
      </Typography>
      <Typography variant="body1">
        <span>Email: </span>
        {user.email}
      </Typography>
      <Typography variant="body1">
        <span>House ID: </span>
        {user.houseId}
      </Typography>
      <Typography variant="body1">
        <span>Restrictions: </span>
        {user.status || "Active"}
      </Typography>
      <Box sx={styles.buttons}>
        <Button
          startIcon={<ContactMailIcon sx={{ color: "white" }} />}
          variant="contained"
          sx={{ background: "#2D6072" }}
          onClick={handleMailClick}
        >
          Mail
        </Button>
        <Button
          startIcon={<EditIcon sx={{ color: "white" }} />}
          variant="contained"
          sx={{ background: "#2D6072" }}
          onClick={handleEditClick}
        >
          Edit
        </Button>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <FormControl sx={styles.formControl}>
            <InputLabel id="restriction-select-label">Restriction</InputLabel>
            <Select
              labelId="restriction-select-label"
              id="restriction-select"
              value={selectedRestriction}
              label="Restriction"
              onChange={handleRestrictionChange}
              sx={{ minWidth: "200px" }}
            >
              <MenuItem value={"active"}>None</MenuItem>
              <MenuItem value={"chat blocked"}>Suspend from Chat</MenuItem>
              <MenuItem value={"full blocked"}>Block User</MenuItem>
              <MenuItem value={"post blocked"}>Post Ban</MenuItem>
              {/* Add more restriction types as needed */}
            </Select>
          </FormControl>
          <Button
            disabled={loading}
            variant="contained"
            onClick={applyRestriction}
            sx={{ height: "40px", width: "200px", background: "#2D6072" }}
          >
            {loading ? (
              <HashLoader size={20} color="orange" />
            ) : (
              "Apply Restriction"
            )}
          </Button>
        </Box>
      </Box>
      <Dialog open={editDialogOpen} onClose={handleClose}>
        <DialogTitle>User Details Editor</DialogTitle>
        <DialogContent>
          <UserProfile userData={user} />
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default UserDetail;
