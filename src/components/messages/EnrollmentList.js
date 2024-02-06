import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
  Dialog,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MessageIcon from "@mui/icons-material/Message";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import CallIcon from "@mui/icons-material/Call";
import { RoommateAuth } from "../../context/RoommateContext";
import { ChatAuth } from "../../context/ChatContext";
import { useNavigate } from "react-router-dom";
import MessageDetail from "./MessageDetail";

const styles = {
  container: {
    maxWidth: "500px",
  },
  messageBtn: {
    marginLeft: "10px",
    color: "orange",
    padding: "5px",
  },
  deleteBtn: {
    margin: "0 25px",
    color: "red",
    padding: "5px",
    borderLeft: "1px solid red",
    borderRight: "1px solid red",
  },
  unseenNotification: {
    backgroundColor: "#f0f0f0",
  },
  listLableBig: {
    "@media (max-width: 600px)": {
      // Media query for small screens
      display: "none",
    },
  },
  listLableMobile: {
    display: "none",
    "@media (max-width: 600px)": {
      // Media query for small screens
      display: "flex",
    },
  },
};

const EnrollmentList = ({ houseData, roommateNotifications }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
  const { updateNotificationStatusToSeen } = RoommateAuth();
  const { createChatRoom } = ChatAuth();
  const navigate = useNavigate();
  roommateNotifications = roommateNotifications.filter(
    (notification) => notification.status != "removed"
  );

  // Early return if data is not yet loaded
  if (!roommateNotifications || roommateNotifications.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        No enrolment requests for this house.
      </Box>
    );
  }

  const handleOpenDialog = (chatRoomId) => {
    setSelectedChatRoomId(chatRoomId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedChatRoomId(null);
  };

  const handleAccordionChange =
    (panelId, userId, houseId) => (event, isExpanded) => {
      if (isExpanded) {
        // Find the relevant notification for the user and house
        const notification = roommateNotifications.find(
          (notif) => notif.userId === userId && notif.houseId === houseId
        );

        // Check if the notification's status is "unseen" before marking it as seen
        console.log(
          `Marking notification as seen for user ${userId} and house ${houseId}`
        );
        if (notification && notification.status === "unseen") {
          updateNotificationStatusToSeen(userId, houseId, "seen"); // Mark the notification as seen
        } else {
          console.log("notification is already seen");
        }
      }
    };

  const sortedNotifications = roommateNotifications.sort(
    (a, b) => b.date - a.date
  );

  // Handler for message button click
  const handleMessageClick = async (event, userId, userName) => {
    event.stopPropagation(); // Prevents accordion toggle
    console.log("Message user:", userId);
    const chatRoomId = await createChatRoom(
      houseData.userId, // owner id
      userId, // aplied person id
      houseData.owner, //owner name
      userName // applied person name
    );

    // navigate(`/messages/${newChatRoomId}`);
    handleOpenDialog(chatRoomId);
  };

  // Handler for remove button click
  const handleRemoveClick = (event, userId, houseId) => {
    event.stopPropagation(); // Prevents accordion toggle
    updateNotificationStatusToSeen(userId, houseId, "removed"); // Mark the notification as seen

    // Further actions can be implemented here
  };
  return (
    <Box style={styles.container}>
      {sortedNotifications.map((notification, index) => {
        const interestedPerson =
          houseData.roommateData.interestedPeople[notification.userId];
        const panelId = `panel${index}`;
        const isUnseen = notification.status === "unseen";
        return (
          <Accordion
            key={index}
            onChange={handleAccordionChange(
              panelId,
              notification.userId,
              houseData.id
            )}
            style={isUnseen ? styles.unseenNotification : null}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-content-${index}`}
              id={`panel-header-${index}`}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                width="100%"
                alignItems="center"
              >
                <Typography sx={styles.listLableBig}>
                  {interestedPerson?.fullname} - {interestedPerson?.gender} -{" "}
                  {interestedPerson?.profession}
                </Typography>
                <Typography sx={styles.listLableMobile}>
                  {interestedPerson?.fullname}
                </Typography>

                <Box>
                  <IconButton
                    aria-label="message"
                    size="large"
                    style={styles.messageBtn}
                    onClick={(event) =>
                      handleMessageClick(
                        event,
                        notification.userId,
                        interestedPerson.fullname
                      )
                    }
                  >
                    <MessageIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton
                    aria-label="remove"
                    size="large"
                    style={styles.deleteBtn}
                    onClick={(event) =>
                      handleRemoveClick(
                        event,
                        notification.userId,
                        houseData.id
                      )
                    }
                  >
                    <DeleteSweepIcon fontSize="inherit" />
                  </IconButton>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Full Name"
                    secondary={interestedPerson?.fullname}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Gender"
                    secondary={interestedPerson?.gender}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Profession"
                    secondary={interestedPerson?.profession}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Age"
                    secondary={interestedPerson?.age}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Marital Status"
                    secondary={interestedPerson?.maritalStatus}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Children"
                    secondary={interestedPerson?.children}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Phone Number"
                    secondary={interestedPerson?.phoneNumber}
                  />
                  {interestedPerson?.phoneNumber && (
                    <IconButton
                      color="primary"
                      href={`tel:${interestedPerson?.phoneNumber}`}
                    >
                      <CallIcon />
                    </IconButton>
                  )}
                </ListItem>
                {/* Additional details can be added here */}
              </List>
            </AccordionDetails>
          </Accordion>
        );
      })}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <MessageDetail chatRoomId={selectedChatRoomId} />
      </Dialog>
    </Box>
  );
};

export default EnrollmentList;
