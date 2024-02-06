import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import HouseIcon from "@mui/icons-material/House";
import ExploreIcon from "@mui/icons-material/Explore";
import ChatIcon from "@mui/icons-material/Chat";

const styles = {
  container: {
    background: "white",
  },
  hero: {
    background: "gray",
    padding: "5px",
    display: "flex",
    alignItems: "center",
  },
  heroContent: {
    background: "gray",
    marginRight: "5px",
  },
  heroImage: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    textAlign: "center",
    color: "#FFA500", // Orange color
    marginBottom: "1rem",
  },
  howItWorks: {
    background: "#EEF8F8",
    py: "25px",
    my: "10px",
  },
  stepIcon: {
    color: "#FFA500", // Orange color
    fontSize: "2rem",
  },
  card: {
    background: "#ffffff",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  featuredListings: {
    background: "#f0f0f0",
    padding: "5px",
  },
  testimonials: {
    background: "#ffffff",
    padding: "5px",
  },
  ctaSection: {
    background: "#f0f0f0",
    padding: "5px",
    display: "flex",
    alignItems: "center",
  },
  ctaContent: {
    marginRight: "5px",
  },
  button: {
    background: "#2D6072", // Dark Blue color
    color: "#ffffff",
  },
};

const IndexComponent = () => {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section>
        <Container sx={styles.hero}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} sx={styles.heroContent}>
              <Typography variant="h3" gutterBottom sx={styles.sectionHeader}>
                Welcome to House Exchange
              </Typography>
              <Typography variant="body1" paragraph>
                Discover a new way to experience different neighborhoods. With
                House Exchange, you can find your dream home in a new area and
                make exciting memories. Explore our listings and connect with
                homeowners for the perfect exchange.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/signup"
                sx={styles.button}
              >
                Get Started
              </Button>
            </Grid>
            <Grid item xs={12} md={6} sx={styles.heroImage}>
              {/* Add hero image here */}
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* How It Works Section */}
      <section>
        <Container sx={styles.howItWorks}>
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={styles.sectionHeader}
          >
            How It Works
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={styles.card}>
                <CardContent>
                  <HouseIcon sx={styles.stepIcon} />
                  <Typography variant="h5" gutterBottom>
                    Sign Up
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Create an account and start exploring house exchange
                    options. Register your current living home with as much
                    details as possible and specify your prefered houses to
                    change.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={styles.card}>
                <CardContent>
                  <ExploreIcon sx={styles.stepIcon} />
                  <Typography variant="h5" gutterBottom>
                    Browse Listings
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Search for available houses in your desired neighborhood by
                    providing the sub-city, room number or price range to help
                    you narrow the results to your desired plan.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={styles.card}>
                <CardContent>
                  <ChatIcon sx={styles.stepIcon} />
                  <Typography variant="h5" gutterBottom>
                    Contact Owners
                  </Typography>
                  <Typography variant="body2" paragraph>
                    After finding your desired house, send a request and contact
                    house owners for potential exchanges. The platform have
                    built in chat system to make communications clear and
                    easier.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Featured Listings Section */}
      {/* Add your featured listings here */}

      {/* Testimonials Section */}
      {/* Add your user testimonials here */}

      {/* Call to Action Section */}
      <section sx={styles.ctaSection}>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} sx={styles.ctaContent}>
              <Typography variant="h3" gutterBottom sx={styles.sectionHeader}>
                Ready to Start Your House Exchange Journey?
              </Typography>
              <Typography variant="body1" paragraph>
                Sign up today and explore new neighborhoods!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/signup"
                sx={styles.button}
              >
                Get Started
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Add CTA image here */}
            </Grid>
          </Grid>
        </Container>
      </section>
    </div>
  );
};

export default IndexComponent;
