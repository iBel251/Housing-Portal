import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";

const HouseReports = ({ houseReports, formatDate }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        House Reports
      </Typography>
      {Object.entries(houseReports).map(([houseId, reports], index) => {
        if (houseId === "id") return null; // Skip the 'id' key
        return (
          <Paper
            elevation={3}
            key={houseId}
            sx={{ marginBottom: 2, padding: 2 }}
          >
            <Typography variant="h6">House ID: {houseId}</Typography>
            <List>
              {reports.map((report, reportIndex) => (
                <React.Fragment key={reportIndex}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={`Reported by: ${report.reporterId}`}
                      secondary={`Date: ${formatDate(
                        report.date.seconds
                      )} - Message: ${report.message}`}
                    />
                  </ListItem>
                  {reportIndex < reports.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        );
      })}
    </Box>
  );
};

export default HouseReports;
