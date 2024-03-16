import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./carousel.css";
import IndexComponent from "./IndexComponent";
import coverimage from "../assets/coveremage.jpeg";
import { useNavigate } from "react-router-dom";
import useMainStore from "../components/store/mainStore";

const styles = {
  root: {
    textAlign: "center",
    paddingTop: "5px",
  },
  carouselContainer: {
    maxWidth: "100%",
    overflow: "hidden",
  },
  carouselImage: {
    width: "100%",
    height: "auto",
  },
  // Add individual class names as strings
  welcomeSectionContainer: "welcome-section-container",
  headerText: "header-text",
  headerSpan: "header-span",
  detailText: "detail-text",
};

const Index = () => {
  const setActivePage = useMainStore((state) => state.setActivePage);

  useEffect(() => {
    setActivePage("home");
  }, []);
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ position: "relative" }}>
        <div className={styles.welcomeSectionContainer}>
          <div className={styles.headerText}>
            Welcome to <span className={styles.headerSpan}>የኛ Housing</span>
          </div>
          <div variant="h5" className={styles.detailText}>
            The first free home exchange website in Ethiopia.
          </div>

          {/* search field */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            sx={{
              maxWidth: "700px",
              margin: "0 auto",
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              p: {
                sm: "30px",
              },
              paddingBottom: {
                sm: "30px",
              },
              marginTop: "30px",
            }} // Adjust max width and margin
          >
            <Typography
              variant="h5"
              sx={{
                color: "orange",
                textDecoration: "underline",
                fontWeight: "bold",
              }}
            >
              Where do you want to live?
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap" width="100%"></Box>

            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              startIcon={<SearchIcon />}
              style={{
                height: "100%",
                width: "100%",
                backgroundColor: "#2D6072",
              }}
            >
              Explore houses
            </Button>
          </Box>
        </div>
        <div className={styles.root}>
          <div className={styles.carouselContainer}>
            <Carousel showArrows={true}>
              <div>
                <img src={coverimage} alt="" className={styles.carouselImage} />
              </div>
              <div>
                <img
                  src="https://picsum.photos/500"
                  alt=""
                  className={styles.carouselImage}
                />
              </div>
              <div>
                <img
                  src="https://picsum.photos/500"
                  alt=""
                  className={styles.carouselImage}
                />
              </div>
            </Carousel>
          </div>
        </div>
      </Box>
      <IndexComponent />
    </Box>
  );
};

export default Index;
