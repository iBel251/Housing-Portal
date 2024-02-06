import React, { useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import useMainStore from "../components/store/mainStore";

const styles = {
  root: {
    backgroundColor: "#F5F5F5",
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
  },
  title: {
    color: "#2D6072",
  },
  sectionTitle: {
    color: "#FF8C00",
    marginTop: "20px",
    marginBottom: "10px",
  },
  text: {
    fontSize: "1rem",
    lineHeight: "1.5",
    color: "#333",
  },
  divider: {
    marginTop: "15px",
    marginBottom: "15px",
  },
};

function Help() {
  const setActivePage = useMainStore((state) => state.setActivePage);

  useEffect(() => {
    setActivePage("help");
  }, []);
  return (
    <Box sx={styles.root}>
      <Typography variant="h4" gutterBottom sx={styles.title}>
        Help & FAQs
      </Typography>

      <Divider sx={styles.divider} />

      <Typography variant="h5" gutterBottom sx={styles.sectionTitle}>
        Account Registration
      </Typography>
      <List>
        <ListItem>
          <ListItemText sx={styles.text}>
            To start using our house rental and exchange service, you need to
            register with your full name, email address, and password.
          </ListItemText>
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={styles.sectionTitle}>
        Viewing Houses
      </Typography>
      <List>
        <ListItem>
          <ListItemText sx={styles.text}>
            Once registered, you can view all the available houses listed for
            rental or exchange in Addis Ababa.
          </ListItemText>
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={styles.sectionTitle}>
        House Registration for Exchange
      </Typography>
      <List>
        <ListItem>
          <ListItemText sx={styles.text}>
            To participate in a house exchange, navigate to your profile page
            where you'll find an option for house registration. If you haven't
            registered a house yet, you'll see a button to guide you through the
            process.
          </ListItemText>
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={styles.sectionTitle}>
        Customer Support
      </Typography>
      <List>
        <ListItem>
          <ListItemText sx={styles.text}>
            For further inquiries or issues, you can contact our customer
            support through the "Contact Us" section in the app or via email at
            support@example.com.
          </ListItemText>
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom sx={styles.sectionTitle}>
        Legal & Privacy
      </Typography>
      <List>
        <ListItem>
          <ListItemText sx={styles.text}>
            Make sure to read our terms of service and privacy policy to
            understand your rights and responsibilities while using our
            platform.
          </ListItemText>
        </ListItem>
      </List>
    </Box>
  );
}

export default Help;
