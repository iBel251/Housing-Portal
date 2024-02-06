import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Container, Box, Badge, Button } from "@mui/material";
import { UserAuth } from "../context/AuthContext";
import { ChatAuth } from "../context/ChatContext";
import useMainStore from "../components/store/mainStore";
import { Outlet, Link } from "react-router-dom";

const styles = {
  root: {
    flexGrow: 1,
  },
  appBar: {
    marginBottom: "5px",
    backgroundColor: "rgba(255, 165, 0, 0.1)",
    color: "#2D6072",
  },
  navButton: {
    color: "#2D6072",
    marginLeft: "10px",
    border: "2px solid #2D6072",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.7)",
    },
  },
};

function Messages() {
  const { user } = UserAuth();
  const { getAllUserMessages } = ChatAuth();
  const notifications = useMainStore((state) => state.notifications);
  const activeChatRoomId = useMainStore((state) => state.activeChatRoomId);
  const setActivePage = useMainStore((state) => state.setActivePage);

  // You might still want to fetch user messages for showing counts or other purposes
  useEffect(() => {
    setActivePage("messages");
    const fetchUserMessages = async () => {
      try {
        const messages = await getAllUserMessages(user.uid);
        // Assuming you might use these messages for something else, like a sidebar
      } catch (error) {
        console.error("Error fetching user messages:", error);
      }
    };

    if (user?.uid) {
      fetchUserMessages();
    }
  }, [getAllUserMessages, user?.uid]);

  // Count message and enrollment notifications
  const messageCount = notifications.filter(
    (notification) =>
      notification.type === "message" &&
      notification.chatRoomId !== activeChatRoomId
  ).length;
  const enrollmentCount = notifications.filter(
    (notification) =>
      notification.type === "enrollment" && notification.status === "unseen"
  ).length;

  return (
    <div style={styles.root}>
      <AppBar position="static" sx={styles.appBar}>
        <Toolbar>
          <Box
            sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-start" }}
          >
            <Badge badgeContent={messageCount} color="error">
              <Button component={Link} to="/messages" sx={styles.navButton}>
                Messages
              </Button>
            </Badge>
            <Badge badgeContent={enrollmentCount} color="error">
              <Button
                component={Link}
                to="/messages/notifications"
                sx={styles.navButton}
              >
                Requests
              </Button>
            </Badge>
          </Box>
        </Toolbar>
      </AppBar>
      <Container>
        <Outlet />
      </Container>
    </div>
  );
}

export default Messages;
