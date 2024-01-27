import React from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#333",
        color: "#fff",
        padding: "3rem 0",
        marginTop: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" paragraph>
              Welcome to የኛ Housing Exchange, your premier platform for
              connecting multiple renters in Addis Ababa, Ethiopia. Our mission
              is to create a vibrant community where residents can easily
              exchange homes and experience the joy of exploring new and
              convinent neighborhoods.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Social Media
            </Typography>
            <IconButton color="inherit" aria-label="Facebook">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="Twitter">
              <TwitterIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="Instagram">
              <InstagramIcon />
            </IconButton>
            <Grid>
              <Typography variant="body2" paragraph>
                <br />
                Contact Us:
                <br />
                Email: info@yegnahousing.com
                <br />
                Phone: +251-9XX-XXX-XXX
                <br />
                Address: Addis Ababa/Ethiopia
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Subscribe
            </Typography>
            <Typography variant="body2" paragraph>
              Get the latest updates and news straight to your inbox.
            </Typography>
            <form>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Enter your email"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <Button
                      variant="contained"
                      color="primary"
                      disableElevation
                    >
                      Subscribe
                    </Button>
                  ),
                }}
                sx={{ backgroundColor: "white" }}
              />
            </form>
          </Grid>
        </Grid>
      </Container>
      <Typography variant="body2" align="center" style={{ marginTop: "2rem" }}>
        © {new Date().getFullYear()} www.yegnahousing.com All rights reserved.
      </Typography>
    </footer>
  );
};

export default Footer;
