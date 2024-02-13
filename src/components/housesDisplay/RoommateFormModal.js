import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import "../../styles/customstyles.css";

const RoommateFormModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    age: "",
    gender: "",
    maritalStatus: "",
    children: "",
    profession: "",
    phoneNumber: "",
  });

  const isFormValid = () => {
    // Check if the required fields are not empty and age and children are numbers
    return (
      formData.fullname &&
      formData.age &&
      !isNaN(formData.age) &&
      formData.gender &&
      formData.maritalStatus &&
      !isNaN(formData.children) && // Allows the field to be empty or a number
      formData.profession
    );
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prevData) => ({ ...prevData, phoneNumber: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Please fill in all required fields correctly.");
      return;
    }
    // Convert age and children to numbers
    const submissionData = {
      ...formData,
      age: Number(formData.age),
      children: formData.children ? Number(formData.children) : 0, // Convert to 0 if empty
    };
    onSubmit(submissionData); // Pass the form data back to the parent component
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <Box style={{ textAlign: "center", margin: "5px 0 0", pading: "0px" }}>
        Details of person joining the house.
      </Box>
      <form onSubmit={handleSubmit}>
        <DialogContent style={{ margin: "0px", padding: "0px 15px" }}>
          <TextField
            autoFocus
            margin="dense"
            name="fullname"
            label="Full Name"
            type="text"
            fullWidth
            value={formData.fullname}
            onChange={handleFormChange}
          />
          <PhoneInput
            defaultCountry="ET"
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            placeholder="09123457678 (optional)"
            countries={["ET"]} // Restrict to Ethiopia only
            style={{
              maxWidth: "100%",
              flagSize: "medium",
              height: "50px",
              fontSize: "30px",
            }}
          />
          <TextField
            margin="dense"
            name="age"
            label="Age"
            type="number"
            fullWidth
            value={formData.age}
            onChange={handleFormChange}
          />
          <TextField
            select
            margin="dense"
            name="gender"
            label="Gender"
            fullWidth
            value={formData.gender}
            onChange={handleFormChange}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </TextField>
          <TextField
            select
            margin="dense"
            name="maritalStatus"
            label="Marital Status"
            fullWidth
            value={formData.maritalStatus}
            onChange={handleFormChange}
          >
            <MenuItem value="single">Single</MenuItem>
            <MenuItem value="married">Married</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            name="children"
            label="Children"
            type="number"
            fullWidth
            value={formData.children}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="profession"
            label="Profession"
            type="text"
            fullWidth
            value={formData.profession}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RoommateFormModal;
