import Review from "../models/review.js";

export const getReviewsByCourseId = async (req, res) => {
    const { courseId } = req.params; // Extract courseId from request params
  
    try {
      const reviews = await Review.find({ courseId })
        .populate("userId", "fullName profilePic") // Populate user details (name and profile picture)
        .sort({ createdAt: -1 }); // Sort reviews by newest first
  
      const totalReviews = reviews.length; // Get the total number of reviews
  
      res.status(200).json({
        success: true,
        data: reviews,
        total: totalReviews, // Add the total number of reviews in the response
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving reviews",
        error: error.message,
      });
    }
  };
  
export const postReview = async (req, res) => {
  const { courseId, userId, reviewText } = req.body;

  // Validate request body
  if (!courseId || !userId || !reviewText) {
    return res.status(400).json({
      success: false,
      message: "All fields are required: courseId, userId, and reviewText.",
    });
  }

  try {
    const newReview = await Review.create({
      courseId,
      userId,
      reviewText,
    });

    res.status(201).json({
      success: true,
      message: "Review posted successfully",
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error posting review",
      error: error.message,
    });
  }
};
