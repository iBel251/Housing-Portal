import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  TextField,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { UserAuth } from "../../context/AuthContext";
import { ChatAuth } from "../../context/ChatContext";
import { FeedbackAuth } from "../../context/FeedbackContext";
import useMainStore from "../../components/store/mainStore";
import Report from "../Report";
import ReportIcon from "@mui/icons-material/Report";

const styles = {
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: "orange",
    color: "#2D6072",
    marginBottom: "10px",
  },
  responseSection: {
    marginTop: "20px",
    padding: "5px",
  },
  responseForm: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  responseInput: {
    flexGrow: 1,
    marginRight: "10px",
  },
  avatar: {
    marginRight: "10px",
  },
  messageListContainer: {
    maxHeight: "500px", // Adjust based on your layout
    overflowY: "auto",
    // Other styles as needed
  },
  reportBtnsContainer: {
    display: "flex",
    margin: "10px",
    justifyContent: "end",
    alignItems: "end",
    gap: "3px",
  },
};

function MessageDetail({ chatRoomId }) {
  const { user } = UserAuth();
  const {
    getMessageDataById,
    addMessageToChat,
    resetUnreadCount,
    removeMessageNotificationsForChatRoom,
  } = ChatAuth();
  const { toggleUserInBlockedList } = FeedbackAuth();
  const [messageData, setMessageData] = useState(null);
  const [response, setResponse] = useState("");
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false); // State to track if the user is blocked
  const [blockedStatus, setBlockedStatus] = useState(false); // State to track if the user is blocked
  const userData = useMainStore((state) => state.userData);
  const toggleRecount = useMainStore((state) => state.toggleRecount);
  const refetchMessages = useMainStore((state) => state.toggleMessagesRefetch);
  const notifications = useMainStore((state) => state.notifications);

  const setActiveChatRoomId = useMainStore(
    (state) => state.setActiveChatRoomId
  );
  const activeChatRoomId = useMainStore((state) => state.activeChatRoomId);

  let { messageId } = useParams();
  let backLinkStyle = {};
  if (chatRoomId) {
    messageId = chatRoomId;
    backLinkStyle = {
      display: "none",
    };
  }

  useEffect(() => {
    // Assuming you have access to a method to check if the user is blocked
    // and userData includes a list of blocked user IDs
    const checkIfBlocked = async () => {
      const otherUserId =
        messageData.user1Id === user.uid
          ? messageData.user2Id
          : messageData.user1Id;
      if (messageData.blockStatus.otherUserId === true) {
        setIsBlocked(true);
      } else {
        setIsBlocked(false);
      }
    };

    if (messageData) {
      checkIfBlocked();
    }
  }, [messageData, userData.blockedList, user.uid]);

  useEffect(() => {
    // Set the active chat room when the component mounts
    setActiveChatRoomId(messageId);

    return () => {
      // Reset the active chat room when the component unmounts
      setActiveChatRoomId(null);
    };
  }, [messageId]);

  useEffect(() => {
    if (messageData?.blockStatus?.[user.uid] === true) {
      setBlockedStatus(true);
    } else {
      setBlockedStatus(false);
    }
    console.log("you are blocked set to : ", blockedStatus);
  }, [messageData]);

  useEffect(() => {
    let unsubscribe;

    if (messageId) {
      // Set up the real-time subscription and store the unsubscribe function
      unsubscribe = getMessageDataById(messageId, (data) => {
        setMessageData(data);
        if (user.uid && messageId) {
          removeMessageNotificationsForChatRoom(user.uid, messageId).catch(
            console.error
          );
          removeMessageNotificationsForChatRoomLocal(messageId);
        }

        // Check if the last message in the chat is not from the current user.
        if (
          data.messages &&
          data.messages.length > 0 &&
          data.messages[data.messages.length - 1].sender !== user.uid
        ) {
          // Reset unread count for the user for this chat
          resetUnreadCount(
            messageId,
            user.uid,
            removeMessageNotificationsForChatRoom
          );
        }
      });
    }

    // Clean up the real-time subscription when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      removeMessageNotificationsForChatRoom(user.uid, messageId);
      toggleRecount();
    };
  }, [messageId, user.uid]);

  useEffect(() => {
    // Scroll to the latest message after the component mounts and messages are fetched
    const messageListContainer = document.getElementById(
      "messageListContainer"
    );
    if (messageListContainer) {
      messageListContainer.scrollTop = messageListContainer.scrollHeight;
    }
  }, [messageData]);

  const removeMessageNotificationsForChatRoomLocal = (chatRoomId) => {
    // Filter out message notifications for the specified chat room
    const updatedNotifications = notifications.filter(
      (notification) =>
        !(
          notification.type === "message" &&
          notification.chatRoomId === chatRoomId
        )
    );

    // Update the Zustand store with the filtered notifications
    useMainStore.getState().setNotifications(updatedNotifications);

    console.log(
      "Local message notifications for chat room removed successfully."
    );
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent a new line being added in the TextField
      handleSendResponse();
    }
  };
  // Event handler for updating the response state as the user types
  const handleResponseChange = (event) => {
    setResponse(event.target.value);
  };

  const handleOpenReportDialog = () => {
    setOpenReportDialog(true);
  };

  const handleCloseReportDialog = () => {
    setOpenReportDialog(false);
  };

  const handleBlockUserClick = () => {
    // Open the confirmation dialog
    setOpenConfirmationDialog(true);
  };

  const handleCloseConfirmationDialog = (confirmed) => {
    // Close the confirmation dialog
    setOpenConfirmationDialog(false);

    // If confirmed, proceed with the block/unblock action
    if (confirmed) {
      handleBlockUser();
    }
  };

  // Event handler for sending the response
  const handleSendResponse = async () => {
    if (messageData && response) {
      try {
        // Call addMessageToChat with the necessary parameters
        const newMessage = await addMessageToChat(
          messageId,
          response,
          user.uid,
          userData.firstName
        );

        if (newMessage) {
          // Reset the response field after sending
          setResponse("");
          refetchMessages();
        } else {
          // Handle the case where the message could not be sent
          // You can set an error message or take appropriate action
        }
      } catch (error) {
        console.error("Error sending message:", error);
        // Handle the error, e.g., display an error message
      }
    }
  };

  const handleBlockUser = async () => {
    if (messageData) {
      let bolckedId = messageData.user1Id;
      if (messageData.user1Id === user.uid) {
        bolckedId = messageData.user2Id;
      }

      await toggleUserInBlockedList(bolckedId, messageId);
      setIsBlocked(!isBlocked);
    }
    console.log(messageData);
  };

  if (!messageData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.root}>
      <Container
        sx={{
          padding: "0px",
          margin: "0",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Report
          open={openReportDialog}
          onClose={handleCloseReportDialog}
          targetId={messageId}
          type={"user"}
        />
        <Paper
          elevation={3}
          style={{
            padding: "5px",
            width: "100%",
            margin: "0",
            maxWidth: "600px",
          }}
        >
          <Box style={styles.reportBtnsContainer}>
            <Button
              variant="outlined"
              style={{ color: "orange", borderColor: "orange" }}
              onClick={handleBlockUserClick}
            >
              {isBlocked ? "Unblock" : "Block"}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleOpenReportDialog}
            >
              Report
              <ReportIcon sx={{ marginLeft: "5px", fontSize: "25px" }} />
            </Button>
            <Dialog
              open={openConfirmationDialog}
              onClose={() => handleCloseConfirmationDialog(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {`Confirm ${isBlocked ? "Unblock" : "Block"}`}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to {isBlocked ? "unblock" : "block"}{" "}
                  this user? <br />
                  {!isBlocked ? "User can no longer message you." : ""}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleCloseConfirmationDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleCloseConfirmationDialog(true)}
                  autoFocus
                >
                  {isBlocked ? "Unblock" : "Block"}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
          <div style={styles.responseSection}>
            <div id="messageListContainer" style={styles.messageListContainer}>
              <List>
                {messageData?.messages.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        flexDirection:
                          item.sender === user.uid ? "row-reverse" : "row", // Reverse direction for "You"
                        justifyContent:
                          item.sender === user.uid ? "flex-end" : "flex-start", // Align messages to the right for "You"
                        textAlign: item.sender === user.uid ? "right" : "left",
                      }}
                    >
                      <Avatar alt="User" sx={styles.avatar}>
                        {item.senderName[0]}
                      </Avatar>
                      <ListItemText
                        primary={item.senderName}
                        secondary={item.body}
                        sx={{
                          paddingRight: item.sender === user.uid ? "6px" : "0",
                        }}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </div>
            <div />
            {blockedStatus ? (
              "you have been blocked. Can't send messages to this user."
            ) : (
              <div style={styles.responseForm}>
                <TextField
                  value={response}
                  label="Type your message here"
                  variant="outlined"
                  style={styles.responseInput}
                  onChange={handleResponseChange}
                  onKeyDown={handleKeyPress}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendResponse}
                  style={{
                    color: "orange",
                    background: "#2D6072",
                    height: "55px",
                  }}
                >
                  Send
                </Button>
              </div>
            )}
          </div>
          <Link to="/messages" style={backLinkStyle}>
            Back to Messages
          </Link>
        </Paper>
      </Container>
    </div>
  );
}

export default MessageDetail;
