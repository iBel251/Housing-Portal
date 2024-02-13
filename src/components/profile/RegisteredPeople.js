import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  DialogTitle,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { RoommateAuth } from "../../context/RoommateContext";
import useMainStore from "../store/mainStore";

const RegisteredPeople = ({ houseData }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newPerson, setNewPerson] = useState({
    name: "",
    phone: "",
    gender: "",
  });
  const [registeredPeople, setRegisteredPeople] = useState(
    houseData?.roommateData?.registeredPeople || []
  );

  const { manageRegisteredPeople } = RoommateAuth(); // Use the context

  useEffect(() => {
    setRegisteredPeople(houseData?.roommateData?.registeredPeople || []);
  }, [houseData]);

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const handleAddNewPerson = async () => {
    const optimisticUpdate = [...registeredPeople, newPerson];
    setRegisteredPeople(optimisticUpdate);
    try {
      await manageRegisteredPeople(houseData.id, newPerson, "add");
    } catch (error) {
      // Revert optimistic update on failure
      setRegisteredPeople(registeredPeople);
      console.error("Failed to add new person:", error);
    }
    setNewPerson({ name: "", phone: "", gender: "" }); // Reset the form
    handleDialogClose();
  };

  const handleDelete = async (personToDelete) => {
    const optimisticUpdate = registeredPeople.filter(
      (person) => person.phone !== personToDelete.phone
    );
    setRegisteredPeople(optimisticUpdate);
    try {
      await manageRegisteredPeople(houseData.id, personToDelete, "delete");
    } catch (error) {
      // Revert optimistic update on failure
      setRegisteredPeople(registeredPeople);
      console.error("Failed to delete person:", error);
    }
  };
  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Registered People {registeredPeople.length}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {registeredPeople.map((person, index) => (
              <ListItem
                key={person.phone} // Assuming phone can be a unique identifier
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(person)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${person.name}, ${person.gender}`}
                  secondary={person.phone}
                />
              </ListItem>
            ))}
          </List>
          <Button startIcon={<AddIcon />} onClick={handleDialogOpen}>
            Add Registered Person
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Dialog for adding new registered person */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add a New Registered Person</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newPerson.name}
            onChange={(e) =>
              setNewPerson({ ...newPerson, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            id="phone"
            label="Phone"
            type="text"
            fullWidth
            variant="outlined"
            value={newPerson.phone}
            onChange={(e) =>
              setNewPerson({ ...newPerson, phone: e.target.value })
            }
          />
          <TextField
            margin="dense"
            id="gender"
            label="Gender"
            type="text"
            fullWidth
            variant="outlined"
            value={newPerson.gender}
            onChange={(e) =>
              setNewPerson({ ...newPerson, gender: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddNewPerson}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RegisteredPeople;
