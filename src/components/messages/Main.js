import React from "react";
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
import useMainStore from "../store/mainStore";

const styles = {
  root: {
    flexGrow: 1,
  },
  appBar: {
    marginBottom: "5px",
    backgroundColor: "rgba(255, 165, 0, 0.1)",
    color: "#2D6072",
  },
  messageSection: {
    padding: "20px",
  },
  paper: {
    padding: "20px",
  },
  avatar: {
    marginRight: "5px",
  },
};

const Main = ({ isLoading, userId }) => {
  const userMessages = useMainStore((state) => state.messages);
  const notifications = useMainStore((state) => state.notifications);

  const newMessages = notifications.filter(
    (notification) => notification.type === "message"
  );

  // Sort chat rooms by the timestamp of the latest message
  userMessages.sort((a, b) => {
    const lastMessageA =
      a.messagesData.messages[a.messagesData.messages.length - 1]?.timestamp
        .seconds || 0;
    const lastMessageB =
      b.messagesData.messages[b.messagesData.messages.length - 1]?.timestamp
        .seconds || 0;
    return lastMessageB - lastMessageA;
  });

  if (isLoading) {
    return (
      <Container style={styles.root}>
        <CircularProgress />
        <Typography>Loading messages...</Typography>
      </Container>
    );
  }

  if (!userMessages || userMessages.length === 0) {
    return (
      <Container style={styles.root}>
        <Typography>No messages</Typography>
      </Container>
    );
  }

  const countNewMessages = (chatRoomId) => {
    return notifications.filter(
      (notification) =>
        notification.type === "message" &&
        notification.chatRoomId === chatRoomId
    ).length;
  };

  return (
    <div style={styles.root}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <Paper sx={styles.paper}>
              <List>
                {userMessages.map((chatRoom) => {
                  const lastMessage =
                    chatRoom.messagesData.messages.length > 0
                      ? chatRoom.messagesData.messages[
                          chatRoom.messagesData.messages.length - 1
                        ]
                      : null;
                  const newMessageCount = countNewMessages(chatRoom.chatRoomId);

                  return (
                    <React.Fragment key={chatRoom.chatRoomId}>
                      <Badge
                        badgeContent={newMessageCount}
                        color="error"
                        sx={{
                          ".MuiBadge-badge": {
                            top: "15px",
                            right: "0",
                          },
                        }}
                      >
                        <ListItem
                          alignItems="flex-start"
                          component={Link}
                          to={`/messages/${chatRoom.chatRoomId}`}
                        >
                          <Avatar sx={styles.avatar}>
                            {/* Display an initial based on the chat room or user name */}
                            {chatRoom.messagesData.user1Id === userId
                              ? chatRoom.messagesData.user2Name[0]
                              : chatRoom.messagesData.user1Name[0]}
                          </Avatar>
                          <ListItemText
                            primary={
                              chatRoom.messagesData.user1Id === userId
                                ? chatRoom.messagesData.user2Name
                                : chatRoom.messagesData.user1Name
                            }
                            secondary={
                              lastMessage ? lastMessage.body : "No messages yet"
                            }
                          />
                        </ListItem>
                      </Badge>
                      <Divider component="li" />
                    </React.Fragment>
                  );
                })}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Main;
