import React from "react";
import { Box, Typography, Paper, Avatar, Rating } from "@mui/material";

const styles = {
  feedbackContainer: {
    marginTop: "20px",
  },
  content: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  nameAndTime: {
    display: "flex",
    gap: "10px",
  },
};

const FeedbackDisplay = ({ feedbackData }) => {
  let averageRating = feedbackData
    ? Object.values(feedbackData || {}).reduce(
        (acc, { rating }) => acc + rating,
        0
      ) / Object.values(feedbackData || {}).length
    : 0;

  return (
    <Box
      style={{ border: "2px solid orange", padding: "5px", marginTop: "5px" }}
    >
      <Typography variant="h5">User Feedbacks</Typography>
      <Box>
        {averageRating ? (
          <>
            <Rating value={averageRating} precision={0.1} readOnly />
            <Typography variant="subtitle1" component="span">
              {averageRating.toFixed(1)}
            </Typography>
          </>
        ) : null}
      </Box>
      <Box sx={styles.feedbackContainer}>
        {feedbackData && Object.keys(feedbackData).length > 0 ? (
          Object.entries(feedbackData)
            .map(([key, feedback]) => ({
              userId: key,
              ...feedback,
            }))
            .filter(({ comment }) => comment && comment.trim() !== "")
            .map((feedback) => (
              <Paper
                elevation={0}
                key={feedback.userId}
                sx={{ padding: "10px", marginBottom: "10px" }}
              >
                <Box sx={styles.content}>
                  <Avatar sx={{ bgcolor: feedback.color || "gray" }}>
                    {feedback.senderName ? feedback.senderName.charAt(0) : "?"}
                  </Avatar>
                  <Box>
                    <Box sx={styles.nameAndTime}>
                      <Typography variant="h6">
                        {feedback.senderName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#757575", paddingTop: "9px" }}
                      >
                        {new Date(
                          feedback.date?.seconds * 1000
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2">
                      {feedback.comment}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))
        ) : (
          <Typography variant="body1" sx={{ marginTop: "20px" }}>
            No feedbacks yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default FeedbackDisplay;
