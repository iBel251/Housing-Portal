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
} from "@mui/material";
import { UserAuth } from "../../context/AuthContext";
import { ChatAuth } from "../../context/ChatContext";
import useMainStore from "../../components/store/mainStore";

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
};

function MessageDetail({ chatRoomId }) {
  const { user } = UserAuth();
  const {
    getMessageDataById,
    addMessageToChat,
    resetUnreadCount,
    removeMessageNotificationsForChatRoom,
  } = ChatAuth();
  const [messageData, setMessageData] = useState(null);
  const [response, setResponse] = useState("");
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
    // Set the active chat room when the component mounts
    setActiveChatRoomId(messageId);

    return () => {
      // Reset the active chat room when the component unmounts
      setActiveChatRoomId(null);
    };
  }, [messageId]);

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

  if (!messageData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.root}>
      <AppBar position="static" sx={styles.appBar}>
        <Toolbar>
          <Typography variant="h6">Message Detail</Typography>
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          padding: "0px",
          margin: "0",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Paper
          elevation={3}
          style={{
            padding: "5px",
            width: "100%",
            margin: "0",
            maxWidth: "600px",
          }}
        >
          <div style={styles.responseSection}>
            <Typography variant="h6">Conversation:</Typography>
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
              >
                Send
              </Button>
            </div>
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
