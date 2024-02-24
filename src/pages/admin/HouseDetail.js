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
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import HouseOwnerIcon from "@mui/icons-material/Person"; // I added this as an example icon for owner
import MoneyIcon from "@mui/icons-material/MonetizationOn"; // I added this as an example icon for price
import useMainStore from "../../components/store/mainStore";
import { AdminAuth } from "../../context/AdminContext";
import { HashLoader } from "react-spinners";
import EditHouse from "./EditHouse";
import UserDetail from "./UserDetail";

const styles = {
  paper: {
    margin: "16px",
    padding: "16px",
  },
  avatar: {
    width: "100px",
    height: "100px",
    marginRight: "16px",
  },
  detailText: {
    marginBottom: "8px",
  },
  button: {
    margin: "8px",
    alignItems: "center",
  },
  formControl: {
    margin: "8px",
    minWidth: "200px",
  },
  avatarsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
  },
};

const HouseDetail = ({ houseId }) => {
  const { setStatus } = AdminAuth();
  const { allHouses, updateHouseStatus } = useMainStore();
  const [loading, setLoading] = useState(false);
  const [selectedRestriction, setSelectedRestriction] = useState("");
  const [house, setHouse] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [openUserDetailDialoge, setOpenUserDetailDialoge] = useState(false);

  useEffect(() => {
    const house = allHouses.find((h) => h.id === houseId);
    setHouse(house);
    // Set the initial selected restriction based on the user's current status
    // or fall back to "active" if the user is not found or has no status set
    setSelectedRestriction(house?.status || "active");
  }, [houseId, allHouses]);

  const applyRestriction = async () => {
    if (!selectedRestriction || !house) {
      console.error("No restriction type selected.");
      return;
    }
    try {
      setLoading(true);
      await setStatus("house", houseId, selectedRestriction);
      updateHouseStatus(houseId, selectedRestriction);
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
    if (house?.status) {
      setSelectedRestriction(house.status);
    } else {
      setSelectedRestriction("active");
    }
  }, [house]);
  if (!house) return <Box>No house selected</Box>;

  const handleRestrictionChange = (event) => {
    const restrictionType = event.target.value;
    setSelectedRestriction(restrictionType);
  };
  if (!house) return <Box>No house selected</Box>;
  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "";

    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString(); // you can format it however you like
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleClose = () => {
    setEditDialogOpen(false);
  };

  return (
    <Paper elevation={3} sx={styles.paper}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography variant="h4" sx={{ marginBottom: "16px" }}>
            House Details
          </Typography>
          <Avatar src={house.pic1} alt="House Picture 1" sx={styles.avatar} />
          <Box sx={styles.avatarsContainer}>
            <Avatar src={house.pic2} alt="House Picture 2" sx={styles.avatar} />
            <Avatar src={house.pic3} alt="House Picture 3" sx={styles.avatar} />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography sx={styles.detailText}>
            <span>Area: </span>
            {house.area}
          </Typography>
          <Typography sx={styles.detailText}>
            <span>Bathroom: </span>
            {house.bathroom}
          </Typography>
          <Typography sx={styles.detailText}>
            <span>Detail: </span>
            {house.detail}
          </Typography>
          <Typography sx={styles.detailText}>
            <span>Owner: </span>
            {house.owner}
          </Typography>
          <Typography sx={styles.detailText}>
            <span>Price: </span>
            {house.price}
          </Typography>
          <Typography sx={styles.detailText}>
            <span>Rooms: </span>
            {house.rooms}
          </Typography>
          <Typography sx={styles.detailText}>
            <span>Subcity: </span>
            {house.subcity}
          </Typography>
          <Typography sx={styles.detailText}>
            <span>Date: </span>
            {formatTimestamp(house.timestamp)}
          </Typography>
          <Typography sx={styles.detailText}>
            <span>User ID: </span>
            {house.userId}
          </Typography>
          <Typography sx={styles.detailText}>
            <span>Restrictions: </span>
            {house.status || "Active"}
          </Typography>

          <Button
            startIcon={<EditIcon sx={{ color: "white" }} />}
            variant="contained"
            color="primary"
            sx={styles.button}
            onClick={handleEditClick}
          >
            Edit
          </Button>
          <Button
            startIcon={<HouseOwnerIcon sx={{ color: "white" }} />}
            variant="contained"
            sx={styles.button}
            onClick={() => setOpenUserDetailDialoge(true)}
          >
            Owner Detail
          </Button>
          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
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
                <MenuItem value={"unlisted"}>Unlist</MenuItem>
                <MenuItem value={"blocked"}>Block</MenuItem>
                {/* Add more restriction types as needed */}
              </Select>
            </FormControl>
            <Button
              disabled={loading}
              variant="contained"
              onClick={applyRestriction}
              sx={{
                height: "40px",
                width: "200px",
                background: "#2D6072",
                margin: "8px",
              }}
            >
              {loading ? (
                <HashLoader size={20} color="orange" />
              ) : (
                "Apply Restriction"
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>
      <EditHouse
        open={editDialogOpen}
        onClose={handleClose}
        houseId={houseId}
      />
      <Dialog
        open={openUserDetailDialoge}
        onClose={() => setOpenUserDetailDialoge(false)}
      >
        <DialogTitle>Owner</DialogTitle>
        <DialogContent>
          <UserDetail userId={house.userId} />
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default HouseDetail;
