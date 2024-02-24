import React from "react";
import { Typography, Paper, Button, Link } from "@mui/material";

const styles = {
  container: {
    padding: "20px",
    margin: "20px auto",
    maxWidth: "600px",
    textAlign: "center",
  },
  message: {
    marginBottom: "20px",
  },
  emailLink: {
    marginTop: "10px",
    fontWeight: "bold",
  },
  contactButton: {
    marginTop: "20px",
    color: "#FFFFFF",
    backgroundColor: "#2D6072",
    "&:hover": {
      backgroundColor: "#245A62",
    },
  },
};

const BlockedUserPage = () => {
  return (
    <Paper elevation={3} style={styles.container}>
      <Typography variant="h5" style={styles.message}>
        Access Restricted
      </Typography>
      <Typography variant="body1">
        Due to violations of the company policy, you have been banned from the
        platform.
      </Typography>
      <Typography variant="body2" style={styles.emailLink}>
        If you believe this is a mistake or wish to appeal, please contact us at{" "}
        <Link href="mailto:support@example.com" color="inherit">
          support@example.com
        </Link>
      </Typography>
      <Button
        variant="contained"
        color="primary"
        style={styles.contactButton}
        onClick={() => (window.location.href = "mailto:support@example.com")}
      >
        Contact Support
      </Button>
    </Paper>
  );
};

export default BlockedUserPage;
