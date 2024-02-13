// Report.js
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";
import { FeedbackAuth } from "../context/FeedbackContext";
import { HashLoader } from "react-spinners";

const reportOptions = [
  "Fake house",
  "User asked for money",
  "Wrong location",
  "Inappropriate content",
  "Insults and inapropriate messages",
  "Other",
];

const Report = ({ open, onClose, targetId, type }) => {
  const [selectedOption, setSelectedOption] = useState("Fake house");
  const [isLoading, setIsLoading] = useState(false);
  const [customReason, setCustomReason] = useState("");
  const { submitReport } = FeedbackAuth();
  const isOtherSelected = selectedOption === "Other";

  const handleSubmit = async () => {
    setIsLoading(true);
    const reportMessage = isOtherSelected ? customReason : selectedOption;

    await submitReport(type, targetId, reportMessage);
    setIsLoading(false);
    onClose(); // Close the dialog after submitting
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Report Listing</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <FormLabel component="legend">Reason for reporting:</FormLabel>
          <RadioGroup
            aria-label="report-reason"
            name="report-reason"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            {reportOptions.map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
          {isOtherSelected && (
            <TextField
              autoFocus
              margin="dense"
              id="custom-reason"
              label="Please specify"
              type="text"
              fullWidth
              variant="outlined"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          style={{ color: "orange", border: "1px solid orange" }}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          style={{
            background: "#2D6072",
            width: "80px",
            height: "40px",
            color: "orange",
            fontSize: "14px",
          }}
        >
          {isLoading ? <HashLoader color="orange" size={20} /> : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Report;
