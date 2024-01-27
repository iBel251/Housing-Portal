import React from "react";
import { Box, Typography, Button, Avatar, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import HouseOwnerIcon from "@mui/icons-material/Person"; // I added this as an example icon for owner
import MoneyIcon from "@mui/icons-material/MonetizationOn"; // I added this as an example icon for price

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

const HouseDetail = ({ house }) => {
  if (!house) return <Box>No house selected</Box>;
  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "";

    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString(); // you can format it however you like
  };
  return (
    <Paper elevation={3} sx={styles.paper}>
      <Typography variant="h4" sx={styles.header}>
        House Details:
      </Typography>
      <Typography variant="body1">Area: {house.area}</Typography>
      <Typography variant="body1">Bathroom: {house.bathroom}</Typography>
      <Typography variant="body1">Detail: {house.detail}</Typography>
      <Typography variant="body1">Owner: {house.owner}</Typography>
      <Typography variant="body1">Price: {house.price}</Typography>
      <Typography variant="body1">Rooms: {house.rooms}</Typography>
      <Typography variant="body1">Subcity: {house.subcity}</Typography>
      <Typography variant="body1">
        Date: {formatTimestamp(house.timestamp)}
      </Typography>
      <Typography variant="body1">User ID: {house.userId}</Typography>

      <Avatar src={house.pic1} alt="House Picture 1" sx={styles.avatar} />
      <Avatar src={house.pic2} alt="House Picture 2" sx={styles.avatar} />
      <Avatar src={house.pic3} alt="House Picture 3" sx={styles.avatar} />

      <Box sx={styles.buttons}>
        <Button
          startIcon={<ContactMailIcon />}
          variant="contained"
          color="primary"
        >
          Contact Owner
        </Button>
        <Button startIcon={<DeleteIcon />} variant="contained" color="error">
          Delete
        </Button>
        <Button startIcon={<EditIcon />} variant="contained" color="primary">
          Edit
        </Button>
        <Button startIcon={<HouseOwnerIcon />} variant="contained">
          Owner Detail
        </Button>
        <Button startIcon={<MoneyIcon />} variant="contained">
          Price Detail
        </Button>
      </Box>
    </Paper>
  );
};

export default HouseDetail;
