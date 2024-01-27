import React, { useState, useEffect } from "react";
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
  Grid,
  CircularProgress,
  Badge,
} from "@mui/material";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { ChatAuth } from "../context/ChatContext";

const styles = {
  root: {
    flexGrow: 1,
  },
  appBar: {
    marginBottom: "5px",
    backgroundColor: "orange",
    color: "#2D6072",
  },
  paper: {
    padding: "5px",
  },
  avatar: {
    marginRight: "5px",
  },
  messageSection: {
    width: "50%",
    minHeight: "500px",
  },
};

function Messages() {
  const { user } = UserAuth();
  const { getAllUserMessages } = ChatAuth();
  const [userMessages, setUserMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true); // Set loading to true before fetching data
    const fetchUserMessages = async () => {
      try {
        const messages = await getAllUserMessages(user.uid);
        setUserMessages(messages);
        setIsLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error("Error fetching user messages:", error);
        setIsLoading(false); // Set loading to false if an error occurs
      }
    };

    fetchUserMessages();
  }, [getAllUserMessages, user.uid]);

  return (
    <div style={styles.root}>
      <AppBar position="static" sx={styles.appBar}>
        <Toolbar>
          <Typography variant="h6">Messages</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6} style={styles.messageSection}>
            <Paper sx={styles.paper}>
              {isLoading ? (
                <>
                  <CircularProgress />
                  <Typography>Loading messages ...</Typography>
                </>
              ) : userMessages.length > 0 ? (
                <List>
                  {userMessages.map((message) => (
                    <React.Fragment key={message.chatRoomId}>
                      <ListItem
                        alignItems="flex-start"
                        component={Link}
                        to={`/messages/${message.chatRoomId}`}
                      >
                        <Badge
                          color="error"
                          badgeContent={
                            message.messagesData.unreadCount?.[user.uid] || 0
                          }
                          invisible={
                            !(message.messagesData.unreadCount?.[user.uid] > 0)
                          } // Display badge only if there are unread messages
                        >
                          <Avatar alt="User" sx={styles.avatar}>
                            {message.messagesData?.user1Name[0]}
                          </Avatar>
                        </Badge>
                        <ListItemText
                          primary={
                            user.uid !== message.messagesData.user1Id
                              ? message.messagesData.user1Name
                              : message.messagesData.user2Name
                          }
                          secondary={
                            message?.messagesData?.messages[
                              message?.messagesData?.messages.length - 1
                            ]?.body
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography>No messages found.</Typography>
              )}
            </Paper>
          </Grid>
          {/* Add other content on the right side */}
        </Grid>
      </Container>
    </div>
  );
}

export default Messages;
