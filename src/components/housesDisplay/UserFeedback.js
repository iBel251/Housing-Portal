import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Paper,
  Avatar,
} from "@mui/material";
import { UserAuth } from "../../context/AuthContext";
import { FeedbackAuth } from "../../context/FeedbackContext";
import { HouseAuth } from "../../context/HouseContext";

const styles = {
  container: {
    padding: "20px",
    gap: "20px",
    maxWidth: "800px",
    margin: "40px auto 0 auto",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
    backgroundColor: "#ffffff",
  },
  feedbackList: {
    width: "100%",
    bgcolor: "background.paper",
  },
  title: {
    fontWeight: "600",
    color: "#1976d2",
  },
  submitButton: {
    color: "white",
    marginTop: "20px",
    alignSelf: "start",
    backgroundColor: "#2D6072",
    "&:hover": {
      backgroundColor: "#2D6052",
    },
  },
  feedbackContainer: {
    marginTop: "20px",
  },
  ratingSummary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  ratingDisplay: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  commentSection: {
    marginTop: "10px",
  },
  nameAndTime: {
    display: "flex",
    gap: "10px",
  },
  content: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  averageRating: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "20px",
    marginBottom: "20px",
    justifyContent: "start",
  },
  feedbackSection: {
    width: "100%",
    marginTop: "20px",
  },
  feedbackPaper: {
    padding: "15px",
    margin: "10px 0",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
};

const UserFeedback = ({ houseId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [houseDetails, setHouseDetails] = useState(null);
  const { user } = UserAuth();
  const { addOrUpdateFeedbackForHouse } = FeedbackAuth();
  const { getHouseDetailsById } = HouseAuth();

  const fetchHouseDetails = async () => {
    try {
      const details = await getHouseDetailsById(houseId);
      setHouseDetails(details);
    } catch (error) {
      console.error("Error fetching house details:", error);
    }
  };

  useEffect(() => {
    // Fetch house details on component mount
    fetchHouseDetails();
  }, [houseId, getHouseDetailsById]);
  useEffect(() => {
    console.log("house :", houseDetails);
  }, [houseDetails]);

  const handleSubmit = async () => {
    if (!user) {
      alert("You must be logged in to submit feedback.");
      return;
    }

    if (rating < 1) {
      setError("Please pick a valid rating on the given 5 stars.");
      return;
    }

    // Call the submitFeedback function here
    try {
      await addOrUpdateFeedbackForHouse(houseId, rating, comment);
      console.log("Feedback submitted successfully.");
      // Reset form
      setRating(0);
      setComment("");
      setError("");
      // Refetch house details to update the feedback display
      await fetchHouseDetails();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    }
  };
  let averageRating = 0;
  averageRating = houseDetails
    ? Object.values(houseDetails.feedback || {}).reduce(
        (acc, { rating }) => acc + rating,
        0
      ) / Object.values(houseDetails.feedback || {}).length
    : 0;

  return (
    <Box sx={styles.container}>
      <Typography variant="h6" sx={styles.title}>
        User Reviews
      </Typography>
      <Box sx={styles.averageRating}>
        {averageRating ? (
          <>
            <Rating value={averageRating} precision={0.1} readOnly />
            <Typography variant="subtitle1" component="span">
              {averageRating.toFixed(1)}
            </Typography>
          </>
        ) : null}
      </Box>
      <Box sx={styles.feedbackSection}>
        {houseDetails ? (
          houseDetails.feedback &&
          Object.keys(houseDetails.feedback).length > 0 ? (
            <Box sx={styles.feedbackContainer}>
              {Object.entries(houseDetails.feedback)
                .map(([key, feedback]) => ({
                  userId: key,
                  ...feedback,
                })) // Convert to array of objects for easier manipulation
                .filter(({ comment }) => comment && comment.trim() !== "") // Ensure comment exists and is not just whitespace
                .map((feedback) => (
                  <Paper
                    elevation={0}
                    key={feedback.userId} // Use the corrected userId here
                    sx={{ padding: "10px", marginBottom: "10px" }}
                  >
                    <Box sx={styles.content}>
                      <Avatar sx={{ bgcolor: feedback.color || "gray" }}>
                        {feedback.senderName
                          ? feedback.senderName.charAt(0)
                          : "?"}
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
                ))}
            </Box>
          ) : (
            <Typography variant="body1" sx={{ marginTop: "20px" }}>
              No feedbacks yet. Be the first to leave feedback!
            </Typography>
          )
        ) : (
          <Typography variant="body1" sx={{ marginTop: "20px" }}>
            Loading house details...
          </Typography>
        )}
      </Box>
      <Rating
        name="simple-controlled"
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
      />
      <TextField
        label="Your Comment"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {error ? <Typography sx={{ color: "red" }}>{error}</Typography> : null}
      <Button sx={styles.submitButton} onClick={handleSubmit}>
        Submit Feedback
      </Button>
    </Box>
  );
};

export default UserFeedback;
