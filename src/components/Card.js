import React from "react";
import {
  Card as MuiCard,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useToggleFavorites } from "./functions/houseFunctions";
import useMainStore from "./store/mainStore";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

// Define all your styles in the styles object
const styles = {
  card: {
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    cursor: "pointer",
    position: "relative", // Make sure the card has relative positioning
  },
  media: {
    height: 140,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  infoValue: {
    marginLeft: "5px",
  },
  favoriteIcon: {
    position: "absolute",
    top: "0px",
    right: "0px",
    zIndex: 2,
    background: "white",
    borderTopRightRadius: "3px",
  },
};

const Card = ({ house }) => {
  const toggleFavorites = useToggleFavorites();
  const storedUserData = useMainStore((state) => state.userData);

  const handleToggleFavorite = (e) => {
    e.stopPropagation(); // Prevents the event from bubbling up
    toggleFavorites(house.id);
  };

  return (
    <Box style={{ position: "relative" }}>
      {" "}
      {/* Ensure Box has relative positioning */}
      <Link to={`/houses/${house.id}`} style={{ textDecoration: "none" }}>
        <MuiCard style={styles.card}>
          <CardMedia
            style={styles.media}
            component="img"
            image={house.pic1}
            alt={house.subcity}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  <span style={styles.infoLabel}>Subcity:</span>
                  <span style={styles.infoValue}>{house.subcity}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <span style={styles.infoLabel}>Rooms:</span>
                  <span style={styles.infoValue}>{house.rooms}</span>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  <span style={styles.infoLabel}>Price:</span>
                  <span style={styles.infoValue}>{house.price} Birr</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <span style={styles.infoLabel}>Bathrooms:</span>
                  <span style={styles.infoValue}>{house.bathroom}</span>
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </MuiCard>
      </Link>
      <IconButton
        onClick={handleToggleFavorite}
        aria-label="Add to favorites"
        style={styles.favoriteIcon} // Apply the style from the styles object
        sx={{
          color: storedUserData?.favorites?.includes(house.id) ? "red" : "gray",
        }}
      >
        <FavoriteIcon />
      </IconButton>
    </Box>
  );
};

export default Card;
